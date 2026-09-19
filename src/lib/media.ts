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

export type InstagramEmbedKind = "p" | "reel";

export type InstagramEmbed = {
  kind: InstagramEmbedKind;
  code: string;
  embedUrl: string;
  permalink: string;
};

/**
 * Parse Instagram post/reel shortcodes from URLs like:
 * https://www.instagram.com/p/DdT8zmkDeUA/?img_index=1
 * https://www.instagram.com/reel/ABC123/
 */
export function getInstagramEmbed(url: string): InstagramEmbed | null {
  if (!url?.trim()) return null;
  const match = url.match(
    /(?:instagram\.com|instagr\.am)\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i
  );
  if (!match) return null;
  const rawKind = match[1].toLowerCase();
  const code = match[2];
  const kind: InstagramEmbedKind = rawKind === "p" ? "p" : "reel";
  const pathKind = kind === "p" ? "p" : "reel";
  return {
    kind,
    code,
    embedUrl: `https://www.instagram.com/${pathKind}/${code}/embed`,
    permalink: `https://www.instagram.com/${pathKind}/${code}/`,
  };
}

export function isLocalMediaUrl(url: string): boolean {
  return url.startsWith("/") || url.startsWith("data:");
}

export function isDirectVideoUrl(url: string): boolean {
  if (isLocalMediaUrl(url) && /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)) {
    return true;
  }
  if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)) return true;
  // Uploaded videos often land as /uploads/<timestamp>-xxx.mp4
  if (url.startsWith("/uploads/") && /\.(mp4|webm|ogg|mov|m4v)$/i.test(url.split("?")[0])) {
    return true;
  }
  return false;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname.startsWith("/embed/")) {
        return `https://www.youtube.com${u.pathname}`;
      }
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const shorts = u.pathname.match(/^\/shorts\/([A-Za-z0-9_-]+)/);
      if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function getVimeoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
    if (host === "player.vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    const id = u.pathname.split("/").filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  } catch {
    return null;
  }
}

/**
 * Cover images must be real image paths/URLs — not Instagram post pages.
 * Instagram /p/ and /reel/ URLs are HTML pages and break <img src>.
 */
export function isUsableCoverUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  const trimmed = url.trim();
  if (isInstagramUrl(trimmed)) return false;
  if (/instagram\.com|instagr\.am/i.test(trimmed)) return false;
  if (trimmed.startsWith("/uploads/")) return true;
  if (trimmed.startsWith("data:image")) return true;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|#|$)/i.test(trimmed)) return true;
  try {
    const u = new URL(trimmed);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function coverUrlErrorMessage(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (isInstagramUrl(trimmed) || /instagram\.com\/(p|reel|reels|tv)\//i.test(trimmed)) {
    return "Instagram post links cannot be used as cover images. Upload a cover photo instead.";
  }
  return null;
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
