import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  if (session) {
    redirect(session.user.mustChangePassword ? "/admin/change-password" : "/admin");
  }
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="font-display text-4xl text-ink">Admin sign in</h1>
      <p className="mt-3 text-ink-soft/75">
        Sign in with your Smart Arch admin email and password.
      </p>

      {error ? (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Sign-in failed. Check your email and password.
        </p>
      ) : null}

      <LoginForm />

      <p className="mt-6 text-xs leading-relaxed text-ink-soft/60">
        First login uses the shared default password. You will be asked to change it
        immediately after signing in.
      </p>
    </div>
  );
}
