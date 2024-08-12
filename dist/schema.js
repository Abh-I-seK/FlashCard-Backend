import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
export const Admin = mysqlTable("users", {
    id: serial("id").primaryKey(),
    adminName: varchar("admin_name", { length: 20 }),
    adminPassword: varchar("admin_password", { length: 20 }),
});
export const Flashcard = mysqlTable("flashcard", {
    id: serial("id").primaryKey(),
    question: varchar("question", { length: 50 }),
    answer: varchar("answer", { length: 50 }),
});
