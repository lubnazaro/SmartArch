import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/constants";
import type { FaqItem, FaqTranslation, Project, ProjectTranslation, Media, SiteSettings } from "@prisma/client";

export type ProjectWithRelations = Project & {
  translations: ProjectTranslation[];
  media: Media[];
};

export type FaqWithTranslations = FaqItem & {
  translations: FaqTranslation[];
};

const DEFAULT_ABOUT_EN = `Smart Arch is an architecture and interior design studio that brings together thoughtful design and smart technology to create spaces that look beautiful and work beautifully.

We provide a complete design experience, from space planning and interior design to detailed drawings, material selection, execution supervision, and smart home solutions.

Our approach is simple: every project should reflect the people who live in it. We focus on functionality, comfort, and carefully considered details while creating a clear connection between architecture, interiors, and technology.

With our integrated Smart Home solutions, everyday features such as lighting, climate control, curtains, security, and more can become part of one seamless system designed around each client's lifestyle.

At Smart Arch, we don't just design spaces. We create complete living experiences where design meets technology.`;

export async function ensureSiteSettings(): Promise<SiteSettings> {
  const existing = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  if (existing) {
    const data: { aboutEn?: string; logoUrl?: string } = {};
    if (!existing.aboutEn) data.aboutEn = DEFAULT_ABOUT_EN;
    if (!existing.logoUrl) data.logoUrl = "/smart-arch-logo-web.png";
    if (Object.keys(data).length) {
      return prisma.siteSettings.update({ where: { id: "main" }, data });
    }
    return existing;
  }
  return prisma.siteSettings.create({
    data: {
      id: "main",
      aboutEn: DEFAULT_ABOUT_EN,
      logoUrl: "/smart-arch-logo-web.png",
    },
  });
}

export function pickProjectTranslation(
  project: ProjectWithRelations,
  locale: Locale
): ProjectTranslation | null {
  return (
    project.translations.find((t) => t.locale === locale) ||
    project.translations.find((t) => t.locale === "en") ||
    project.translations[0] ||
    null
  );
}

export function pickFaqTranslation(
  faq: FaqWithTranslations,
  locale: Locale
): FaqTranslation | null {
  return (
    faq.translations.find((t) => t.locale === locale) ||
    faq.translations.find((t) => t.locale === "en") ||
    faq.translations[0] ||
    null
  );
}

export function getAboutForLocale(settings: SiteSettings, locale: Locale): string {
  if (locale === "ar" && settings.aboutAr) return settings.aboutAr;
  if (locale === "he" && settings.aboutHe) return settings.aboutHe;
  return settings.aboutEn;
}

export function getHeroForLocale(settings: SiteSettings, locale: Locale) {
  if (locale === "ar" && settings.heroHeadlineAr) {
    return { headline: settings.heroHeadlineAr, sub: settings.heroSubAr || settings.heroSubEn };
  }
  if (locale === "he" && settings.heroHeadlineHe) {
    return { headline: settings.heroHeadlineHe, sub: settings.heroSubHe || settings.heroSubEn };
  }
  return { headline: settings.heroHeadlineEn, sub: settings.heroSubEn };
}

export async function getPublishedProjects(category?: string) {
  return prisma.project.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    include: { translations: true, media: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { published: true, featured: true },
    include: { translations: true, media: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 6,
  });
}

export async function getProjectBySlug(slug: string, locale: Locale) {
  const translation = await prisma.projectTranslation.findFirst({
    where: {
      OR: [
        { locale, slug },
        { locale: "en", slug },
      ],
    },
    include: {
      project: {
        include: {
          translations: true,
          media: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
  if (!translation?.project.published) return null;
  return translation.project;
}

export async function getPublishedFaqs() {
  return prisma.faqItem.findMany({
    where: { published: true },
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || `project-${Date.now()}`;
}

export function whatsappLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
  return `https://wa.me/${withCountry}`;
}
