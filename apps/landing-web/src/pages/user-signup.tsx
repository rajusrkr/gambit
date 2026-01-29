import { UserSignupForm } from "@/components/user-signup-form";

export default function UserSignup() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-6xl">
                <UserSignupForm />
            </div>
        </div>
    )
}