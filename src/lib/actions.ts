"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import { slugify } from "@/lib/content";
import { CATEGORIES, LOCALES } from "@/lib/constants";

async function assertAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

function revalidateSite() {
  revalidatePath("/", "layout");
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`, "layout");
  }
}

export async function saveSiteSettings(formData: FormData) {
  await assertAdmin();
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    create: { id: "main" },
    update: {},
  });
  await prisma.siteSettings.update({
    where: { id: "main" },
    data: {
      phone: String(formData.get("phone") || ""),
      whatsapp: String(formData.get("whatsapp") || ""),
      email: String(formData.get("email") || ""),
      instagramUrl: String(formData.get("instagramUrl") || ""),
      instagramHandle: String(formData.get("instagramHandle") || ""),
      address: String(formData.get("address") || ""),
      logoUrl: String(formData.get("logoUrl") || "") || null,
      heroImageUrl: (() => {
        const raw = String(formData.get("heroImageUrl") || "").trim();
        if (raw && (/instagram\.com|instagr\.am/i.test(raw))) {
          throw new Error(
            "Instagram links cannot be used as homepage images. Upload a photo instead."
          );
        }
        return raw || null;
      })(),
      aboutImageUrl: (() => {
        const raw = String(formData.get("aboutImageUrl") || "").trim();
        if (raw && (/instagram\.com|instagr\.am/i.test(raw))) {
          throw new Error(
            "Instagram links cannot be used as homepage images. Upload a photo instead."
          );
        }
        return raw || null;
      })(),
      aboutEn: String(formData.get("aboutEn") || ""),
      aboutAr: String(formData.get("aboutAr") || ""),
      aboutHe: String(formData.get("aboutHe") || ""),
      heroHeadlineEn: String(formData.get("heroHeadlineEn") || ""),
      heroHeadlineAr: String(formData.get("heroHeadlineAr") || ""),
      heroHeadlineHe: String(formData.get("heroHeadlineHe") || ""),
      heroSubEn: String(formData.get("heroSubEn") || ""),
      heroSubAr: String(formData.get("heroSubAr") || ""),
      heroSubHe: String(formData.get("heroSubHe") || ""),
    },
  });
  revalidateSite();
}

export async function upsertProject(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const category = String(formData.get("category") || CATEGORIES.INTERIOR);
  const titleEn = String(formData.get("titleEn") || "").trim();
  if (!titleEn) throw new Error("English title is required");

  const slugEn =
    String(formData.get("slugEn") || "").trim() || slugify(titleEn);
  const rawCover = String(formData.get("coverUrl") || "").trim();
  if (rawCover && (/instagram\.com|instagr\.am/i.test(rawCover))) {
    throw new Error(
      "Instagram links cannot be used as cover images. Use Upload cover photo instead."
    );
  }
  const rawBefore = String(formData.get("beforeImageUrl") || "").trim();
  const rawAfter = String(formData.get("afterImageUrl") || "").trim();
  for (const [label, raw] of [
    ["before", rawBefore],
    ["after", rawAfter],
  ] as const) {
    if (raw && (/instagram\.com|instagr\.am/i.test(raw))) {
      throw new Error(
        `Instagram links cannot be used as ${label} images. Upload a photo instead.`
      );
    }
  }

  const data = {
    category,
    coverUrl: rawCover || null,
    beforeImageUrl: rawBefore || null,
    afterImageUrl: rawAfter || null,
    year: formData.get("year") ? Number(formData.get("year")) : null,
    location: String(formData.get("location") || "") || null,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
  };

  const translations = [
    {
      locale: "en",
      title: titleEn,
      slug: slugEn,
      summary: String(formData.get("summaryEn") || ""),
      description: String(formData.get("descriptionEn") || ""),
    },
    {
      locale: "ar",
      title: String(formData.get("titleAr") || titleEn),
      slug: String(formData.get("slugAr") || "").trim() || `${slugEn}-ar`,
      summary: String(formData.get("summaryAr") || ""),
      description: String(formData.get("descriptionAr") || ""),
    },
    {
      locale: "he",
      title: String(formData.get("titleHe") || titleEn),
      slug: String(formData.get("slugHe") || "").trim() || `${slugEn}-he`,
      summary: String(formData.get("summaryHe") || ""),
      description: String(formData.get("descriptionHe") || ""),
    },
  ];

  let projectId = id;
  if (id) {
    await prisma.project.update({ where: { id }, data });
    for (const t of translations) {
      await prisma.projectTranslation.upsert({
        where: { projectId_locale: { projectId: id, locale: t.locale } },
        create: { projectId: id, ...t },
        update: t,
      });
    }
  } else {
    const created = await prisma.project.create({
      data: {
        ...data,
        translations: { create: translations },
      },
    });
    projectId = created.id;
  }

  const mediaJson = String(formData.get("mediaJson") || "[]");
  let media: {
    type: string;
    url: string;
    urlsJson?: string;
    caption?: string;
  }[] = [];
  try {
    media = JSON.parse(mediaJson);
  } catch {
    media = [];
  }
  await prisma.media.deleteMany({ where: { projectId } });
  if (media.length) {
    await prisma.media.createMany({
      data: media
        .filter((m) => m.url?.trim())
        .map((m, i) => ({
          projectId,
          type: m.type,
          url: m.url.trim(),
          urlsJson: m.urlsJson || "[]",
          caption: m.caption || "",
          sortOrder: i,
        })),
    });
  }

  revalidateSite();
  return projectId;
}

export async function deleteProject(id: string) {
  await assertAdmin();
  await prisma.project.delete({ where: { id } });
  revalidateSite();
}

/** Persist project list order from drag-and-drop (array of ids, first = top). */
export async function reorderProjects(orderedIds: string[]) {
  await assertAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );
  revalidateSite();
}

export async function upsertFaq(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const questionEn = String(formData.get("questionEn") || "").trim();
  const answerEn = String(formData.get("answerEn") || "").trim();
  if (!questionEn || !answerEn) throw new Error("English Q&A required");

  const published = formData.get("published") === "on";
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const translations = [
    {
      locale: "en",
      question: questionEn,
      answer: answerEn,
    },
    {
      locale: "ar",
      question: String(formData.get("questionAr") || questionEn),
      answer: String(formData.get("answerAr") || answerEn),
    },
    {
      locale: "he",
      question: String(formData.get("questionHe") || questionEn),
      answer: String(formData.get("answerHe") || answerEn),
    },
  ];

  if (id) {
    await prisma.faqItem.update({
      where: { id },
      data: { published, sortOrder },
    });
    for (const t of translations) {
      await prisma.faqTranslation.upsert({
        where: { faqId_locale: { faqId: id, locale: t.locale } },
        create: { faqId: id, ...t },
        update: t,
      });
    }
  } else {
    await prisma.faqItem.create({
      data: {
        published,
        sortOrder,
        translations: { create: translations },
      },
    });
  }
  revalidateSite();
}

export async function deleteFaq(id: string) {
  await assertAdmin();
  await prisma.faqItem.delete({ where: { id } });
  revalidateSite();
}
