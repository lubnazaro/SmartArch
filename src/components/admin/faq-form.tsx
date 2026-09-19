"use client";

import type { FaqItem, FaqTranslation } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FaqData = FaqItem & { translations: FaqTranslation[] };

function t(faq: FaqData | undefined, locale: string) {
  return faq?.translations.find((x) => x.locale === locale);
}

export function FaqForm({
  faq,
  action,
}: {
  faq?: FaqData;
  action: (formData: FormData) => Promise<void>;
}) {
  const en = t(faq, "en");
  const ar = t(faq, "ar");
  const he = t(faq, "he");

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={faq?.id || ""} />
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={faq?.published} />
          Published
        </label>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={faq?.sortOrder ?? 0}
            className="w-28 rounded-none"
          />
        </div>
      </div>

      <section className="space-y-3 border border-sand-200 p-4">
        <h2 className="font-display text-xl">English</h2>
        <Input name="questionEn" required defaultValue={en?.question || ""} placeholder="Question" className="rounded-none" />
        <Textarea name="answerEn" required defaultValue={en?.answer || ""} placeholder="Answer" className="rounded-none" rows={5} />
      </section>

      <section className="space-y-3 border border-sand-200 p-4">
        <h2 className="font-display text-xl">Arabic (optional)</h2>
        <Input name="questionAr" defaultValue={ar?.question || ""} placeholder="Question" className="rounded-none" />
        <Textarea name="answerAr" defaultValue={ar?.answer || ""} placeholder="Answer" className="rounded-none" rows={4} />
      </section>

      <section className="space-y-3 border border-sand-200 p-4">
        <h2 className="font-display text-xl">Hebrew (optional)</h2>
        <Input name="questionHe" defaultValue={he?.question || ""} placeholder="Question" className="rounded-none" />
        <Textarea name="answerHe" defaultValue={he?.answer || ""} placeholder="Answer" className="rounded-none" rows={4} />
      </section>

      <Button type="submit" className="rounded-none">
        Save FAQ
      </Button>
    </form>
  );
}
