import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale, CATEGORIES, type Locale } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import {
  getProjectBySlug,
  pickProjectTranslation,
} from "@/lib/content";
import { isUsableCoverUrl } from "@/lib/media";
import { FadeIn } from "@/components/motion";
import { ProjectMediaPost } from "@/components/project-media";
import { ProjectCoverImage } from "@/components/project-cover";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const project = await getProjectBySlug(slug, locale);
  if (!project) notFound();
  const t = pickProjectTranslation(project, locale);
  if (!t) notFound();

  const backHref =
    project.category === CATEGORIES.SMART_HOME
      ? `/${locale}/smart-home`
      : `/${locale}/interior-design`;

  const posts = project.media;
  const coverOk = isUsableCoverUrl(project.coverUrl);

  return (
    <div className="pb-20">
      <div className="relative aspect-[16/10] max-h-[70vh] w-full overflow-hidden bg-sand-200">
        {coverOk && project.coverUrl ? (
          <ProjectCoverImage src={project.coverUrl} alt={t.title} priority />
        ) : (
          <div className="arch-grid h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-sand-50 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <FadeIn>
          <Link
            href={backHref}
            className="mt-8 inline-flex items-center gap-2 text-sm text-ink-soft/70 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.projects.back}
          </Link>
          <h1 className="mt-6 font-display text-4xl text-ink sm:text-5xl">
            {t.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink-soft/70">
            {project.location ? <span>{project.location}</span> : null}
            {project.year ? <span>{project.year}</span> : null}
          </div>
          {t.summary ? (
            <p className="mt-6 text-xl leading-relaxed text-ink-soft/85">
              {t.summary}
            </p>
          ) : null}
          {t.description ? (
            <div className="mt-6 space-y-4 whitespace-pre-wrap text-base leading-relaxed text-ink-soft/80">
              {t.description}
            </div>
          ) : null}
        </FadeIn>

        {posts.length > 0 ? (
          <div className="mt-14 space-y-10">
            <h2 className="font-display text-2xl text-ink">
              {dict.projects.gallery}
            </h2>
            {posts.map((post, i) => (
              <FadeIn key={post.id} delay={i * 0.04}>
                <ProjectMediaPost post={post} altFallback={t.title} />
              </FadeIn>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
