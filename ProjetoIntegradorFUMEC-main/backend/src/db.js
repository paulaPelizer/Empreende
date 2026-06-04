import pg from 'pg';

const { Pool } = pg;

function createPoolConfig() {
  if (process.env.DATABASE_URL) {
    const databaseUrl = process.env.DATABASE_URL;
    const useSsl =
      process.env.DB_SSL === 'true' ||
      databaseUrl.includes('sslmode=require') ||
      databaseUrl.includes('ssl=true');

    return {
      connectionString: databaseUrl,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      max: Number(process.env.DB_POOL_MAX ?? 10),
    };
  }

  const socketPath =
    process.env.INSTANCE_UNIX_SOCKET ||
    (process.env.CLOUD_SQL_CONNECTION_NAME
      ? `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
      : undefined);

  return {
    host: socketPath || process.env.PGHOST || 'localhost',
    port: socketPath ? undefined : Number(process.env.PGPORT ?? 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    max: Number(process.env.DB_POOL_MAX ?? 10),
  };
}

export const pool = new Pool(createPoolConfig());

pool.on('error', (error) => {
  console.error('Erro inesperado no pool PostgreSQL:', error);
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
