import { Route, Routes } from "react-router-dom";
import AppLayout from "@/components/app-layout";
import Market from "./pages/market";
import ExamplePage from "./pages/example-page";
import Position from "./pages/position";
import LeaderBoard from "./pages/leader-board";
import PageNotFound from "./pages/404page";
import MarketById from "./pages/market-by-id";

export default function App() {
  return (
    // <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<PageNotFound />} path="*" />
        <Route element={<Market />} path="/" />
        <Route element={<MarketById />} path="/market/:id" />
        <Route element={<Position />} path="/position" />
        <Route element={<LeaderBoard />} path="/leader-board" />
        <Route element={<ExamplePage />} path="/example" />
      </Route>
    </Routes>
    // </BrowserRouter>
  );
}
