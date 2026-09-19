import { MEDIA_TYPES } from "@/lib/constants";

export type MediaType = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];

export type MediaLike = {
  type: string;
  url: string;
  urlsJson?: string | null;
  caption?: string | null;
};

/** Parse urlsJson safely; always includes the primary url first (deduped). */
export function getMediaImageUrls(media: MediaLike): string[] {
  const extras = parseUrlsJson(media.urlsJson);
  const all = [media.url, ...extras].map((u) => u.trim()).filter(Boolean);
  return [...new Set(all)];
}

export function parseUrlsJson(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  } catch {
    return [];
  }
}

export function serializeUrlsJson(urls: string[]): string {
  const clean = [...new Set(urls.map((u) => u.trim()).filter(Boolean))];
  return JSON.stringify(clean);
}

export function isInstagramUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "instagram.com" || host === "instagr.am";
  } catch {
    return /instagram\.com|instagr\.am/i.test(url);
  }
}

/** Infer public post label for admin list. */
export function postKindLabel(type: string): "Image" | "Video" | "Instagram" {
  if (type === MEDIA_TYPES.VIDEO) return "Video";
  if (type === MEDIA_TYPES.INSTAGRAM) return "Instagram";
  return "Image";
}

/**
 * Split a post-URL field that may hold one Instagram/carousel link
 * or several direct image URLs (newline / comma separated).
 */
export function splitPostUrlField(value: string): string[] {
  return [
    ...new Set(
      value
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter(Boolean)
    ),
  ];
}
