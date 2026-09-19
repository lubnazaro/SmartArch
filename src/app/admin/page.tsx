import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  await requireAdmin();
  const [projects, faqs] = await Promise.all([
    prisma.project.count(),
    prisma.faqItem.count(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-2 text-ink-soft/75">
        Manage projects, FAQ, and site content for Smart Arch.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/projects"
          className="border border-sand-200 bg-sand-50 p-6 transition-colors hover:bg-sand-100"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-bronze">Projects</p>
          <p className="mt-2 font-display text-4xl">{projects}</p>
        </Link>
        <Link
          href="/admin/faq"
          className="border border-sand-200 bg-sand-50 p-6 transition-colors hover:bg-sand-100"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-bronze">FAQ</p>
          <p className="mt-2 font-display text-4xl">{faqs}</p>
        </Link>
        <Link
          href="/admin/content"
          className="border border-sand-200 bg-sand-50 p-6 transition-colors hover:bg-sand-100"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-bronze">Content</p>
          <p className="mt-2 font-display text-2xl">About & contact</p>
        </Link>
      </div>
    </div>
  );
}
