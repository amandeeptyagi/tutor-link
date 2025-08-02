import { DATABASE_URL, NODE_ENV } from "./env.js";
import pkg from "pg";
const { Pool } = pkg;

const isProduction = NODE_ENV === "production";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ...(isProduction && { ssl: { rejectUnauthorized: false } })
});

export default pool;
