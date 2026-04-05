import * as z from "zod";

export const paymentFormSchema = z.object({
  paidBy: z.string().uuid({ message: "Please select a member" }),
  amount: z.coerce.number().min(1, { message: "Amount must be at least 1" }),
  paymentMonth: z.coerce.number().min(1).max(12),
  paymentYear: z.coerce.number().min(2000).max(2100),
});

export type PaymentFormSchema = z.infer<typeof paymentFormSchema>;
