import { Pool } from "pg";

// One shared connection pool per server instance.
// DATABASE_URL is set automatically when you add a Postgres database
// (for example Neon) to the project from the Vercel dashboard.
let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL!;
    const local = /localhost|127\.0\.0\.1/.test(url);
    pool = new Pool({ connectionString: url, max: 3, ssl: local ? undefined : { rejectUnauthorized: false } });
  }
  return pool;
}

// Creates the table the first time the app talks to a fresh database.
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(
        `CREATE TABLE IF NOT EXISTS events (
          id BIGSERIAL PRIMARY KEY,
          ts TIMESTAMPTZ NOT NULL DEFAULT now(),
          visitor_id TEXT NOT NULL,
          event TEXT NOT NULL,
          path TEXT,
          city TEXT,
          target TEXT,
          referrer_host TEXT,
          country TEXT
        );
        CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts);
        CREATE INDEX IF NOT EXISTS events_visitor_idx ON events (visitor_id, ts);`,
      )
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureSchema();
  const res = await getPool().query(text, params);
  return res.rows as T[];
}
