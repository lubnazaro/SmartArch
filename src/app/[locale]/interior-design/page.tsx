import { notFound } from "next/navigation";
import { isLocale, CATEGORIES, type Locale } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { getPublishedProjects } from "@/lib/content";
import { ProjectGrid } from "@/components/project-grid";
import { FadeIn } from "@/components/motion";

export default async function InteriorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const projects = await getPublishedProjects(CATEGORIES.INTERIOR);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <FadeIn>
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">
          {dict.nav.projects}
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          {dict.projects.titleInterior}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft/75">
          {dict.projects.subtitleInterior}
        </p>
      </FadeIn>
      <div className="mt-12">
        <ProjectGrid projects={projects} locale={locale} dict={dict} />
      </div>
    </div>
  );
}
