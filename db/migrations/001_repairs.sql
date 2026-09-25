-- Apply once with the deployment migration command, before enabling tracking.
-- Application requests never create or alter tables.
BEGIN;

CREATE TABLE IF NOT EXISTS repairs (
  id uuid PRIMARY KEY,
  reference text NOT NULL UNIQUE CHECK (reference ~ '^OR-[0-9]{8}-[A-F0-9]{12}$'),
  request_key text NOT NULL UNIQUE CHECK (char_length(request_key) BETWEEN 16 AND 160),
  payload_hash text NOT NULL CHECK (payload_hash ~ '^[a-f0-9]{64}$'),
  customer_email text NOT NULL CHECK (customer_email = lower(customer_email) AND char_length(customer_email) BETWEEN 3 AND 254),
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 120),
  customer_phone text NOT NULL DEFAULT '' CHECK (char_length(customer_phone) <= 40),
  device_label text NOT NULL CHECK (char_length(device_label) BETWEEN 1 AND 200),
  repair_label text NOT NULL CHECK (char_length(repair_label) BETWEEN 1 AND 200),
  part_label text NOT NULL DEFAULT 'To be confirmed' CHECK (char_length(part_label) BETWEEN 1 AND 200),
  price_label text NOT NULL DEFAULT 'Assessment required' CHECK (char_length(price_label) BETWEEN 1 AND 100),
  warranty text NOT NULL DEFAULT 'To be confirmed after assessment' CHECK (char_length(warranty) BETWEEN 1 AND 300),
  service_method text NOT NULL DEFAULT 'drop-off' CHECK (service_method IN ('drop-off', 'mail-in')),
  return_address text NOT NULL DEFAULT '' CHECK (char_length(return_address) <= 1000),
  requested_date date,
  requested_time text CHECK (char_length(requested_time) BETWEEN 1 AND 40),
  issue text NOT NULL DEFAULT '' CHECK (char_length(issue) <= 3000),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'received', 'assessing', 'awaiting-approval', 'repairing', 'ready', 'returned', 'cancelled')),
  created_at timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (service_method <> 'mail-in' OR char_length(return_address) > 0)
);

CREATE INDEX IF NOT EXISTS repairs_customer_email_created_idx ON repairs (customer_email, created_at DESC);
CREATE INDEX IF NOT EXISTS repairs_updated_idx ON repairs (updated_at DESC);
CREATE INDEX IF NOT EXISTS repairs_status_updated_idx ON repairs (status, updated_at DESC);

CREATE TABLE IF NOT EXISTS repair_status_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  repair_id uuid NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('requested', 'received', 'assessing', 'awaiting-approval', 'repairing', 'ready', 'returned', 'cancelled')),
  customer_note text NOT NULL DEFAULT '' CHECK (char_length(customer_note) <= 1000),
  actor_email text CHECK (actor_email = lower(actor_email) AND char_length(actor_email) <= 254),
  created_at timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS repair_status_history_repair_idx ON repair_status_history (repair_id, id);

COMMIT;
