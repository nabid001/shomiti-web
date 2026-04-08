import { userTable } from "./user";
import {
  pgTable,
  integer,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";

export const moneyTable = pgTable(
  "money",
  {
    id: id,
    amount: integer("amount").notNull(),
    paymentMonth: integer("payment_month").notNull(), // 1–12
    paymentYear: integer("payment_year").notNull(), // e.g. 2024
    paidBy: uuid("paid_by").references(() => userTable.id, {
      onDelete: "cascade",
    }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("money_month_year_idx").on(table.paymentYear, table.paymentMonth),
    index("money_paid_by_idx").on(table.paidBy),
    uniqueIndex("money_paid_by_month_year_unique").on(
      table.paidBy,
      table.paymentMonth,
      table.paymentYear
    ),
  ]
);

export type InsertMoney = typeof moneyTable.$inferInsert;
export type SelectMoney = typeof moneyTable.$inferSelect;
