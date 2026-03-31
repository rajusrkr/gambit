import { BrowserRouter, Route, Routes } from "react-router";
import RequireAuth from "./components/require-auth";
import AppLayout from "./pages/app-layout";
import AdminApproval from "./pages/approval";
import CreateMarket from "./pages/create-market";
import Dashboard from "./pages/dashboard";

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
				</Route>
				<Route path="/approval" element={<AdminApproval />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
