import path from "path";

/** Persistent uploads root: Fly volume (`DATA_DIR`) or local `public/`. */
export function getUploadsDir(): string {
  const dataRoot = process.env.DATA_DIR || path.join(process.cwd(), "public");
  return path.join(dataRoot, "uploads");
}

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/mp4",
  ".ogg": "video/ogg",
  ".pdf": "application/pdf",
};

export function contentTypeForFile(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_BY_EXT[ext] || "application/octet-stream";
}

/**
 * Resolve a URL path segment list under the uploads dir.
 * Returns null if the path escapes the uploads directory.
 */
export function resolveUploadPath(segments: string[]): string | null {
  if (!segments.length) return null;
  if (segments.some((s) => !s || s === "." || s === ".." || s.includes("\0"))) {
    return null;
  }
  const uploadsDir = path.resolve(getUploadsDir());
  const resolved = path.resolve(uploadsDir, ...segments);
  const relative = path.relative(uploadsDir, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return resolved;
}
