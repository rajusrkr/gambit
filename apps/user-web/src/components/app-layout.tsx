import { Outlet } from "react-router-dom";
import HeaderNavigation from "./header-navigation";

export default function AppLayout() {
  return (
    <>
      <HeaderNavigation />
      <div className="mt-14 max-w-7xl mx-auto pt-4 px-4">
        <Outlet />
      </div>
    </>
  );
}
