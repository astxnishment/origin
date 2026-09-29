import { readFile } from 'node:fs/promises';
import nextEnv from '@next/env';
import postgres from 'postgres';

nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const action = process.argv[2];
if (!['migrate', 'check'].includes(action)) {
  console.error('Use npm run db:migrate or npm run db:check.');
  process.exit(1);
}
const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl || !/^postgres(?:ql)?:\/\//.test(databaseUrl)) {
  console.error('Configure DATABASE_URL for the intended PostgreSQL database first.');
  process.exit(1);
}
const sql = postgres(databaseUrl, { max: 1, connect_timeout: 10, idle_timeout: 5, onnotice() {} });
try {
  if (action === 'migrate') {
    const migration = await readFile(new URL('../db/migrations/001_repairs.sql', import.meta.url), 'utf8');
    await sql.unsafe(migration);
    console.log('Repair database migration applied.');
  }
  // Validate all required columns without reading any customer records.
  await sql`SELECT id, reference, request_key, payload_hash, customer_email,
    customer_name, customer_phone, device_label, repair_label, part_label,
    price_label, warranty, service_method, return_address, requested_date,
    requested_time, issue, status, created_at, updated_at FROM repairs LIMIT 0`;
  await sql`SELECT id, repair_id, status, customer_note, actor_email, created_at
    FROM repair_status_history LIMIT 0`;
  console.log('Repair database connection and required columns verified. No customer records read.');
} catch (error) {
  // Never print connection strings, SQL parameters, or database error details.
  console.error(`Repair database ${action} failed. Check connectivity, permissions and the migration; no credentials were printed.`);
  if (error && typeof error === 'object' && 'code' in error && /^[A-Z0-9_]{2,30}$/.test(String(error.code))) {
    console.error(`Database error code: ${error.code}`);
  }
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
