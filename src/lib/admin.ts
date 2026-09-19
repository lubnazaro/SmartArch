import { isAdminEmail } from "@/lib/constants";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect("/admin/login");
  }
  return session;
}

export async function getAdminSession() {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return null;
  }
  return session;
}
