import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./app-layout";
import RequireAuth from "./components/require-auth";
import PageNotFound from "./pages/404/page/404Page";
import AdminApproval from "./pages/approval/page/approval";
import CreateMarket from "./pages/create-market/page/create-market";
import Dashboard from "./pages/dashboard/page/dashboard";
import Market from "./pages/markets/page/market";

export function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					element={
						<RequireAuth>
							<AppLayout />
						</RequireAuth>
					}
				>
					<Route path="/" element={<Dashboard />} />
					<Route path="/create-market" element={<CreateMarket />} />
					<Route path="/markets" element={<Market />} />
				</Route>
				<Route path="/approval" element={<AdminApproval />} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
