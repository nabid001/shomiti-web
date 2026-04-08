import { Button } from "@/components/ui/button";
import { getCurrentMonthYear } from "@/lib/utils";
import { Plus } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";

const DashboardHeader = async () => {
  "use cache";
  cacheLife("days");

  const { monthAndYear } = getCurrentMonthYear();
  return (
    <div>
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{monthAndYear}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/payment/new">
            <Plus />
            Payment
          </Link>
        </Button>
      </header>
    </div>
  );
};

export default DashboardHeader;
