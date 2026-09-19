"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants";
import { getAdminSession } from "@/lib/admin";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function loginWithPassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (!isAdminEmail(email)) {
    return { error: "This account is not authorized for admin access." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  return {};
}

export async function changePassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const session = await getAdminSession();
  if (!session?.user?.email || !session.user.id) {
    return { error: "You must be signed in." };
  }

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required." };
  }
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }
  if (newPassword === currentPassword) {
    return { error: "Choose a new password different from the current one." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user?.passwordHash) {
    return { error: "Account not found." };
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return { error: "Current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      mustChangePassword: false,
    },
  });

  return { success: "Password updated. Continuing to admin…" };
}
