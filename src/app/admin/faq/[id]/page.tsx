import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { upsertFaq } from "@/lib/actions";
import { FaqForm } from "@/components/admin/faq-form";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const faq = await prisma.faqItem.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!faq) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Edit FAQ</h1>
      <div className="mt-8">
        <FaqForm
          faq={faq}
          action={async (formData) => {
            "use server";
            formData.set("id", id);
            await upsertFaq(formData);
            redirect("/admin/faq");
          }}
        />
      </div>
    </div>
  );
}
