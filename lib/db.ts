import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __superComputersPool: Pool | undefined;
}

const pool =
  global.__superComputersPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes(
      "sslmode=require"
    )
      ? { rejectUnauthorized: false }
      : undefined,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  global.__superComputersPool = pool;
}

export async function db<T>(
  text: string,
  values: unknown[] = []
): Promise<T[]> {
  const result = await pool.query(
    text,
    values
  );

  return result.rows as T[];
}

export async function initDb() {
  /*
   * Existing tables
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS worker_tasks (
      id UUID PRIMARY KEY,
      owner TEXT NOT NULL,
      type TEXT NOT NULL
        CHECK (type IN ('wallet', 'floor', 'mint')),
      target TEXT NOT NULL,
      condition TEXT NOT NULL,

      /*
       * Contract address is used for realtime
       * mint monitoring.
       */
      contract_address TEXT,

      active BOOLEAN NOT NULL DEFAULT TRUE,

      last_checked_at TIMESTAMPTZ,
      last_triggered_at TIMESTAMPTZ,
      last_event_key TEXT,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS worker_tasks_owner_idx
      ON worker_tasks(owner);

    CREATE INDEX IF NOT EXISTS worker_tasks_active_idx
      ON worker_tasks(active);

    CREATE INDEX IF NOT EXISTS worker_tasks_contract_idx
      ON worker_tasks(contract_address);
  `);

  /*
   * If worker_tasks already existed before
   * contract_address was added, ALTER TABLE
   * will add the missing column.
   */
  await pool.query(`
    ALTER TABLE worker_tasks
    ADD COLUMN IF NOT EXISTS contract_address TEXT;
  `);

  /*
   * Existing event table
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS worker_events (
      id UUID PRIMARY KEY,
      task_id UUID NOT NULL
        REFERENCES worker_tasks(id)
        ON DELETE CASCADE,

      owner TEXT NOT NULL,
      message TEXT NOT NULL,
      event_key TEXT NOT NULL,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE UNIQUE INDEX IF NOT EXISTS
      worker_events_unique_event
    ON worker_events(task_id, event_key);
  `);
}