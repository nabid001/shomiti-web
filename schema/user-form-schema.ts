import * as z from "zod";

export const userFormSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  dateOfBirth: z.string().optional(),
  gender: z.string().min(1, { message: "Gender is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  photo: z.string().url({ message: "Photo is required" }).optional(),
  isActive: z.boolean().default(true),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;
