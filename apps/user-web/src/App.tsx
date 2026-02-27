import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/app-layout";
import Market from "./pages/market";
import ExamplePage from "./pages/example-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<Market />} path="/" />
          <Route element={<ExamplePage />} path="/example" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
