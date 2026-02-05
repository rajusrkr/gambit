import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { Separator } from "@/components/ui/separator";

export default function AppLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <div className="mt-2">
          <div className="flex items-center">
            <SidebarTrigger />
            <div className="md:hidden flex">
              <p className="font-semibold">Gambit Admin</p>
            </div>
          </div>
          <Separator />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
