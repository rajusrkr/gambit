import { BrowserRouter, Route, Routes } from "react-router";
import { AppNavbar } from "./components/navbar";
import AdminLogin from "./pages/admin-login";
import AdminRequest from "./pages/admin-request";
import AdminSignup from "./pages/admin-signup";
import Home from "./pages/home";
import UserLogin from "./pages/user-login";
import UserSignup from "./pages/user-signup";

export function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					element={
						<>
							<div className="relative">
								<AppNavbar />
								<Home />
							</div>
						</>
					}
					path="/"
				/>
				<Route element={<UserSignup />} path="/auth/signup" />
				<Route element={<UserLogin />} path="/auth/login" />
				<Route element={<AdminSignup />} path="/admin/auth/signup" />
				<Route element={<AdminLogin />} path="/admin/auth/login" />
				<Route element={<AdminRequest />} path="/admin/access-request" />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
