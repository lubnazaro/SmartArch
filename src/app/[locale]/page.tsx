import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { isLocale, type Locale } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import {
  ensureSiteSettings,
  getAboutForLocale,
  getFeaturedProjects,
  getHeroForLocale,
  pickProjectTranslation,
} from "@/lib/content";
import { FadeIn, RevealText } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const settings = await ensureSiteSettings();
  const hero = getHeroForLocale(settings, locale);
  const about = getAboutForLocale(settings, locale);
  const featured = await getFeaturedProjects();
  const aboutPreview = about.split("\n\n")[0] ?? about;
  const base = `/${locale}`;

  return (
    <div>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden sm:min-h-[calc(100vh-5rem)]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=80"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sand-50 via-sand-50/88 to-sand-50/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-sand-50 via-transparent to-sand-50/40" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 sm:min-h-[calc(100vh-5rem)] sm:px-6 sm:pb-24">
          <RevealText>
            <p className="font-display text-5xl leading-none tracking-tight text-ink sm:text-7xl md:text-8xl">
              Smart Arch
            </p>
          </RevealText>
          <RevealText delay={0.12}>
            <h1 className="mt-5 max-w-xl font-display text-2xl text-ink-soft sm:text-3xl md:text-4xl">
              {hero.headline}
            </h1>
          </RevealText>
          <RevealText delay={0.22}>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft/80 sm:text-lg">
              {hero.sub}
            </p>
          </RevealText>
          <RevealText delay={0.32}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={`${base}/smart-home`}
                className={cn(buttonVariants({ size: "lg" }), "rounded-none px-7")}
              >
                {dict.home.ctaSmart}
              </Link>
              <Link
                href={`${base}/interior-design`}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "rounded-none border-ink/20 bg-sand-50/50 px-7 backdrop-blur-sm"
                )}
              >
                {dict.home.ctaInterior}
              </Link>
            </div>
          </RevealText>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <FadeIn>
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              {dict.home.featured}
            </h2>
          </div>
        </FadeIn>
        {featured.length === 0 ? (
          <p className="text-ink-soft/70">{dict.home.featuredEmpty}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((project, i) => {
              const t = pickProjectTranslation(project, locale);
              if (!t) return null;
              return (
                <FadeIn key={project.id} delay={i * 0.08}>
                  <Link
                    href={`${base}/projects/${t.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-sand-200">
                      {project.coverUrl ? (
                        <Image
                          src={project.coverUrl}
                          alt={t.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="arch-grid h-full" />
                      )}
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-xl text-ink">{t.title}</p>
                        {t.summary ? (
                          <p className="mt-1 line-clamp-2 text-sm text-ink-soft/70">
                            {t.summary}
                          </p>
                        ) : null}
                      </div>
                      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-bronze opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-y border-sand-200/80 bg-sand-100/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-28 md:grid-cols-2 md:items-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.2em] text-bronze">
              {dict.nav.about}
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              {dict.home.aboutTitle}
            </h2>
            <p className="mt-5 max-w-prose leading-relaxed text-ink-soft/80">
              {aboutPreview}
            </p>
            <Link
              href={`${base}/about`}
              className={cn(buttonVariants({ variant: "outline" }), "mt-8 rounded-none")}
            >
              {dict.home.aboutCta}
            </Link>
          </FadeIn>
          <FadeIn delay={0.12}>
            <div className="relative aspect-[4/5] overflow-hidden bg-sand-200">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">
                {dict.home.contactTitle}
              </h2>
              <p className="mt-3 text-ink-soft/75">{settings.address}</p>
            </div>
            <Link
              href={`${base}/contact`}
              className={cn(buttonVariants({ size: "lg" }), "rounded-none")}
            >
              {dict.home.contactCta}
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
