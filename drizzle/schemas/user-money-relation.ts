import { defineRelations } from "drizzle-orm";
import { userTable } from "./user";
import { moneyTable } from "./money";

export const relations = defineRelations({ userTable, moneyTable }, (r) => ({
  userTable: {
    money: r.many.moneyTable({
      from: r.userTable.id,
      to: r.moneyTable.paidBy,
    }),
  },

  moneyTable: {
    user: r.one.userTable({
      from: r.moneyTable.paidBy,
      to: r.userTable.id,
    }),
  },
}));
