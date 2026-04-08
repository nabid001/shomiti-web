import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardStats } from "@/features/payment/actions/payment";
import {
  AlertCircleIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { cacheTag } from "next/cache";

const DashboardStats = async () => {
  "use cache";
  cacheTag("dashboard_stats");

  const stats = await getDashboardStats();
  return (
    <>
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
            All-time collection
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
    </>
  );
};

export default DashboardStats;
