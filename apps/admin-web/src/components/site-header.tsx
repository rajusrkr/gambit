import { Link, useLocation } from "react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { appSidebarData } from "./app-sidebar";
import { Badge } from "./ui/badge";

export function SiteHeader() {
	const pathName = useLocation().pathname;
	const navLinks = appSidebarData.navMain;

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-6"
				/>
				<div className="text-base font-medium flex flex-row items-center space-x-3">
					<span>
						<p>
							{navLinks.find((nav) => nav.url === pathName)?.title ||
								"Dashboard"}
						</p>
					</span>

					{pathName === "/markets" && (
						<span>
							<Link to={"/create-market"}>
								<Badge variant={"secondary"}>Create new market</Badge>
							</Link>
						</span>
					)}
				</div>
			</div>
		</header>
	);
}
