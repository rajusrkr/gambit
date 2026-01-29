import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminApproval() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle>Approval pending</CardTitle>
          <CardDescription>
            You&apos;r approval currently in pending state. Once get get
            approval we&apos;ll notify you
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
