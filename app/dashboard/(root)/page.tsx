import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  Card,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircleIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import {
  getDashboardStats,
  getMonthlyPaymentStatus,
} from "@/features/payment/actions/payment";
import { MonthlyTable } from "@/features/payment/components/table/monthly-table";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const month = Number(sp.month ?? now.getMonth() + 1);
  const year = Number(sp.year ?? now.getFullYear());

  const [stats, members] = await Promise.all([
    getDashboardStats(),
    getMonthlyPaymentStatus(month, year),
  ]);

  const monthLabel = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const paidCount = members.filter((m) => m.payment !== null).length;
  const missedCount = members.length - paidCount;

  return (
    <SidebarInset>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-8 p-4 md:p-6">
            {/* ── Header ───────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-semibold">Overview</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {monthLabel}
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/payment/new">Record payment</Link>
              </Button>
            </div>

            {/* ── Stat cards ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardDescription className="flex items-center gap-1.5">
                    <WalletIcon className="size-3.5" />
                    Total collected
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    ৳{stats.totalCollected.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                  All-time contributions
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription className="flex items-center gap-1.5">
                    <UsersIcon className="size-3.5" />
                    Active members
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {stats.activeMembers}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                  Currently enrolled
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription className="flex items-center gap-1.5">
                    <AlertCircleIcon className="size-3.5" />
                    Missed this month
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums text-destructive @[250px]/card:text-3xl">
                    {stats.missedThisMonth}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                  {stats.activeMembers - stats.missedThisMonth} of{" "}
                  {stats.activeMembers} paid
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription className="flex items-center gap-1.5">
                    <TrendingUpIcon className="size-3.5" />
                    Collection rate
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {stats.collectionRate}%
                  </CardTitle>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                  This month
                </CardFooter>
              </Card>
            </div>

            {/* ── Monthly payments table ───────────────────────────── */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Monthly payments</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {paidCount} paid · {missedCount} missed
                  </p>
                </div>
              </div>

              <MonthlyTable
                members={members}
                currentMonth={month}
                currentYear={year}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
