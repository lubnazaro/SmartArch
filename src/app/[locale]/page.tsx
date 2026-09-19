import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import {
  ensureSiteSettings,
  getAboutForLocale,
  getAboutImageUrl,
  getFeaturedProjects,
  getHeroForLocale,
  getHeroImageUrl,
} from "@/lib/content";
import { FadeIn, RevealText } from "@/components/motion";
import { ParallaxImageFrame, ParallaxLayer } from "@/components/parallax";
import { ProjectCoverImage } from "@/components/project-cover";
import { SignatureCarousel } from "@/components/signature-carousel";
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
  const heroImageUrl = getHeroImageUrl(settings);
  const aboutImageUrl = getAboutImageUrl(settings);

  return (
    <div>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden sm:min-h-[calc(100vh-5rem)]">
        <ParallaxLayer strength={14}>
          <div className="absolute inset-0">
            <ProjectCoverImage
              src={heroImageUrl}
              alt=""
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </ParallaxLayer>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--hero-veil-from), var(--hero-veil-mid), var(--hero-veil-edge))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--hero-veil-from), transparent, color-mix(in srgb, var(--hero-veil-from) 40%, transparent))",
          }}
        />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 sm:min-h-[calc(100vh-5rem)] sm:px-6 sm:pb-28">
          <RevealText>
            <p className="font-display text-5xl leading-none tracking-tight text-ink sm:text-7xl md:text-8xl">
              Smart Arch
            </p>
          </RevealText>
          <RevealText delay={0.12}>
            <h1 className="mt-6 max-w-xl font-display text-2xl text-ink-soft sm:text-3xl md:text-4xl">
              {hero.headline}
            </h1>
          </RevealText>
          <RevealText delay={0.22}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft/80 sm:text-lg">
              {hero.sub}
            </p>
          </RevealText>
          <RevealText delay={0.32}>
            <div className="mt-12 flex flex-wrap gap-3">
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

      <section className="mx-auto max-w-6xl px-4 section-space sm:px-6">
        <FadeIn>
          <div className="mb-14 flex items-end justify-between gap-4 border-b section-rule pb-6">
            <h2 className="font-display text-3xl text-ink sm:text-4xl md:text-5xl">
              {dict.home.featured}
            </h2>
          </div>
        </FadeIn>
        {featured.length === 0 ? (
          <p className="text-ink-soft/70">{dict.home.featuredEmpty}</p>
        ) : (
          <SignatureCarousel
            projects={featured}
            locale={locale}
            exploreLabel={dict.home.explore}
          />
        )}
      </section>

      <section className="border-y section-rule bg-sand-100/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 section-space sm:px-6 md:grid-cols-2 md:items-center md:gap-16">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.2em] text-bronze">
              {dict.nav.about}
            </p>
            <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
              {dict.home.aboutTitle}
            </h2>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft/80">
              {aboutPreview}
            </p>
            <Link
              href={`${base}/about`}
              className={cn(buttonVariants({ variant: "outline" }), "mt-10 rounded-none")}
            >
              {dict.home.aboutCta}
            </Link>
          </FadeIn>
          <FadeIn delay={0.12}>
            <ParallaxImageFrame className="aspect-[4/5] bg-sand-200">
              <ProjectCoverImage
                src={aboutImageUrl}
                alt=""
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </ParallaxImageFrame>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 section-space sm:px-6">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-8 border-t section-rule pt-14 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl text-ink sm:text-4xl md:text-5xl">
                {dict.home.contactTitle}
              </h2>
              <p className="mt-4 text-lg text-ink-soft/75">{settings.address}</p>
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
