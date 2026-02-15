import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./pages/app-layout";
import Dashboard from "./pages/dashboard";
import CreateMarket from "./pages/create-market";
import AdminApproval from "./pages/approval";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-market" element={<CreateMarket />} />
        </Route>
        <Route path="/approval" element={<AdminApproval />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
