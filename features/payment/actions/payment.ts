"use server";

import { db } from "@/drizzle/db";
import { moneyTable, userTable } from "@/drizzle/schemas";
import { eq, and, count, sum } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { InsertMoney } from "@/drizzle/schemas";
import { paymentFormSchema } from "@/schema/payment-form-schema";
import { cache } from "react";
import { getCurrentMonthYear } from "@/lib/utils";

// ─── Create ────────────────────────────────────────────────────────────────

export async function createPayment(data: InsertMoney) {
  const safe = paymentFormSchema.safeParse(data);
  if (!safe.success) {
    return { error: true, message: safe.error.flatten().fieldErrors };
  }

  // Prevent duplicate payment for same member + month + year
  const existing = await db
    .select({ id: moneyTable.id })
    .from(moneyTable)
    .where(
      and(
        eq(moneyTable.paidBy, safe.data.paidBy!),
        eq(moneyTable.paymentMonth, safe.data.paymentMonth),
        eq(moneyTable.paymentYear, safe.data.paymentYear)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return {
      error: true,
      message: "This member has already paid for that month.",
    };
  }

  const [payment] = await db
    .insert(moneyTable)
    .values(safe.data)
    .returning({ id: moneyTable.id });

  if (!payment) {
    return { error: true, message: "Failed to record payment." };
  }

  // revalidatePath("/dashboard/payment");
  revalidatePath("/dashboard");
  return { error: false, id: payment.id };
}

// ─── Delete ────────────────────────────────────────────────────────────────

export async function deletePayment(id: string) {
  await db.delete(moneyTable).where(eq(moneyTable.id, id));
  revalidatePath("/dashboard/payment");
  revalidatePath("/dashboard");
}

// ─── Get all payments (with member name) ──────────────────────────────────

export const getAllPayments = cache(async () => {
  return db
    .select({
      id: moneyTable.id,
      amount: moneyTable.amount,
      paymentMonth: moneyTable.paymentMonth,
      paymentYear: moneyTable.paymentYear,
      paidBy: moneyTable.paidBy,
      memberName: userTable.fullName,
      createdAt: moneyTable.createdAt,
    })
    .from(moneyTable)
    .leftJoin(userTable, eq(moneyTable.paidBy, userTable.id))
    .orderBy(moneyTable.paymentYear, moneyTable.paymentMonth);
});

// ─── Get payments for one user ────────────────────────────────────────────

export const getPaymentsByUser = cache(async (userId: string) => {
  return db
    .select()
    .from(moneyTable)
    .where(eq(moneyTable.paidBy, userId))
    .orderBy(moneyTable.paymentYear, moneyTable.paymentMonth);
});

// ─── Monthly status: who paid, who didn't, for a given month/year ─────────
// Returns every active member annotated with their payment record (or null).

export const getMonthlyPaymentStatus = cache(
  async (month: number, year: number) => {
    const members = await db
      .select({
        id: userTable.id,
        fullName: userTable.fullName,
        username: userTable.username,
        photo: userTable.photo,
      })
      .from(userTable)
      .where(eq(userTable.isActive, true));

    const payments = await db
      .select()
      .from(moneyTable)
      .where(
        and(
          eq(moneyTable.paymentMonth, month),
          eq(moneyTable.paymentYear, year)
        )
      );

    const paymentMap = new Map(payments.map((p) => [p.paidBy, p]));

    return members.map((member) => ({
      ...member,
      payment: paymentMap.get(member.id) ?? null,
    }));
  }
);

// export async function getMonthlyPaymentStatus({
//   month,
//   year,
//   page = 1,
//   pageSize = 10,
//   search = "",
//   status = "all", // "all" | "paid" | "unpaid"
//   sortBy = "fullName", // "fullName" | "amount" | "status"
//   sortOrder = "asc", // "asc" | "desc"
// }: {
//   month: number;
//   year: number;
//   page?: number;
//   pageSize?: number;
//   search?: string;
//   status?: "all" | "paid" | "unpaid";
//   sortBy?: "fullName" | "amount" | "status";
//   sortOrder?: "asc" | "desc";
// }) {
//   const offset = (page - 1) * pageSize;

//   // ── Base query with LEFT JOIN ─────────────────────────
//   const baseQuery = db
//     .select({
//       id: userTable.id,
//       fullName: userTable.fullName,
//       username: userTable.username,
//       photo: userTable.photo,
//       payment: {
//         id: moneyTable.id,
//         amount: moneyTable.amount,
//         paymentMonth: moneyTable.paymentMonth,
//         paymentYear: moneyTable.paymentYear,
//       },
//     })
//     .from(userTable)
//     .leftJoin(
//       moneyTable,
//       and(
//         eq(moneyTable.paidBy, userTable.id),
//         eq(moneyTable.paymentMonth, month),
//         eq(moneyTable.paymentYear, year)
//       )
//     )
//     .where(eq(userTable.isActive, true));

//   // ── Dynamic filters ───────────────────────────────────
//   const filters = [];

//   // Search (name or username)
//   if (search) {
//     filters.push(
//       or(
//         ilike(userTable.fullName, `%${search}%`),
//         ilike(userTable.username, `%${search}%`)
//       )
//     );
//   }

//   // Status filter
//   if (status === "paid") {
//     filters.push(isNotNull(moneyTable.id));
//   } else if (status === "unpaid") {
//     filters.push(isNull(moneyTable.id));
//   }

//   // Apply filters
//   const whereClause =
//     filters.length > 0
//       ? and(eq(userTable.isActive, true), ...filters)
//       : eq(userTable.isActive, true);

//   // ── Sorting ───────────────────────────────────────────
//   let orderBy;

//   if (sortBy === "fullName") {
//     orderBy =
//       sortOrder === "asc" ? asc(userTable.fullName) : desc(userTable.fullName);
//   } else if (sortBy === "amount") {
//     orderBy =
//       sortOrder === "asc" ? asc(moneyTable.amount) : desc(moneyTable.amount);
//   } else if (sortBy === "status") {
//     orderBy = sortOrder === "asc" ? asc(moneyTable.id) : desc(moneyTable.id);
//   }

//   // ── Final query ───────────────────────────────────────
//   const data = await db
//     .select({
//       id: userTable.id,
//       fullName: userTable.fullName,
//       username: userTable.username,
//       photo: userTable.photo,
//       payment: {
//         id: moneyTable.id,
//         amount: moneyTable.amount,
//         paymentMonth: moneyTable.paymentMonth,
//         paymentYear: moneyTable.paymentYear,
//       },
//     })
//     .from(userTable)
//     .leftJoin(
//       moneyTable,
//       and(
//         eq(moneyTable.paidBy, userTable.id),
//         eq(moneyTable.paymentMonth, month),
//         eq(moneyTable.paymentYear, year)
//       )
//     )
//     .where(whereClause)
//     .orderBy(orderBy)
//     .limit(pageSize)
//     .offset(offset);

//   // ── Total count (for pagination) ──────────────────────
//   const [{ count }] = await db
//     .select({ count: sql<number>`count(*)` })
//     .from(userTable)
//     .leftJoin(
//       moneyTable,
//       and(
//         eq(moneyTable.paidBy, userTable.id),
//         eq(moneyTable.paymentMonth, month),
//         eq(moneyTable.paymentYear, year)
//       )
//     )
//     .where(whereClause);

//   return {
//     data: data.map((row) => ({
//       ...row,
//       payment: row?.payment?.id ? row.payment : null,
//     })),
//     total: count,
//     page,
//     pageSize,
//     totalPages: Math.ceil(count / pageSize),
//   };
// }

// ─── Dashboard stats ──────────────────────────────────────────────────────

export const getDashboardStats = cache(async () => {
  const res = getCurrentMonthYear();
  const [activeMembersResult, totalCollectedResult, thisMonthPaymentsResult] =
    await Promise.all([
      db
        .select({ count: count(userTable.id) })
        .from(userTable)
        .where(eq(userTable.isActive, true)),
      db.select({ total: sum(moneyTable.amount) }).from(moneyTable),
      db
        .select({ count: count(moneyTable.id) })
        .from(moneyTable)
        .where(
          and(
            eq(moneyTable.paymentMonth, res.monthPlusOne),
            eq(moneyTable.paymentYear, res.year)
          )
        ),
    ]);

  const activeMembers = Number(activeMembersResult[0]?.count ?? 0);
  const totalCollected = Number(totalCollectedResult[0]?.total ?? 0);
  const paidThisMonth = Number(thisMonthPaymentsResult[0]?.count ?? 0);
  const missedThisMonth = activeMembers - paidThisMonth;
  const collectionRate =
    activeMembers > 0 ? Math.round((paidThisMonth / activeMembers) * 100) : 0;

  return {
    totalCollected,
    activeMembers,
    missedThisMonth,
    collectionRate,
    paidThisMonth,
  };
});
