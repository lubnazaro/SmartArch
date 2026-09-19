import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { getPublishedFaqs, pickFaqTranslation } from "@/lib/content";
import { FaqAccordion } from "@/components/faq-accordion";
import { FadeIn } from "@/components/motion";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const faqs = await getPublishedFaqs();
  const items = faqs
    .map((faq) => {
      const t = pickFaqTranslation(faq, locale);
      if (!t) return null;
      return { id: faq.id, question: t.question, answer: t.answer };
    })
    .filter(Boolean) as { id: string; question: string; answer: string }[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <FadeIn>
        <h1 className="font-display text-4xl text-ink sm:text-5xl">
          {dict.faq.title}
        </h1>
        <p className="mt-4 text-lg text-ink-soft/75">{dict.faq.subtitle}</p>
      </FadeIn>
      <div className="mt-12">
        {items.length === 0 ? (
          <p className="text-ink-soft/70">{dict.faq.empty}</p>
        ) : (
          <FaqAccordion items={items} />
        )}
      </div>
    </div>
  );
}
