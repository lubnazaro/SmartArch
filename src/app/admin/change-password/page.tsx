import { requireAdmin } from "@/lib/admin";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export default async function ChangePasswordPage() {
  const session = await requireAdmin({ allowPasswordChange: true });

  return (
    <div className="mx-auto max-w-md py-8">
      <h1 className="font-display text-3xl text-ink">Change password</h1>
      <p className="mt-3 text-ink-soft/75">
        Signed in as <span className="text-ink">{session.user.email}</span>.
        {session.user.mustChangePassword
          ? " Please set a new personal password before continuing."
          : " Update your admin password below."}
      </p>
      <ChangePasswordForm />
    </div>
  );
}
