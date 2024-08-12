import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const connection = await mysql.createPool(process.env.DATABASE_URL + "");
const db = drizzle(connection);
export default db;
