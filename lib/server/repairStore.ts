import { createHash, randomBytes, randomUUID } from "node:crypto";
import postgres from "postgres";
import { z } from "zod";
import {
  REPAIR_STATUSES,
  type CreateRepairInput,
  type CustomerRepair,
  type RepairHistoryEntry,
  type RepairStatus,
  type StaffRepair,
} from "@/lib/repairTracking";

type StoreErrorCode =
  | "invalid-input"
  | "not-configured"
  | "idempotency-conflict"
  | "not-found"
  | "stale-update"
  | "history-limit";

export class RepairStoreError extends Error {
  constructor(public readonly code: StoreErrorCode, message: string) {
    super(message);
    this.name = "RepairStoreError";
  }
}

type Row = Record<string, unknown>;

/** Small SQL boundary shared by the PostgreSQL driver and actual-SQL tests. */
export interface RepairStoreConnection {
  query(statement: string, values?: unknown[]): Promise<Row[]>;
}

export interface RepairStoreDatabase extends RepairStoreConnection {
  transaction<T>(callback: (connection: RepairStoreConnection) => Promise<T>): Promise<T>;
}

const MAX_HISTORY = 200;
const MAX_CUSTOMER_REPAIRS = 100;
const MAX_STAFF_REPAIRS = 100;
const referenceSchema = z.string().trim().toUpperCase().regex(/^OR-\d{8}-[A-F0-9]{12}$/);
const emailSchema = z.string().trim().max(254).email().toLowerCase();
const singleLine = (max: number) => z.string().trim().max(max).refine((value) => !/[\u0000-\u001f\u007f]/.test(value));
const multiLine = (max: number) => z.string().trim().max(max).refine((value) => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value));
const requestKeySchema = z.string().min(16).max(160).regex(/^[A-Za-z0-9_-]+$/);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
});
const inputSchema = z.object({
  customerEmail: emailSchema,
  customerName: singleLine(120).min(1).transform((value) => value.replace(/ +/g, " ")),
  customerPhone: singleLine(40).optional().default("")
    .transform((value) => value.replace(/[ ().-]/g, ""))
    .refine((value) => value === "" || /^\+?\d{7,15}$/.test(value)),
  deviceLabel: singleLine(200).min(1),
  repairLabel: singleLine(200).min(1),
  partLabel: singleLine(200).min(1).optional().default("To be confirmed"),
  priceLabel: singleLine(100).min(1).optional().default("Assessment required"),
  warranty: singleLine(300).min(1).optional().default("To be confirmed after assessment"),
  serviceMethod: z.enum(["drop-off", "mail-in"]).optional().default("drop-off"),
  returnAddress: multiLine(1000).nullish().transform((value) => value || ""),
  requestedDate: dateSchema.nullish().transform((value) => value || null),
  requestedTime: singleLine(40).min(1).nullish().transform((value) => value || null),
  issue: multiLine(3000).optional().default(""),
}).strict().refine((value) => value.serviceMethod !== "mail-in" || value.returnAddress.length > 0);

function parseInput<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new RepairStoreError("invalid-input", "Check the repair details and try again.");
  }
  return result.data;
}

function isoDate(value: unknown): string {
  return (value instanceof Date ? value : new Date(String(value))).toISOString();
}

function mapCustomer(row: Row): CustomerRepair {
  const history = row.history as Row[];
  return {
    reference: String(row.reference),
    deviceLabel: String(row.device_label),
    repairLabel: String(row.repair_label),
    partLabel: String(row.part_label),
    priceLabel: String(row.price_label),
    warranty: String(row.warranty),
    serviceMethod: row.service_method as CustomerRepair["serviceMethod"],
    requestedDate: row.requested_date === null ? null : String(row.requested_date),
    requestedTime: row.requested_time === null ? null : String(row.requested_time),
    issue: String(row.issue),
    status: row.status as RepairStatus,
    createdAt: isoDate(row.created_at),
    updatedAt: isoDate(row.updated_at),
    history: history.map((entry): RepairHistoryEntry => ({
      status: entry.status as RepairStatus,
      customerNote: String(entry.customer_note),
      createdAt: isoDate(entry.created_at),
    })),
  };
}

function mapStaff(row: Row): StaffRepair {
  return {
    ...mapCustomer(row),
    id: String(row.id),
    customerEmail: String(row.customer_email),
    customerName: String(row.customer_name),
    customerPhone: String(row.customer_phone),
    returnAddress: String(row.return_address),
  };
}

