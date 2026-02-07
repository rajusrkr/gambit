import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
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
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconUsers,
  IconCamera,
  IconFileDescription,
  IconFileAi,
  IconSettings,
  IconHelp,
  IconSearch,
  IconDatabase,
  IconReport,
  IconFileWord,
  IconBrightnessFilled,
  IconCirclePlus,
  IconChessKnight,
} from "@tabler/icons-react";
import { useTheme } from "./theme-provider";

export const appSidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboards",
      url: "/",
      icon: <IconDashboard />,
    },
    {
      title: "Lifecycle",
      url: "/",
      icon: <IconListDetails />,
    },
    {
      title: "Analytics",
      url: "/",
      icon: <IconChartBar />,
    },
    {
      title: "Projects",
      url: "/",
      icon: <IconFolder />,
    },
    {
      title: "Team",
      url: "/",
      icon: <IconUsers />,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <IconDashboard />,
    },
    {
      title: "Create market",
      url: "/dashboard/create-market",
      icon: <IconCirclePlus />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <IconCamera />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <IconFileDescription />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <IconFileAi />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <IconSettings />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <IconHelp />,
    },
    {
      title: "Search",
      url: "#",
      icon: <IconSearch />,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: <IconDatabase />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <IconReport />,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: <IconFileWord />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="grid grid-cols-[7fr_3fr]">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconChessKnight className="size-5!" />
                <span className="text-base font-semibold">Gambit Admin</span>
              </a>
            </SidebarMenuButton>
            <SidebarMenuButton
              onClick={() => {
                theme === "dark" ? setTheme("light") : setTheme("dark");
              }}
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <IconBrightnessFilled />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={appSidebarData.navMain} />
        <NavDocuments items={appSidebarData.documents} />
        <NavSecondary items={appSidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
