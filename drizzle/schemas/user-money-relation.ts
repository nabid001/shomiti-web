import { defineRelations } from "drizzle-orm";
import { userTable } from "./user";
import { moneyTable } from "./money";

export const relations = defineRelations({ userTable, moneyTable }, (r) => ({
  userTable: {
    money: r.many.moneyTable({
      from: r.userTable.id,
      to: r.moneyTable.payedBy,
    }),
  },

  moneyTable: {
    user: r.one.userTable({
      from: r.moneyTable.payedBy,
      to: r.userTable.id,
    }),
  },
}));
