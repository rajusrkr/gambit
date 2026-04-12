import { Outlet } from "react-router-dom";
import HeaderNavigation from "./header-navigation";

/**
 * An app layout to wrap the application with a header.
 * It uses Outlet from react-router-dom to plot the children component's data.
 */
export default function AppLayout() {
	return (
		<>
			<HeaderNavigation />
			<div className="mt-14 max-w-7xl mx-auto pt-4 px-4">
				{/* Outlet will plot the children page compoents */}
				<Outlet />
			</div>
		</>
	);
}
