import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { upsertFaq } from "@/lib/actions";
import { FaqForm } from "@/components/admin/faq-form";

export default async function NewFaqPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-3xl">New FAQ</h1>
      <div className="mt-8">
        <FaqForm
          action={async (formData) => {
            "use server";
            await upsertFaq(formData);
            redirect("/admin/faq");
          }}
        />
      </div>
    </div>
  );
}
