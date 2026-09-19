import Link from "next/link";
import type { Locale } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import {
  pickProjectTranslation,
  type ProjectWithRelations,
} from "@/lib/content";
import { isUsableCoverUrl } from "@/lib/media";
import { FadeIn } from "@/components/motion";
import { ProjectCoverImage } from "@/components/project-cover";

export function ProjectGrid({
  projects,
  locale,
  dict,
}: {
  projects: ProjectWithRelations[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (projects.length === 0) {
    return (
      <p className="py-16 text-center text-ink-soft/70">{dict.projects.empty}</p>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {projects.map((project, i) => {
        const t = pickProjectTranslation(project, locale);
        if (!t) return null;
        const href = `/${locale}/projects/${t.slug}`;
        return (
          <FadeIn key={project.id} delay={i * 0.08}>
            <Link href={href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
                {isUsableCoverUrl(project.coverUrl) && project.coverUrl ? (
                  <ProjectCoverImage
                    src={project.coverUrl}
                    alt={t.title}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="arch-grid flex h-full items-end p-6">
                    <span className="font-display text-2xl text-ink/40">
                      {t.title}
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-sand-50">
                  <p className="font-display text-2xl tracking-tight">{t.title}</p>
                  {t.summary ? (
                    <p className="mt-1 line-clamp-2 text-sm text-sand-50/80">
                      {t.summary}
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>
          </FadeIn>
        );
      })}
    </div>
  );
}
