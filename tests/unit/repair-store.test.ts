import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { CreateRepairInput } from "@/lib/repairTracking";
import {
  createRepairStore,
  isRepairStoreConfigured,
  type RepairStoreConnection,
} from "@/lib/server/repairStore";

let database: PGlite;
let store: ReturnType<typeof createRepairStore>;

const input: CreateRepairInput = {
  customerEmail: "Customer@Example.com",
  customerName: " Test Customer ",
  customerPhone: "07123 456789",
  deviceLabel: "Apple iPhone 17",
  repairLabel: "Screen repair",
  partLabel: "Original specification",
  priceLabel: "Assessment required",
  warranty: "Confirmed after assessment",
  requestedDate: "2026-10-01",
  requestedTime: "9:00am",
  issue: "Screen cracked after a fall.",
};
const requestKey = "booking_0123456789abcdef";

beforeAll(async () => {
  database = await PGlite.create();
  await database.exec(await readFile(new URL("../../db/migrations/001_repairs.sql", import.meta.url), "utf8"));
  const wrap = (connection: Pick<PGlite, "query">): RepairStoreConnection => ({
    async query(statement, values = []) {
      return (await connection.query<Record<string, unknown>>(statement, values)).rows;
    },
  });
  store = createRepairStore({
    ...wrap(database),
    transaction: (callback) => database.transaction((transaction) => callback(wrap(transaction))),
  });
}, 30_000);

beforeEach(async () => {
  await database.exec("TRUNCATE repairs, repair_status_history RESTART IDENTITY CASCADE");
});

afterEach(() => vi.unstubAllEnvs());
afterAll(async () => database?.close());

