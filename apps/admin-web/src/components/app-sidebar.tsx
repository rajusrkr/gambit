import * as React from "react";
import {
  IconBrightness,
  IconInnerShadowTop,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Link } from "react-router";

import { useTheme } from "@/components/theme-provider"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  const {setTheme, theme} = useTheme()


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="grid grid-cols-[7fr_3fr]">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={"/"}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Gambit Admin</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton className="flex justify-center"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark" )
            }}
            >
              <IconBrightness />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
