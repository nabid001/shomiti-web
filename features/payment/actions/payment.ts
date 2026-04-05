"use server";

import { db } from "@/drizzle/db";
import { moneyTable, userTable } from "@/drizzle/schemas";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { InsertMoney } from "@/drizzle/schemas";
import { paymentFormSchema } from "@/schema/payment-form-schema";

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

  revalidatePath("/dashboard/payment");
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

export async function getAllPayments() {
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
}

// ─── Get payments for one user ────────────────────────────────────────────

export async function getPaymentsByUser(userId: string) {
  return db
    .select()
    .from(moneyTable)
    .where(eq(moneyTable.paidBy, userId))
    .orderBy(moneyTable.paymentYear, moneyTable.paymentMonth);
}

// ─── Monthly status: who paid, who didn't, for a given month/year ─────────
// Returns every active member annotated with their payment record (or null).

export async function getMonthlyPaymentStatus(month: number, year: number) {
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
      and(eq(moneyTable.paymentMonth, month), eq(moneyTable.paymentYear, year))
    );

  const paymentMap = new Map(payments.map((p) => [p.paidBy, p]));

  return members.map((member) => ({
    ...member,
    payment: paymentMap.get(member.id) ?? null,
  }));
}

// ─── Dashboard stats ──────────────────────────────────────────────────────

export async function getDashboardStats() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [allMembers, allPayments, thisMonthPayments] = await Promise.all([
    db
      .select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.isActive, true)),
    db.select({ amount: moneyTable.amount }).from(moneyTable),
    db
      .select({ id: moneyTable.id })
      .from(moneyTable)
      .where(
        and(
          eq(moneyTable.paymentMonth, currentMonth),
          eq(moneyTable.paymentYear, currentYear)
        )
      ),
  ]);

  const totalCollected = allPayments.reduce((sum, p) => sum + p.amount, 0);
  const activeMembers = allMembers.length;
  const paidThisMonth = thisMonthPayments.length;
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
}
