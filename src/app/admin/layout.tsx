import Link from "next/link";
import { getAdminSession } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const showFullNav = Boolean(session) && !session?.user.mustChangePassword;

  return (
    <div className="min-h-screen bg-sand-50 text-ink">
      {session ? (
        <header className="border-b border-sand-200 bg-sand-100/70">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link href="/admin" className="font-display text-xl tracking-tight">
                Smart Arch Admin
              </Link>
              {showFullNav ? (
                <>
                  <Link href="/admin/projects" className="text-ink-soft hover:text-ink">
                    Projects
                  </Link>
                  <Link href="/admin/faq" className="text-ink-soft hover:text-ink">
                    FAQ
                  </Link>
                  <Link href="/admin/content" className="text-ink-soft hover:text-ink">
                    Site content
                  </Link>
                  <Link
                    href="/admin/change-password"
                    className="text-ink-soft hover:text-ink"
                  >
                    Password
                  </Link>
                  <Link href="/en" className="text-bronze hover:underline">
                    View site
                  </Link>
                </>
              ) : (
                <span className="text-ink-soft/70">Set a new password to continue</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-ink-soft">
              <span>{session.user?.email}</span>
              <form
                action={async () => {
                  "use server";
                  const { signOut } = await import("@/lib/auth");
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button type="submit" className="underline">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
      ) : null}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
