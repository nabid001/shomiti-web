import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";

export const userTable = pgTable("users", {
  id: id,
  fullName: text("full_name").notNull(),
  username: text("username").notNull().unique(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  email: text("email").notNull().unique(),
  photo: text("photo").notNull(),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;
