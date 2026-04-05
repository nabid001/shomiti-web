"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SelectGroup } from "../ui/select";
import { UsersIcon } from "lucide-react";

const collapsibleLinks = [
  {
    title: "User",
    icon: <UsersIcon />,
    items: [
      {
        title: "All",
        url: "/dashboard/user",
      },
      {
        title: "Add User",
        url: "/dashboard/user/add",
      },
    ],
  },
];

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    item?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`min-w-8 duration-200 ease-linear  ${pathname === item.url && "bg-primary text-primary-foreground active:bg-primary/90 active:text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"}  `}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <Collapsible defaultOpen={true} className="group/collapsible">
          {collapsibleLinks.map((item) => {
            if (!item) return "fuck";

            return (
              <SidebarMenuItem key={item.title}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`w-full duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenu>
                    {item.items?.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <Link href={subItem.url}>
                          <SidebarMenuButton
                            tooltip={subItem.title}
                            className={`min-w-8 pl-8 duration-200 ease-linear  ${
                              pathname === subItem.url &&
                              "bg-primary text-primary-foreground active:bg-primary/90 active:text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                            }`}
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            );
          })}
        </Collapsible>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
