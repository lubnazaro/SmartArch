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
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <FadeIn>
        <h1 className="font-display text-4xl text-ink sm:text-5xl">
          {dict.about.title}
        </h1>
      </FadeIn>
      <div className="mt-10 space-y-6">
        {paragraphs.map((p, i) => (
          <FadeIn key={i} delay={i * 0.06}>
            <p className="text-lg leading-relaxed text-ink-soft/85">{p}</p>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
