"use cache";

import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { getAllUsers } from "@/features/dashboard/user/actions/user";
import { columns } from "@/features/dashboard/user/components/table/columns";
import { DataTable } from "@/features/dashboard/user/components/table/data-table";

const User = async () => {
  const users = await getAllUsers();

  return (
    <SidebarInset>
      <SiteHeader title="All Users" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <h1 className="text-2xl font-bold">All Users</h1>

            <DataTable columns={columns} data={users} />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default User;
