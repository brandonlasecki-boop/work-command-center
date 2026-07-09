import { LoginForm } from "@/components/auth/LoginForm";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-6">
      <GlassCard className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20">
            <Shield className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Work Command Center</h1>
            <p className="text-sm text-muted-foreground">Enter your password to continue</p>
          </div>
        </div>
        <LoginForm from={from ?? "/dashboard"} />
      </GlassCard>
    </div>
  );
}