// Explicit allowlists keep idempotency hashes, keys and audit identities private.
const CUSTOMER_COLUMNS = `r.reference, r.device_label, r.repair_label,
  r.part_label, r.price_label, r.warranty, r.service_method,
  r.requested_date::text AS requested_date, r.requested_time, r.issue,
  r.status, r.created_at, r.updated_at,
  (SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'status', h.status, 'customer_note', h.customer_note, 'created_at', h.created_at
  ) ORDER BY h.id), '[]'::jsonb)
    FROM (SELECT id, status, customer_note, created_at FROM repair_status_history
      WHERE repair_id = r.id ORDER BY id DESC LIMIT ${MAX_HISTORY}) h) AS history`;
const STAFF_COLUMNS = `${CUSTOMER_COLUMNS}, r.id, r.customer_email,
  r.customer_name, r.customer_phone, r.return_address`;

async function readStaff(connection: RepairStoreConnection, id: string): Promise<StaffRepair> {
  const rows = await connection.query(`SELECT ${STAFF_COLUMNS} FROM repairs r WHERE r.id = $1::uuid`, [id]);
  if (!rows[0]) throw new RepairStoreError("not-found", "That repair could not be found.");
  return mapStaff(rows[0]);
}

/** All mutations are transactional; authentication belongs in the caller. */
export function createRepairStore(database: RepairStoreDatabase) {
  return {
    async createRepair(input: CreateRepairInput, requestKey: string): Promise<{ repair: StaffRepair; created: boolean }> {
      const value = parseInput(inputSchema, input);
      const key = parseInput(requestKeySchema, requestKey);
      const payloadHash = createHash("sha256").update(JSON.stringify(value)).digest("hex");
      const id = randomUUID();
      const reference = `OR-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomBytes(6).toString("hex").toUpperCase()}`;

      return database.transaction(async (connection) => {
        const inserted = await connection.query(`INSERT INTO repairs (
          id, reference, request_key, payload_hash, customer_email, customer_name,
          customer_phone, device_label, repair_label, part_label, price_label,
          warranty, service_method, return_address, requested_date, requested_time, issue
        ) VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15::date, $16, $17)
          ON CONFLICT (request_key) DO NOTHING RETURNING id`, [
          id, reference, key, payloadHash, value.customerEmail, value.customerName,
          value.customerPhone, value.deviceLabel, value.repairLabel, value.partLabel,
          value.priceLabel, value.warranty, value.serviceMethod, value.returnAddress,
          value.requestedDate, value.requestedTime, value.issue,
        ]);
        if (!inserted.length) {
          const existing = await connection.query("SELECT id, payload_hash FROM repairs WHERE request_key = $1", [key]);
          if (!existing[0] || existing[0].payload_hash !== payloadHash) {
            throw new RepairStoreError("idempotency-conflict", "This request key has already been used for different repair details.");
          }
          return { repair: await readStaff(connection, String(existing[0].id)), created: false };
        }

        await connection.query(`INSERT INTO repair_status_history (repair_id, status, customer_note)
          VALUES ($1::uuid, 'requested', 'Your repair request has been received. The team will confirm the next steps.')`, [id]);
        return { repair: await readStaff(connection, id), created: true };
      });
    },

    async listRepairsForCustomer(email: string): Promise<CustomerRepair[]> {
      const normalisedEmail = parseInput(emailSchema, email);
      const rows = await database.query(`SELECT ${CUSTOMER_COLUMNS} FROM repairs r
        WHERE r.customer_email = $1 ORDER BY r.created_at DESC, r.id DESC LIMIT ${MAX_CUSTOMER_REPAIRS}`, [normalisedEmail]);
      return rows.map(mapCustomer);
    },

    async getRepairForCustomer(reference: string, email: string): Promise<CustomerRepair | null> {
      const normalisedReference = parseInput(referenceSchema, reference);
      const normalisedEmail = parseInput(emailSchema, email);
      const rows = await database.query(`SELECT ${CUSTOMER_COLUMNS} FROM repairs r
        WHERE r.reference = $1 AND r.customer_email = $2`, [normalisedReference, normalisedEmail]);
      return rows[0] ? mapCustomer(rows[0]) : null;
    },

    async listRepairsForStaff(search = ""): Promise<StaffRepair[]> {
      const query = parseInput(singleLine(100), search).toLowerCase();
      const pattern = `%${query.replace(/[/%_]/g, "/$&")}%`;
      const rows = await database.query(`SELECT ${STAFF_COLUMNS} FROM repairs r
        WHERE $1 = '' OR lower(concat_ws(' ', r.reference, r.customer_email,
          r.customer_name, r.customer_phone, r.device_label)) LIKE $2 ESCAPE '/'
        ORDER BY r.updated_at DESC, r.id DESC LIMIT ${MAX_STAFF_REPAIRS}`, [query, pattern]);
      return rows.map(mapStaff);
    },

    async updateRepairStatus(reference: string, status: RepairStatus, customerNote: string, actorEmail: string, expectedUpdatedAt: string): Promise<StaffRepair> {
      const normalisedReference = parseInput(referenceSchema, reference);
      const nextStatus = parseInput(z.enum(REPAIR_STATUSES), status);
      const note = parseInput(multiLine(1000), customerNote);
      const actor = parseInput(emailSchema, actorEmail);
      const expected = parseInput(z.iso.datetime({ offset: true }), expectedUpdatedAt);

      return database.transaction(async (connection) => {
        const rows = await connection.query("SELECT id, updated_at FROM repairs WHERE reference = $1 FOR UPDATE", [normalisedReference]);
        if (!rows[0]) throw new RepairStoreError("not-found", "That repair could not be found.");
        if (isoDate(rows[0].updated_at) !== isoDate(expected)) {
          throw new RepairStoreError("stale-update", "This repair has changed. Refresh it before saving another update.");
        }
        const id = String(rows[0].id);
        const history = await connection.query("SELECT count(*)::int AS total FROM repair_status_history WHERE repair_id = $1::uuid", [id]);
        if (Number(history[0].total) >= MAX_HISTORY) {
          throw new RepairStoreError("history-limit", "This repair has reached its update limit. Contact the site administrator.");
        }
        // Millisecond precision survives JSON serialization, including rapid updates.
        await connection.query(`UPDATE repairs SET status = $2,
          updated_at = GREATEST(date_trunc('milliseconds', clock_timestamp()), updated_at + interval '1 millisecond')
          WHERE id = $1::uuid`, [id, nextStatus]);
        await connection.query(`INSERT INTO repair_status_history (repair_id, status, customer_note, actor_email, created_at)
          SELECT id, $2, $3, $4, updated_at FROM repairs WHERE id = $1::uuid`, [id, nextStatus, note, actor]);
        return readStaff(connection, id);
      });
    },
  };
}

