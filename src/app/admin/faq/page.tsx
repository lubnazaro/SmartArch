import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { deleteFaq } from "@/lib/actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminFaqPage() {
  await requireAdmin();
  const faqs = await prisma.faqItem.findMany({
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">FAQ</h1>
        <Link href="/admin/faq/new" className={cn(buttonVariants(), "rounded-none")}>
          New question
        </Link>
      </div>
      <div className="mt-8 space-y-3">
        {faqs.map((faq) => {
          const en = faq.translations.find((t) => t.locale === "en");
          return (
            <div
              key={faq.id}
              className="flex flex-wrap items-start justify-between gap-4 border border-sand-200 bg-sand-50 p-4"
            >
              <div>
                <p className="font-medium">{en?.question || "Untitled"}</p>
                <p className="mt-1 text-sm text-ink-soft/70">
                  {faq.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <Link href={`/admin/faq/${faq.id}`} className="underline">
                  Edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteFaq(faq.id);
                  }}
                >
                  <button type="submit" className="text-red-700 underline">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          );
        })}
        {faqs.length === 0 ? (
          <p className="text-ink-soft/70">FAQ is empty. Add questions anytime.</p>
        ) : null}
      </div>
    </div>
  );
}
