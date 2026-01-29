import { BrowserRouter, Route, Routes } from "react-router";
import AdminApproval from "./pages/approval";
import AppLayout from "./pages/home";
import Dashboard from "./pages/dashboard";
import CreateNewMarket from "./pages/create-new-market";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />} path="/">
          <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<CreateNewMarket />} path="/create-new-market" />
        </Route>
        <Route element={<AdminApproval />} path="/approval" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
