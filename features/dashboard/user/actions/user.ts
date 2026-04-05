"use server";

import { InsertUser, userTable } from "@/drizzle/schemas";
import { userFormSchema } from "../schema/user-form-schema";
import { db } from "@/drizzle/db";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export const getAllUsers = cache(async () => {
  try {
    const users = await db.select().from(userTable);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
});

export const createUser = async (data: InsertUser) => {
  const safeData = userFormSchema.safeParse(data);
  if (safeData.error) {
    return {
      error: true,
      message: safeData.error,
    };
  }

  const [newUser] = await db
    .insert(userTable)
    .values(safeData.data)
    .returning({ id: userTable.id });

  if (!newUser) {
    return {
      error: true,
      message: "Failed to create user",
    };
  }

  return newUser;
};

export async function deleteUser(id: string) {
  await db.delete(userTable).where(eq(userTable.id, id));
  revalidatePath("/dashboard/users");
}

export async function updateUser(id: string, data: any) {
  await db.update(userTable).set(data).where(eq(userTable.id, id));
  revalidatePath("/dashboard/users");
}
