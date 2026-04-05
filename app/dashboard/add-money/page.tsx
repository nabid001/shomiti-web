import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import React from "react";

const AddMoney = () => {
  return (
    <SidebarInset>
      <SiteHeader title="Add Money" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <h1 className="text-2xl font-bold">Add Money</h1>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default AddMoney;
