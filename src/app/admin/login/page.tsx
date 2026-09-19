import { redirect } from "next/navigation";
import { signIn, isGoogleAuthConfigured } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin";
import { ADMIN_EMAILS } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  if (session) redirect("/admin");
  const { error } = await searchParams;
  const googleReady = isGoogleAuthConfigured();

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="font-display text-4xl text-ink">Admin sign in</h1>
      <p className="mt-3 text-ink-soft/75">
        Access is limited to Smart Arch administrators.
      </p>
      <ul className="mt-4 space-y-1 text-sm text-ink-soft/70">
        {ADMIN_EMAILS.map((email) => (
          <li key={email}>{email}</li>
        ))}
      </ul>

      {error ? (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Sign-in failed. Use an authorized Google account
          {error === "AccessDenied" ? " (access denied for this email)." : `. (${error})`}
        </p>
      ) : null}

      {googleReady ? (
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className={cn(buttonVariants({ size: "lg" }), "w-full rounded-none")}
          >
            Continue with Google
          </button>
        </form>
      ) : (
        <div className="mt-8 space-y-4 border border-sand-300 bg-sand-100/80 p-5 text-sm leading-relaxed text-ink-soft">
          <p className="font-medium text-ink">Google OAuth is not configured yet.</p>
          <ol className="list-decimal space-y-2 ps-5">
            <li>
              Create OAuth credentials in{" "}
              <a
                className="text-bronze underline"
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
              >
                Google Cloud Console
              </a>
            </li>
            <li>
              Add authorized redirect URI:{" "}
              <code className="rounded bg-sand-200 px-1">
                {process.env.AUTH_URL || "http://127.0.0.1:3847"}/api/auth/callback/google
              </code>
            </li>
            <li>
              Set <code className="rounded bg-sand-200 px-1">GOOGLE_CLIENT_ID</code> and{" "}
              <code className="rounded bg-sand-200 px-1">GOOGLE_CLIENT_SECRET</code> in{" "}
              <code className="rounded bg-sand-200 px-1">.env</code>, then restart the server.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
