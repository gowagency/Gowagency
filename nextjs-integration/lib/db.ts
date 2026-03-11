import { Pool } from "pg";

// Conexão singleton — reutiliza o pool entre requests no Next.js
const globalForPg = globalThis as unknown as { pgPool?: Pool };

export const db =
  globalForPg.pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = db;
}
