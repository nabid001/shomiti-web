import DashboardStats from "@/features/dashboard/root/components/dashboard-stats";
import DashboardHeader from "@/features/dashboard/root/components/dashboard-header";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getMonthlyPaymentStatus } from "@/features/payment/actions/payment";
import { MonthlyTable } from "@/features/payment/components/table/monthly-table";
import { cacheTag } from "next/cache";

type Props = {
  searchParams: Promise<{ month?: string; year?: string }>;
};

const DashboardHome = ({ searchParams }: Props) => {
  return (
    <SidebarInset>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-8 p-4 md:p-6">
            <DashboardHeader />

            {/* Stats */}
            <Suspense
              fallback={
                <>
                  Stats <Spinner />
                </>
              }
            >
              <DashboardStats />
            </Suspense>

            {/* Monthly table*/}
            <Suspense
              fallback={
                <>
                  Members <Spinner />
                </>
              }
            >
              <MonthlyComponent searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default DashboardHome;

const MonthlyComponent = async ({ searchParams }: Props) => {
  "use cache";
  cacheTag("monthly_member");

  const m = (await searchParams).month;
  const y = (await searchParams).year;

  const date = new Date();

  const currentMonth = date.getMonth() + 1;
  const month = Number(m ?? currentMonth);
  const year = Number(y ?? date.getFullYear());

  const members = await getMonthlyPaymentStatus(month, year);
  const paidCount = members.filter((m) => m.payment !== null).length;
  const missedCount = members.length - paidCount;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-semibold">Monthly payments</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {paidCount} paid · {missedCount} missed
          </p>
        </div>
      </div>

      <MonthlyTable members={members} currentMonth={month} currentYear={year} />
    </div>
  );
};
