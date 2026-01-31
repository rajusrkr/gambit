import { IconCirclePlusFilled, IconDashboardFilled } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";

const sideBarMenu = [
  {title: "Dashboard", id: "dashboard", link: "/dashboard", icon: <IconDashboardFilled />},
  {title: "Create", id: "create", link: "/create-new-market", icon: <IconCirclePlusFilled />}
]

export function NavMain() {
  const pathname = useLocation().pathname
  return (
    <SidebarGroup>
      <SidebarGroupContent className="gap-2">
        <SidebarMenu>
              <SidebarMenuItem>
                  {
                    sideBarMenu.map((menu, i) => (
                      <SidebarMenuButton key={i}
                      className={`${pathname === menu.link && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"}`}
                      >
                        {
                          menu.icon
                        }
                        <Link to={menu.link}>{menu.title}</Link>
                      </SidebarMenuButton>
                    ))
                  }
              </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