describe("persistent repair tracking", () => {
  it("saves a repair and initial history with normalized contact details", async () => {
    const result = await store.createRepair(input, requestKey);

    expect(result.created).toBe(true);
    expect(result.repair).toMatchObject({
      customerEmail: "customer@example.com",
      customerName: "Test Customer",
      customerPhone: "07123456789",
      deviceLabel: input.deviceLabel,
      requestedDate: "2026-10-01",
      requestedTime: "9:00am",
      serviceMethod: "drop-off",
      status: "requested",
      returnAddress: "",
    });
    expect(result.repair.reference).toMatch(/^OR-\d{8}-[A-F0-9]{12}$/);
    expect(result.repair.history).toEqual([
      expect.objectContaining({ status: "requested", customerNote: expect.any(String) }),
    ]);
    expect(result.repair.createdAt).toMatch(/\.\d{3}Z$/);
  });

  it("defaults manual entries without inventing an appointment or price", async () => {
    const { repair } = await store.createRepair({
      customerEmail: input.customerEmail,
      customerName: input.customerName,
      deviceLabel: "Samsung Galaxy S26",
      repairLabel: "Charging issue",
    }, requestKey);

    expect(repair).toMatchObject({
      customerPhone: "",
      requestedDate: null,
      requestedTime: null,
      priceLabel: "Assessment required",
      partLabel: "To be confirmed",
      warranty: "To be confirmed after assessment",
      issue: "",
    });
  });

  it("returns the same repair on simultaneous identical retries", async () => {
    const results = await Promise.all([
      store.createRepair(input, requestKey),
      store.createRepair({ ...input, customerEmail: "customer@example.com", customerName: "Test   Customer", customerPhone: "07123456789" }, requestKey),
    ]);

    expect(results.map((result) => result.created).sort()).toEqual([false, true]);
    expect(results[0].repair.reference).toBe(results[1].repair.reference);
    expect((await store.listRepairsForStaff())[0].history).toHaveLength(1);
    await expect(store.createRepair({ ...input, issue: "Different issue" }, requestKey))
      .rejects.toMatchObject({ code: "idempotency-conflict" });
    await expect(store.createRepair({ ...input, customerEmail: "other@example.com" }, requestKey))
      .rejects.toMatchObject({ code: "idempotency-conflict" });
  });

  it("scopes customer reads by email and excludes contact, audit and idempotency fields", async () => {
    const { repair } = await store.createRepair(input, requestKey);
    await store.updateRepairStatus(repair.reference, "received", "Your device is here.", "Staff@Example.com", repair.updatedAt);
    await store.createRepair({ ...input, customerEmail: "someoneelse@example.com" }, "booking_another0123456");

    const customer = await store.getRepairForCustomer(repair.reference.toLowerCase(), " CUSTOMER@EXAMPLE.COM ");
    expect(customer?.status).toBe("received");
    expect(customer?.history[1]).toMatchObject({ status: "received", customerNote: "Your device is here." });
    for (const field of ["id", "customerEmail", "customerName", "customerPhone", "returnAddress", "payloadHash", "requestKey", "actorEmail"]) {
      expect(customer).not.toHaveProperty(field);
      expect(customer?.history[1]).not.toHaveProperty(field);
    }
    expect(JSON.stringify(customer)).not.toContain("staff@example.com");
    expect(await store.getRepairForCustomer(repair.reference, "someoneelse@example.com")).toBeNull();
    expect(await store.listRepairsForCustomer("customer@example.com")).toHaveLength(1);
    expect(await store.listRepairsForCustomer("nobody@example.com")).toEqual([]);
  });

  it("makes status/history updates atomic and rejects a stale staff editor", async () => {
    const { repair } = await store.createRepair(input, requestKey);
    const results = await Promise.allSettled([
      store.updateRepairStatus(repair.reference, "assessing", "We are checking the device.", "staff@example.com", repair.updatedAt),
      store.updateRepairStatus(repair.reference, "repairing", "Repair started.", "staff@example.com", repair.updatedAt),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.find((result) => result.status === "rejected")).toMatchObject({ reason: { code: "stale-update" } });
    const current = (await store.listRepairsForStaff())[0];
    expect(current.history).toHaveLength(2);
    expect(current.history[1].status).toBe(current.status);
    expect(new Date(current.updatedAt).getTime()).toBeGreaterThan(new Date(repair.updatedAt).getTime());
    const finished = await store.updateRepairStatus(current.reference, "returned", "Your device has been returned.", "staff@example.com", current.updatedAt);
    expect(finished.status).toBe("returned");
    expect(finished.history).toHaveLength(3);
  });

  it("rolls back the status if the history cannot be saved", async () => {
    const { repair } = await store.createRepair(input, requestKey);
    await database.exec("ALTER TABLE repair_status_history ADD CONSTRAINT test_history_failure CHECK (customer_note <> 'Force history failure')");
    try {
      await expect(store.updateRepairStatus(repair.reference, "repairing", "Force history failure", "staff@example.com", repair.updatedAt)).rejects.toThrow();
      const current = (await store.listRepairsForStaff())[0];
      expect(current.status).toBe("requested");
      expect(current.updatedAt).toBe(repair.updatedAt);
      expect(current.history).toHaveLength(1);
    } finally {
      await database.exec("ALTER TABLE repair_status_history DROP CONSTRAINT test_history_failure");
    }
  });

  it("requires a return address for mail-in and rejects invalid or oversized data before writing", async () => {
    await expect(store.createRepair({ ...input, serviceMethod: "mail-in" }, requestKey)).rejects.toMatchObject({ code: "invalid-input" });
    await expect(store.createRepair({ ...input, customerEmail: "invalid" }, requestKey)).rejects.toMatchObject({ code: "invalid-input" });
    await expect(store.createRepair({ ...input, requestedDate: "2026-02-30" }, requestKey)).rejects.toMatchObject({ code: "invalid-input" });
    await expect(store.createRepair({ ...input, customerName: "Injected\nHeader" }, requestKey)).rejects.toMatchObject({ code: "invalid-input" });
    await expect(store.createRepair({ ...input, issue: "a".repeat(3001) }, requestKey)).rejects.toMatchObject({ code: "invalid-input" });
    expect(await store.listRepairsForStaff()).toEqual([]);
    const { repair } = await store.createRepair({ ...input, serviceMethod: "mail-in", returnAddress: "10 Test Street\nLeeds\nLS1 1AA" }, requestKey);
    expect(repair.returnAddress).toContain("\nLeeds\n");
    await expect(store.updateRepairStatus(repair.reference, "ready", "a".repeat(1001), "staff@example.com", repair.updatedAt)).rejects.toMatchObject({ code: "invalid-input" });
  });

  it("treats search input as literal text and bounds results and search size", async () => {
    const { repair } = await store.createRepair({ ...input, customerName: "O'Brien 100%" }, requestKey);
    expect((await store.listRepairsForStaff("O'Brien"))[0].reference).toBe(repair.reference);
    expect((await store.listRepairsForStaff("%"))[0].reference).toBe(repair.reference);
    expect(await store.listRepairsForStaff("' OR 1=1 --")).toEqual([]);
    expect(await store.listRepairsForStaff("_")).toEqual([]);
    await expect(store.listRepairsForStaff("a".repeat(101))).rejects.toMatchObject({ code: "invalid-input" });
    await database.query(`INSERT INTO repairs (
      id, reference, request_key, payload_hash, customer_email, customer_name, device_label, repair_label
    ) SELECT ('00000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
      'OR-20000101-' || lpad(n::text, 12, '0'),
      'test_request_key_' || n, repeat('a', 64), 'customer@example.com', 'Customer', 'Phone', 'Assessment'
      FROM generate_series(1, 105) n`);
    expect(await store.listRepairsForStaff()).toHaveLength(100);
    expect(await store.listRepairsForCustomer("customer@example.com")).toHaveLength(100);
  });

  it("bounds history without silently discarding customer updates", async () => {
    const { repair } = await store.createRepair(input, requestKey);
    await database.query(`INSERT INTO repair_status_history (repair_id, status, customer_note)
      SELECT $1::uuid, 'assessing', 'Assessment update' FROM generate_series(1, 199)`, [repair.id]);
    await expect(store.updateRepairStatus(repair.reference, "ready", "Ready.", "staff@example.com", repair.updatedAt)).rejects.toMatchObject({ code: "history-limit" });
    const current = (await store.listRepairsForStaff())[0];
    expect(current.status).toBe("requested");
    expect(current.history).toHaveLength(200);
  });

  it("identifies configured database URLs without opening a connection", () => {
    vi.stubEnv("DATABASE_URL", "");
    expect(isRepairStoreConfigured()).toBe(false);
    vi.stubEnv("DATABASE_URL", "https://example.com/database");
    expect(isRepairStoreConfigured()).toBe(false);
    vi.stubEnv("DATABASE_URL", "postgresql://user:private@example.com/repairs?sslmode=require");
    expect(isRepairStoreConfigured()).toBe(true);
  });
});
