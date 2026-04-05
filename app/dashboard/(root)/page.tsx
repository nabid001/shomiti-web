import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UsersIcon,
  WalletIcon,
  AlertCircleIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";

// Replace these with real DB queries when ready
const stats = {
  totalCollected: 84000,
  activeMembers: 34,
  missedThisMonth: 7,
  collectionRate: 79,
};

export default function DashboardPage() {
  return (
    <SidebarInset>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* Page heading + quick action */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Overview</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  April 2026
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/payment/new">Record payment</Link>
              </Button>
            </div>

            {/* Stat cards */}
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
                  Members who haven't paid
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
                  <Badge variant="outline" className="w-fit">
                    This month
                  </Badge>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                  {stats.activeMembers - stats.missedThisMonth} of{" "}
                  {stats.activeMembers} paid
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
