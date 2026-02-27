import { Outlet } from "react-router-dom";
import HeaderNavigation from "./header-navigation";

export default function AppLayout() {
  return (
    <>
      <HeaderNavigation />
      <div className="mt-14">
        <Outlet />
      </div>
    </>
  );
}