let store: ReturnType<typeof createRepairStore> | undefined;

export function isRepairStoreConfigured(): boolean {
  const value = process.env.DATABASE_URL?.trim();
  if (!value) return false;
  try {
    const url = new URL(value);
    return ["postgres:", "postgresql:"].includes(url.protocol) && Boolean(url.hostname && url.pathname.length > 1);
  } catch {
    return false;
  }
}

function configuredStore() {
  if (!isRepairStoreConfigured()) {
    throw new RepairStoreError("not-configured", "Repair tracking is not configured.");
  }
  if (!store) {
    const sql = postgres(process.env.DATABASE_URL!.trim(), {
      max: 4,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
      onnotice: () => {},
    });
    const wrap = (connection: postgres.Sql | postgres.TransactionSql): RepairStoreConnection => ({
      async query(statement, values = []) {
        return Array.from(await connection.unsafe(statement, values as postgres.ParameterOrJSON<never>[])) as Row[];
      },
    });
    store = createRepairStore({
      ...wrap(sql),
      async transaction<T>(callback: (connection: RepairStoreConnection) => Promise<T>): Promise<T> {
        // postgres.js unwraps returned promises; the transaction callback result is T.
        return await sql.begin((connection) => callback(wrap(connection))) as T;
      },
    });
  }
  return store;
}

export const createRepair = (input: CreateRepairInput, requestKey: string) => configuredStore().createRepair(input, requestKey);
export const listRepairsForCustomer = (email: string) => configuredStore().listRepairsForCustomer(email);
export const getRepairForCustomer = (reference: string, email: string) => configuredStore().getRepairForCustomer(reference, email);
export const listRepairsForStaff = (search = "") => configuredStore().listRepairsForStaff(search);
export const updateRepairStatus = (reference: string, status: RepairStatus, customerNote: string, actorEmail: string, expectedUpdatedAt: string) => configuredStore().updateRepairStatus(reference, status, customerNote, actorEmail, expectedUpdatedAt);
