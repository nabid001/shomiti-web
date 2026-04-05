import React, { ReactNode, Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { SidebarProvider } from "@/components/ui/sidebar";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "../api/uploadthing/core";
import { connection } from "next/server";

async function UTSSR() {
  await connection();

  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
}

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 59)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Suspense fallback="loading uploadthing!">
        <UTSSR />
      </Suspense>
      <AppSidebar variant="inset" />

      {children}
    </SidebarProvider>
  );
};

export default DashboardLayout;
