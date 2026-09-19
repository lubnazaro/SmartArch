import { notFound } from "next/navigation";
import {
  ensureSiteSettings,
  getAboutForLocale,
} from "@/lib/content";
import { isLocale, type Locale } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { FadeIn } from "@/components/motion";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const settings = await ensureSiteSettings();
  const about = getAboutForLocale(settings, locale);
  const paragraphs = about.split(/\n\n+/).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 section-space sm:px-6">
      <FadeIn>
        <h1 className="page-title">{dict.about.title}</h1>
        <div className="mt-10 h-px w-16 bg-bronze/40" />
      </FadeIn>
      <div className="mt-14 space-y-8">
        {paragraphs.map((p, i) => (
          <FadeIn key={i} delay={i * 0.06}>
            <p className="text-lg leading-relaxed text-ink-soft/85 sm:text-xl">
              {p}
            </p>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
