import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./pages/app-layout";
import AppLayout2 from "./pages/app-layout2";
import Dashboard from "./pages/dashboard";
import CreateMarket from "./pages/create-market";
import AdminApproval from "./pages/approval";
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout2 />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create-market" element={<CreateMarket />} />
        </Route>
        <Route path="/approval" element={<AdminApproval />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
