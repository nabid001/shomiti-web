import { boolean, date, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";

export const userTable = pgTable("users", {
  id: id,
  fullName: text("full_name").notNull(),
  username: text("username").notNull().unique(),
  dateOfBirth: date("date_of_birth"), // compute age on the fly; not stored
  gender: text("gender").notNull(),
  email: text("email").notNull().unique(),
  photo: text("photo"), // nullable — don't block user creation without a photo
  isActive: boolean("is_active").notNull().default(true), // soft-delete / deactivate members
  // mobileNumber: text("mobile_number"), // optional contact info
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;
