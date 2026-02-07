import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminAuthClient } from "@/lib/better-auth/auth-client";
import { Navigate } from "react-router";

export default function AdminApproval() {
  const { data: session, isPending } = adminAuthClient.useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (session && session.user.approval === "approved") {
    return <Navigate to={"/dashboard"} replace />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle>Approval {session!.user.approval}</CardTitle>
          <CardDescription>
            {session!.user.approval === "pending" &&
              "You'r approval currently in pending state. Once get get approval we&apos;ll notify you"}
            {session!.user.approval === "rejected" &&
              "Your approval has been rejected"}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
