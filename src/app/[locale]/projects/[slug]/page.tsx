import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { isLocale, CATEGORIES, type Locale } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import {
  getProjectBySlug,
  pickProjectTranslation,
} from "@/lib/content";
import { getMediaImageUrls, isInstagramUrl } from "@/lib/media";
import { FadeIn } from "@/components/motion";

function isLocalMediaUrl(url: string) {
  return url.startsWith("/") || url.startsWith("data:");
}

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

  return (
    <div className="pb-20">
      <div className="relative aspect-[16/10] max-h-[70vh] w-full overflow-hidden bg-sand-200">
        {project.coverUrl ? (
          <Image
            src={project.coverUrl}
            alt={t.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
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
            {posts.map((post, i) => {
              if (post.type === "VIDEO") {
                const isFile = isLocalMediaUrl(post.url);
                return (
                  <FadeIn key={post.id} delay={i * 0.04}>
                    <article className="space-y-3">
                      {isFile ? (
                        <video
                          src={post.url}
                          controls
                          className="w-full bg-ink"
                          preload="metadata"
                        />
                      ) : (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex text-bronze hover:underline"
                        >
                          {post.caption || post.url}
                        </a>
                      )}
                      {post.caption && isFile ? (
                        <p className="text-sm text-ink-soft/70">{post.caption}</p>
                      ) : null}
                    </article>
                  </FadeIn>
                );
              }

              if (post.type === "INSTAGRAM" || isInstagramUrl(post.url)) {
                return (
                  <FadeIn key={post.id} delay={i * 0.04}>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-bronze hover:underline"
                    >
                      <InstagramIcon className="h-4 w-4" />
                      {post.caption || post.url}
                    </a>
                  </FadeIn>
                );
              }

              // IMAGE post — one or many photos
              const urls = getMediaImageUrls(post);
              return (
                <FadeIn key={post.id} delay={i * 0.04}>
                  <article className="space-y-3">
                    <div className={urls.length > 1 ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"}>
                      {urls.map((src) => (
                        <div
                          key={src}
                          className="relative aspect-[4/3] overflow-hidden bg-sand-200"
                        >
                          {isLocalMediaUrl(src) ? (
                            <Image
                              src={src}
                              alt={post.caption || t.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 768px"
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={src}
                              alt={post.caption || t.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {post.caption ? (
                      <p className="text-sm text-ink-soft/70">{post.caption}</p>
                    ) : null}
                  </article>
                </FadeIn>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
