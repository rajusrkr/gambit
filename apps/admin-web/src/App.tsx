import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import AdminApproval from "./pages/approval";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<AdminApproval />} path="/approval" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
