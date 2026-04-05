"use client";

import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  UsersIcon,
  WalletIcon,
  CommandIcon,
} from "lucide-react";
import Link from "next/link";

const data = {
  user: {
    name: "Admin",
    email: "admin@shomiti.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
  ],
  navCollapsible: [
    {
      title: "Members",
      icon: <UsersIcon />,
      items: [
        { title: "All members", url: "/dashboard/member" },
        { title: "Add member", url: "/dashboard/member/add" },
      ],
    },
    {
      title: "Payments",
      icon: <WalletIcon />,
      items: [
        { title: "Monthly table", url: "/dashboard/payment" },
        { title: "Record payment", url: "/dashboard/payment/new" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
              <CommandIcon className="size-5!" />
              <Link href="/dashboard" className="text-base font-semibold">
                Shomiti
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} collapsibleItems={data.navCollapsible} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
