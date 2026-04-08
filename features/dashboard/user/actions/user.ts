"use server";

import { db } from "@/drizzle/db";
import { userTable } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { InsertUser } from "@/drizzle/schemas";
import { userFormSchema } from "@/schema/user-form-schema";

export const getAllUsers = cache(async () => {
  try {
    return await db.select().from(userTable);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
});

export const getActiveUsersBasic = cache(async () => {
  try {
    return await db
      .select({
        id: userTable.id,
        fullName: userTable.fullName,
        photo: userTable.photo,
        isActive: userTable.isActive,
      })
      .from(userTable)
      .where(eq(userTable.isActive, true));
  } catch (error) {
    console.error("Error fetching active users:", error);
    throw new Error("Failed to fetch active users");
  }
});

export const getUserById = cache(async (id: string) => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id))
    .limit(1);
  return user ?? null;
});

export const createUser = async (data: InsertUser) => {
  const safe = userFormSchema.safeParse(data);
  if (!safe.success) {
    return { error: true, message: safe.error.flatten().fieldErrors };
  }

  const [newUser] = await db
    .insert(userTable)
    .values(safe.data)
    .returning({ id: userTable.id });

  if (!newUser) {
    return { error: true, message: "Failed to create member." };
  }

  revalidatePath("/dashboard/user");
  return { error: false, id: newUser.id };
};

export async function updateUser(id: string, data: Partial<InsertUser>) {
  const [updated] = await db
    .update(userTable)
    .set(data)
    .where(eq(userTable.id, id))
    .returning({ id: userTable.id });

  revalidatePath("/dashboard/user");
  revalidatePath(`/dashboard/user/${id}`);
  return updated;
}

export async function deleteUser(id: string) {
  await db.delete(userTable).where(eq(userTable.id, id));
  revalidatePath("/dashboard/user");
}

export async function toggleUserActive(id: string, isActive: boolean) {
  await db.update(userTable).set({ isActive }).where(eq(userTable.id, id));
  revalidatePath("/dashboard/user");
  revalidatePath(`/dashboard/user/${id}`);
}
