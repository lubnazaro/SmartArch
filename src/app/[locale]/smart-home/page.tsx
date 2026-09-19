import { notFound } from "next/navigation";
import { isLocale, CATEGORIES, type Locale } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { getPublishedProjects } from "@/lib/content";
import { ProjectGrid } from "@/components/project-grid";
import { FadeIn } from "@/components/motion";

export default async function SmartHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const projects = await getPublishedProjects(CATEGORIES.SMART_HOME);

  return (
    <div className="mx-auto max-w-6xl px-4 section-space sm:px-6">
      <FadeIn>
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">
          {dict.nav.projects}
        </p>
        <h1 className="page-title mt-4">{dict.projects.titleSmart}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft/75 sm:text-xl">
          {dict.projects.subtitleSmart}
        </p>
        <div className="mt-10 h-px w-16 bg-bronze/40" />
      </FadeIn>
      <div className="mt-16">
        <ProjectGrid projects={projects} locale={locale} dict={dict} />
      </div>
    </div>
  );
}
