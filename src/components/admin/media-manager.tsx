"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getMediaImageUrls,
  isInstagramUrl,
  isUsableCoverUrl,
  coverUrlErrorMessage,
  parseUrlsJson,
  serializeUrlsJson,
  splitPostUrlField,
  type MediaLike,
} from "@/lib/media";

export type MediaDraft = {
  type: "IMAGE" | "VIDEO" | "INSTAGRAM";
  url: string;
  urls?: string[];
  caption?: string;
};

export function mediaToDraft(m: MediaLike): MediaDraft {
  const extras = parseUrlsJson(m.urlsJson);
  const urls =
    m.type === "IMAGE"
      ? getMediaImageUrls(m)
      : extras.length
        ? extras
        : undefined;
  return {
    type: m.type as MediaDraft["type"],
    url: m.url,
    urls,
    caption: m.caption || "",
  };
}

type ComposerKind = "image" | "video" | null;

export function MediaManager({
  initial = [],
  name = "mediaJson",
}: {
  initial?: MediaDraft[];
  name?: string;
}) {
  const [items, setItems] = useState<MediaDraft[]>(initial);
  const [composer, setComposer] = useState<ComposerKind>(null);
  const [postUrl, setPostUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetComposer() {
    setComposer(null);
    setPostUrl("");
    setVideoUrl("");
    setImageUrls([]);
    setCaption("");
    setError(null);
  }

  async function uploadFile(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }

  async function onUploadImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadFile(file));
      }
      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onUploadVideo(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      setVideoUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function addImagePost() {
    const linkParts = splitPostUrlField(postUrl);
    const uploaded = [...new Set(imageUrls.map((u) => u.trim()).filter(Boolean))];
    if (linkParts.length === 0 && uploaded.length === 0) {
      setError("Add a post URL and/or upload at least one image.");
      return;
    }

    // Multiple direct URLs in the field → one multi-image post
    if (linkParts.length > 1) {
      const photos = [...uploaded, ...linkParts];
      const unique = [...new Set(photos)];
      setItems((prev) => [
        ...prev,
        {
          type: "IMAGE",
          url: unique[0],
          urls: unique,
          caption: caption.trim(),
        },
      ]);
      resetComposer();
      return;
    }

    const link = linkParts[0] || "";
    const photos = uploaded;

    if (photos.length > 0) {
      setItems((prev) => [
        ...prev,
        {
          type: "IMAGE",
          url: photos[0],
          urls: photos,
          caption: caption.trim() || (link ? `Post: ${link}` : ""),
        },
      ]);
    } else if (link) {
      setItems((prev) => [
        ...prev,
        {
          type: isInstagramUrl(link) ? "INSTAGRAM" : "IMAGE",
          url: link,
          caption: caption.trim(),
        },
      ]);
    }
    resetComposer();
  }

  function addVideoPost() {
    const url = videoUrl.trim();
    if (!url) {
      setError("Upload a video or paste a reel / video URL.");
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        type: isInstagramUrl(url) ? "INSTAGRAM" : "VIDEO",
        url,
        caption: caption.trim(),
      },
    ]);
    resetComposer();
  }

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function onDragStart(index: number) {
    setDragIndex(index);
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }

  function onDragEnd() {
    setDragIndex(null);
  }

  function removeAt(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function removeImageUrl(url: string) {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  }

  const payload = items.map((item) => ({
    type: item.type,
    url: item.url,
    urlsJson: serializeUrlsJson(
      item.type === "IMAGE" && item.urls?.length
        ? item.urls
        : item.urls || []
    ),
    caption: item.caption || "",
  }));

  return (
    <div className="space-y-5">
      <input type="hidden" name={name} value={JSON.stringify(payload)} />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          className="rounded-none"
          disabled={composer !== null}
          onClick={() => {
            setError(null);
            setComposer("image");
          }}
        >
          Add image post
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-none"
          disabled={composer !== null}
          onClick={() => {
            setError(null);
            setComposer("video");
          }}
        >
          Add video / reel
        </Button>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft/75">
        <li>
          <strong className="font-medium text-ink">Upload photos/videos</strong> to show them
          directly on the site.
        </li>
        <li>
          <strong className="font-medium text-ink">Paste an Instagram post or reel URL</strong> to
          embed the official Instagram player on the project page.
        </li>
        <li>Instagram page links are not cover images — use Upload cover photo above for covers.</li>
      </ul>

      {composer === "image" ? (
        <div className="space-y-4 border border-sand-300 bg-sand-50 p-4">
          <h3 className="font-display text-lg">New image post</h3>
          <div className="space-y-2">
            <Label htmlFor="postUrl">Instagram post URL (optional — embeds on site)</Label>
            <textarea
              id="postUrl"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/…  — or paste direct image URLs (one per line)"
              className="flex min-h-[72px] w-full rounded-none border border-input bg-transparent px-3 py-2 text-sm"
              rows={3}
            />
            <p className="text-xs text-ink-soft/60">
              Instagram links embed the post. For photos that always display on-site, upload files below.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Upload photos (recommended for on-site gallery)</Label>
            <Label className="inline-flex cursor-pointer items-center gap-2 border border-sand-300 bg-white px-3 py-2 text-sm font-medium">
              {uploading ? "Uploading…" : "Choose photos"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  void onUploadImages(e.target.files);
                  e.target.value = "";
                }}
              />
            </Label>
            {imageUrls.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {imageUrls.map((url) => (
                  <li key={url} className="flex items-center justify-between gap-2">
                    <span className="truncate">{url}</span>
                    <button
                      type="button"
                      className="shrink-0 text-red-700 underline"
                      onClick={() => removeImageUrl(url)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageCaption">Caption (optional)</Label>
            <Input
              id="imageCaption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="rounded-none"
            />
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button type="button" className="rounded-none" onClick={addImagePost} disabled={uploading}>
              Add post
            </Button>
            <Button type="button" variant="outline" className="rounded-none" onClick={resetComposer}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {composer === "video" ? (
        <div className="space-y-4 border border-sand-300 bg-sand-50 p-4">
          <h3 className="font-display text-lg">New video / reel post</h3>
          <div className="space-y-2">
            <Label>Upload video file (plays on site)</Label>
            <Label className="inline-flex cursor-pointer items-center gap-2 border border-sand-300 bg-white px-3 py-2 text-sm font-medium">
              {uploading ? "Uploading…" : "Choose video"}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  void onUploadVideo(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Or Instagram reel / YouTube / Vimeo / video URL</Label>
            <Input
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/… or uploaded /uploads/…"
              className="rounded-none"
            />
            <p className="text-xs text-ink-soft/60">
              Instagram reel URLs embed on the page. Uploaded files play with native video controls.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoCaption">Caption (optional)</Label>
            <Input
              id="videoCaption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="rounded-none"
            />
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button type="button" className="rounded-none" onClick={addVideoPost} disabled={uploading}>
              Add post
            </Button>
            <Button type="button" variant="outline" className="rounded-none" onClick={resetComposer}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-ink">
          Posts in this project ({items.length})
        </h3>
        <p className="text-xs text-ink-soft/60">
          Drag to reorder, or use Up/Down. Order is saved with the project.
        </p>
        {items.length === 0 ? (
          <p className="text-sm text-ink-soft/60">No posts yet. Add an image or video post above.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, index) => {
              const photoCount =
                item.type === "IMAGE" && item.urls?.length
                  ? item.urls.length
                  : item.type === "IMAGE"
                    ? 1
                    : 0;
              const kind =
                item.type === "VIDEO"
                  ? "Video"
                  : item.type === "INSTAGRAM"
                    ? "Instagram / reel"
                    : photoCount > 1
                      ? `Image × ${photoCount}`
                      : "Image";
              return (
                <li
                  key={`${item.type}-${item.url}-${index}`}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  className={`flex cursor-grab flex-wrap items-center justify-between gap-3 border border-sand-200 bg-sand-50 px-3 py-2 text-sm active:cursor-grabbing ${
                    dragIndex === index ? "opacity-60" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-bronze">{kind}</span>
                    <span className="mx-2 text-ink-soft/40">·</span>
                    <span className="truncate">{item.url}</span>
                    {item.caption ? (
                      <span className="mt-0.5 block truncate text-xs text-ink-soft/60">
                        {item.caption}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      className="underline disabled:opacity-40"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="underline disabled:opacity-40"
                      disabled={index === items.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      className="text-red-700 underline"
                      onClick={() => removeAt(index)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function LogoUploader({
  name = "logoUrl",
  initial = "",
}: {
  name?: string;
  initial?: string;
}) {
  const [url, setUrl] = useState(initial);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={url} />
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Logo preview" className="h-12 w-auto bg-sand-100 p-2" />
      ) : null}
      <Label className="inline-flex cursor-pointer items-center gap-2 border border-sand-300 bg-sand-50 px-3 py-2 text-sm">
        {uploading ? "Uploading…" : "Upload logo (PNG / SVG / JPG)"}
        <input
          type="file"
          accept="image/*,.svg"
          className="hidden"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            try {
              const body = new FormData();
              body.append("file", file);
              const res = await fetch("/api/upload", { method: "POST", body });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Upload failed");
              setUrl(data.url);
            } finally {
              setUploading(false);
              e.target.value = "";
            }
          }}
        />
      </Label>
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="/uploads/logo.png or leave empty for default wordmark"
        className="rounded-none"
      />
    </div>
  );
}

export function CoverUploader({
  name = "coverUrl",
  initial = "",
  label = "Cover photo",
  helpText = "Upload an image file for the project cover. Instagram post links will not display as covers — use them in Project posts below to embed the reel/post on the page.",
  buttonLabel = "Upload cover photo",
  clearLabel = "Clear cover",
  placeholder = "/uploads/cover.jpg",
}: {
  name?: string;
  initial?: string;
  label?: string;
  helpText?: string;
  buttonLabel?: string;
  clearLabel?: string;
  placeholder?: string;
}) {
  const [url, setUrl] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(() => coverUrlErrorMessage(initial));

  function onUrlChange(next: string) {
    const msg = coverUrlErrorMessage(next);
    setError(msg);
    setUrl(next);
  }

  const submitValue = error ? "" : url;

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={submitValue} />
      <div className="space-y-1">
        <Label>{label}</Label>
        <p className="text-xs text-ink-soft/65">{helpText}</p>
      </div>
      {submitValue && isUsableCoverUrl(submitValue) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={submitValue}
          alt={`${label} preview`}
          className="max-h-40 w-full max-w-md object-cover bg-sand-100"
        />
      ) : null}
      <Label className="inline-flex cursor-pointer items-center gap-2 border border-sand-300 bg-sand-50 px-4 py-2.5 text-sm font-medium">
        {uploading ? "Uploading…" : buttonLabel}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            setError(null);
            try {
              const body = new FormData();
              body.append("file", file);
              const res = await fetch("/api/upload", { method: "POST", body });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Upload failed");
              setUrl(data.url);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
            } finally {
              setUploading(false);
              e.target.value = "";
            }
          }}
        />
      </Label>
      <div className="space-y-1">
        <Label htmlFor={name} className="text-xs text-ink-soft/70">
          Or paste a direct image URL (not an Instagram page)
        </Label>
        <Input
          id={name}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder={placeholder}
          className="rounded-none"
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {url ? (
        <button
          type="button"
          className="text-sm text-red-700 underline"
          onClick={() => {
            setUrl("");
            setError(null);
          }}
        >
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
}
