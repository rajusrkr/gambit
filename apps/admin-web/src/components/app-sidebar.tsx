import {
	IconBrightnessFilled,
	IconChartAreaLineFilled,
	IconChessKnight,
	IconCirclePlus,
	IconDashboard,
	IconHelp,
	IconSearch,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
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
import { useTheme } from "./theme-provider";

export const appSidebarData = {
	navMain: [
		{
			title: "Dashboard",
			url: "/",
			icon: <IconDashboard />,
		},
		{
			title: "Markets",
			url: "/markets",
			icon: <IconChartAreaLineFilled />,
		},
		{
			title: "Create market",
			url: "/create-market",
			icon: <IconCirclePlus />,
		},

		{
			title: "Users",
			url: "/users",
			icon: <IconUsers />,
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
							className="data-[slot=sidebar-menu-button]:p-1.5! hover:cursor-default select-none"
						>
							<span>
								<IconChessKnight className="size-5!" />
								<span className="text-base font-semibold">Gambit Admin</span>
							</span>
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
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
