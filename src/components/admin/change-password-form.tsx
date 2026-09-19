"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { changePassword, type AuthActionState } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: AuthActionState = {};

export function ChangePasswordForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(changePassword, initial);

  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 600);
      return () => clearTimeout(t);
    }
  }, [state.success, router]);

  return (
    <form action={action} className="mt-8 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="rounded-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="rounded-none"
        />
      </div>
      {state.error ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {state.success}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full rounded-none">
        {pending ? "Saving…" : "Update password"}
      </Button>
    </form>
  );
}
