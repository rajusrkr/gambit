import { Route, Routes } from "react-router-dom";
import AppLayout from "@/components/app-layout";
import PageNotFound from "./pages/404not-found/page";
import LeaderBoard from "./pages/leader-board/page";
import MarketById from "./pages/market-by-id/page";
import Market from "./pages/markets/page";
import Position from "./pages/positions/page";

export default function App() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route element={<PageNotFound />} path="*" />
				<Route element={<Market />} path="/" />
				<Route element={<MarketById />} path="/market/:id" />
				<Route element={<Position />} path="/position" />
				<Route element={<LeaderBoard />} path="/leader-board" />
			</Route>
		</Routes>
	);
}
