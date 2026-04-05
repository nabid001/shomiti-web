import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { getMonthlyPaymentStatus } from "@/features/payment/actions/payment";
import { MonthlyTable } from "@/features/payment/components/table/monthly-table";

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

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const month = Number(sp.month ?? now.getMonth() + 1);
  const year = Number(sp.year ?? now.getFullYear());

  const members = await getMonthlyPaymentStatus(month, year);
  const paidCount = members.filter((m) => m.payment !== null).length;
  const missedCount = members.length - paidCount;

  return (
    <SidebarInset>
      <SiteHeader title="Payments" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Monthly payments</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {MONTHS[month]} {year} · {paidCount} paid · {missedCount} missed
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/payment/new">
                <PlusIcon className="mr-2 h-4 w-4" />
                Record payment
              </Link>
            </Button>
          </div>

          <MonthlyTable
            members={members}
            currentMonth={month}
            currentYear={year}
          />
        </div>
      </div>
    </SidebarInset>
  );
}
