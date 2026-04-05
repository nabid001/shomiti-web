import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { getAllUsers } from "@/features/dashboard/user/actions/user";
import { RecordPaymentForm } from "@/features/payment/components/record-payment-form";

export default async function RecordPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ memberId?: string; month?: string; year?: string }>;
}) {
  const sp = await searchParams;
  const members = await getAllUsers();
  const activeMembers = members.filter((m) => m.isActive);

  return (
    <SidebarInset>
      <SiteHeader title="Record Payment" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 p-4 md:p-6 max-w-lg w-full">
            <div>
              <h1 className="text-2xl font-semibold">Record payment</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Record a monthly contribution for a shomiti member.
              </p>
            </div>
            <RecordPaymentForm
              members={activeMembers}
              defaultMemberId={sp.memberId}
              defaultMonth={sp.month ? Number(sp.month) : undefined}
              defaultYear={sp.year ? Number(sp.year) : undefined}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
