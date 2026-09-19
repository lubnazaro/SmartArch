import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/constants";

const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    ...(googleConfigured
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  session: { strategy: "database" },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      return isAdminEmail(user.email);
    },
    async session({ session }) {
      if (session.user?.email && !isAdminEmail(session.user.email)) {
        return { ...session, user: { ...session.user, email: "" } };
      }
      return session;
    },
  },
});

export function isGoogleAuthConfigured() {
  return googleConfigured;
}
