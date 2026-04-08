"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon } from "lucide-react";
import { createPayment } from "../actions/payment";
import { paymentFormSchema } from "@/schema/payment-form-schema";

const MONTHS = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type FormValues = z.infer<typeof paymentFormSchema>;
type PaymentMember = {
  id: string;
  fullName: string;
  photo: string | null;
  isActive: boolean;
};

export function RecordPaymentForm({
  members,
  defaultMemberId,
  defaultMonth,
  defaultYear,
}: {
  members: PaymentMember[];
  defaultMemberId?: string;
  defaultMonth?: number;
  defaultYear?: number;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();

  const form = useForm<FormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paidBy: defaultMemberId ?? "",
      amount: 500,
      paymentMonth: defaultMonth ?? now.getMonth() + 1,
      paymentYear: defaultYear ?? now.getFullYear(),
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createPayment(data);
      if (res.error) {
        toast.error(
          typeof res.message === "string"
            ? res.message
            : "Failed to record payment. Please check the form."
        );
        return;
      }
      toast.success("Payment recorded successfully!");
      router.push("/dashboard/payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* Member picker */}
      <Controller
        control={form.control}
        name="paidBy"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label>Member</Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-invalid={fieldState.invalid} className="h-10">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={m.photo ?? ""} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(m.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{m.fullName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Month + Year */}
      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={form.control}
          name="paymentMonth"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label>Month</Label>
              <Select
                value={String(field.value)}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.slice(1).map((name, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="paymentYear"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label>Year</Label>
              <Select
                value={String(field.value)}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Amount */}
      <Controller
        control={form.control}
        name="amount"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (৳)</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              aria-invalid={fieldState.invalid}
              {...field}
            />
            {fieldState.error && (
              <p className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 sm:flex-none"
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Recording…
            </>
          ) : (
            "Record payment"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
