import { userTable } from "./user";
import { pgTable, integer, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";

export const moneyTable = pgTable("money", {
  id: id,
  amount: integer("amount").notNull(),
  paymentMonth: integer("payment_month").notNull(), // 1–12
  paymentYear: integer("payment_year").notNull(), // e.g. 2024
  paidBy: uuid("paid_by").references(() => userTable.id),
  createdAt,
  updatedAt,
});

export type InsertMoney = typeof moneyTable.$inferInsert;
export type SelectMoney = typeof moneyTable.$inferSelect;
