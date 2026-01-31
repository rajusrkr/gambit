import { adminAuthClient } from "@/lib/auth-client";
import { useAdminStore } from "@/lib/zStore";
import { useEffect, type JSX } from "react";
import { Navigate } from "react-router";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { setAdminStates } = useAdminStore();
  const { data: session, isPending } = adminAuthClient.useSession();
  useEffect(() => {
    if (session) {
      setAdminStates({
        email: session?.user.email,
        name: session?.user.name,
        role: session.user.role,
      });
    }
  }, [session, setAdminStates]);

  if (isPending) {
    return (
      <p className="flex justify-center items-center h-[80vh]">Loading....</p>
    );
  }

  if (!session) {
    window.location.replace("http://localhost:5173/admin/auth/login");
    return null;
  }

  if (session.user.approval === "pending") {
    return <Navigate to={"/approval"} replace />;
  }
  return children;
}
