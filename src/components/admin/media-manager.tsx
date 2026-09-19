"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type MediaDraft = {
  type: "IMAGE" | "VIDEO" | "INSTAGRAM";
  url: string;
  caption?: string;
};

export function MediaManager({
  initial = [],
  name = "mediaJson",
}: {
  initial?: MediaDraft[];
  name?: string;
}) {
  const [items, setItems] = useState<MediaDraft[]>(initial);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUpload(file: File, type: "IMAGE" | "VIDEO") {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setItems((prev) => [...prev, { type, url: data.url }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function addInstagram() {
    const url = instagramUrl.trim();
    if (!url) return;
    setItems((prev) => [...prev, { type: "INSTAGRAM", url }]);
    setInstagramUrl("");
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <div className="flex flex-wrap gap-3">
        <Label className="inline-flex cursor-pointer items-center gap-2 border border-sand-300 bg-sand-50 px-3 py-2 text-sm">
          {uploading ? "Uploading…" : "Upload photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload(file, "IMAGE");
              e.target.value = "";
            }}
          />
        </Label>
        <Label className="inline-flex cursor-pointer items-center gap-2 border border-sand-300 bg-sand-50 px-3 py-2 text-sm">
          Upload video
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload(file, "VIDEO");
              e.target.value = "";
            }}
          />
        </Label>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          placeholder="Instagram post/reel URL"
          className="max-w-md rounded-none"
        />
        <Button type="button" variant="outline" className="rounded-none" onClick={addInstagram}>
          Add Instagram link
        </Button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item.url}-${index}`}
            className="flex items-center justify-between gap-3 border border-sand-200 bg-sand-50 px-3 py-2 text-sm"
          >
            <span className="truncate">
              <span className="text-bronze">{item.type}</span> · {item.url}
            </span>
            <button
              type="button"
              className="text-red-700 underline"
              onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
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
