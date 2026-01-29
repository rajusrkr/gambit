import { AdminSignupForm } from "@/components/admin-signup-form";

export default function AdminSignup() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-6xl">
        <AdminSignupForm />
      </div>
    </div>
  );
}
