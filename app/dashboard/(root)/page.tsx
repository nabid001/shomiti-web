import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
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
import { getDashboardStats } from "@/features/payment/actions/payment";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <SidebarInset>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 p-4 md:p-6">
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
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
