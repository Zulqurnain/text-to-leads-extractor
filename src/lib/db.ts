import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST ?? "localhost",
      user: process.env.DB_USER!,
      password: process.env.DB_PASS!,
      database: process.env.DB_NAME!,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

export async function query<T = mysql.RowDataPacket[]>(
  sql: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[]
): Promise<T> {
  const [rows] = await getPool().execute(sql, params);
  return rows as T;
}
