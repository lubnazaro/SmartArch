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
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { CinematicProjectOpen, MoodBlock } from "@/components/cinematic-project";
import { ProjectMediaPost } from "@/components/project-media";
import { ProjectCoverImage } from "@/components/project-cover";
import { cn } from "@/lib/utils";

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
  const beforeOk = isUsableCoverUrl(project.beforeImageUrl);
  const afterOk = isUsableCoverUrl(project.afterImageUrl);
  const showBeforeAfter =
    beforeOk && afterOk && project.beforeImageUrl && project.afterImageUrl;

  return (
    <CinematicProjectOpen
      cover={
        coverOk && project.coverUrl ? (
          <ProjectCoverImage src={project.coverUrl} alt={t.title} priority />
        ) : (
          <div className="arch-grid h-full" />
        )
      }
    >
      <div className="pb-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <MoodBlock>
            <Link
              href={backHref}
              className="mt-10 inline-flex items-center gap-2 text-sm text-ink-soft/70 hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              {dict.projects.back}
            </Link>
            <h1 className="project-title mt-8">{t.title}</h1>
            <div className="mt-5 flex flex-wrap gap-4 text-sm tracking-wide text-ink-soft/65">
              {project.location ? <span>{project.location}</span> : null}
              {project.year ? <span>{project.year}</span> : null}
            </div>
            {t.summary ? (
              <p className="mt-10 text-xl leading-relaxed text-ink-soft/85 sm:text-2xl">
                {t.summary}
              </p>
            ) : null}
            {t.description ? (
              <div className="mt-8 space-y-5 whitespace-pre-wrap text-base leading-relaxed text-ink-soft/80 sm:text-lg">
                {t.description}
              </div>
            ) : null}
          </MoodBlock>
        </div>

        {showBeforeAfter ? (
          <MoodBlock className="mx-auto mt-20 max-w-5xl px-4 sm:px-6" delay={0.08}>
            <p className="mb-6 text-xs uppercase tracking-[0.22em] text-bronze">
              {dict.projects.beforeAfter}
            </p>
            <BeforeAfterSlider
              beforeSrc={project.beforeImageUrl!}
              afterSrc={project.afterImageUrl!}
              beforeLabel={dict.projects.before}
              afterLabel={dict.projects.after}
            />
          </MoodBlock>
        ) : null}

        {posts.length > 0 ? (
          <div className="mt-24 space-y-0">
            <div className="mx-auto mb-12 max-w-3xl px-4 sm:px-6">
              <MoodBlock>
                <h2 className="border-b section-rule pb-5 font-display text-3xl text-ink sm:text-4xl">
                  {dict.projects.gallery}
                </h2>
              </MoodBlock>
            </div>
            {posts.map((post, i) => {
              const fullBleed = i % 3 === 0;
              const textAside = i % 3 === 1;
              return (
                <MoodBlock
                  key={post.id}
                  delay={0.04}
                  className={cn(
                    "border-b section-rule",
                    fullBleed
                      ? "bg-sand-100/30 py-10 sm:py-14"
                      : "py-14 sm:py-20"
                  )}
                >
                  {fullBleed ? (
                    <div className="mx-auto max-w-6xl px-0 sm:px-6">
                      <ProjectMediaPost post={post} altFallback={t.title} />
                    </div>
                  ) : textAside ? (
                    <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-center lg:gap-16">
                      <div className="order-2 space-y-3 lg:order-1">
                        {post.caption ? (
                          <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                            {post.caption}
                          </p>
                        ) : (
                          <p className="text-xs uppercase tracking-[0.22em] text-bronze">
                            {dict.projects.gallery}
                          </p>
                        )}
                      </div>
                      <div className="order-1 lg:order-2">
                        <ProjectMediaPost
                          post={{ ...post, caption: "" }}
                          altFallback={t.title}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto max-w-3xl px-4 sm:px-6">
                      <ProjectMediaPost post={post} altFallback={t.title} />
                    </div>
                  )}
                </MoodBlock>
              );
            })}
          </div>
        ) : null}
      </div>
    </CinematicProjectOpen>
  );
}
