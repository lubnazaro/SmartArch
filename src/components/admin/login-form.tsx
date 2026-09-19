"use client";

import { useActionState } from "react";
import { loginWithPassword, type AuthActionState } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: AuthActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginWithPassword, initial);

  return (
    <form action={action} className="mt-8 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="zarofiras@gmail.com"
          className="rounded-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-none"
        />
      </div>
      {state.error ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full rounded-none">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
