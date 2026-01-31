import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import RequireAuth from "./components/require-auth";
import AdminApproval from "./pages/approval";
import AppLayout from "./pages/home";
import Dashboard from "./pages/dashboard";
import CreateNewMarket from "./pages/create-new-market";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          }
        >
          <Route element={<AppLayout />} path="/">
            <Route element={<Dashboard />} path="/dashboard" />
            <Route element={<CreateNewMarket />} path="/create-new-market" />
          </Route>
        </Route>
        <Route element={<AdminApproval />} path="/approval" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
