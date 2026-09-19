import Image from "next/image";
import { InstagramIcon } from "@/components/icons";
import {
  getInstagramEmbed,
  getMediaImageUrls,
  getVimeoEmbedUrl,
  getYouTubeEmbedUrl,
  isDirectVideoUrl,
  isInstagramUrl,
  isLocalMediaUrl,
  type MediaLike,
} from "@/lib/media";

type Post = MediaLike & { id: string };

function InstagramEmbedFrame({
  url,
  caption,
}: {
  url: string;
  caption?: string | null;
}) {
  const embed = getInstagramEmbed(url);
  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-bronze hover:underline"
      >
        <InstagramIcon className="h-4 w-4" />
        {caption || url}
      </a>
    );
  }

  return (
    <article className="space-y-3">
      <div className="overflow-hidden bg-sand-100">
        <iframe
          src={embed.embedUrl}
          title={caption || `Instagram ${embed.kind}`}
          className="mx-auto w-full max-w-[540px] border-0"
          style={{ minHeight: 680, height: 680 }}
          loading="lazy"
          allow="encrypted-media; clipboard-write"
          allowFullScreen
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {caption ? <p className="text-ink-soft/70">{caption}</p> : null}
        <a
          href={embed.permalink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-bronze hover:underline"
        >
          <InstagramIcon className="h-3.5 w-3.5" />
          View on Instagram
        </a>
      </div>
    </article>
  );
}

function VideoPlayer({ url, caption }: { url: string; caption?: string | null }) {
  const youtube = getYouTubeEmbedUrl(url);
  if (youtube) {
    return (
      <article className="space-y-3">
        <div className="relative aspect-video w-full overflow-hidden bg-ink">
          <iframe
            src={youtube}
            title={caption || "YouTube video"}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {caption ? <p className="text-sm text-ink-soft/70">{caption}</p> : null}
      </article>
    );
  }

  const vimeo = getVimeoEmbedUrl(url);
  if (vimeo) {
    return (
      <article className="space-y-3">
        <div className="relative aspect-video w-full overflow-hidden bg-ink">
          <iframe
            src={vimeo}
            title={caption || "Vimeo video"}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {caption ? <p className="text-sm text-ink-soft/70">{caption}</p> : null}
      </article>
    );
  }

  if (isDirectVideoUrl(url) || isLocalMediaUrl(url)) {
    return (
      <article className="space-y-3">
        <video src={url} controls className="w-full bg-ink" preload="metadata" />
        {caption ? <p className="text-sm text-ink-soft/70">{caption}</p> : null}
      </article>
    );
  }

  return (
    <a href={url} target="_blank" rel="noreferrer" className="inline-flex text-bronze hover:underline">
      {caption || url}
    </a>
  );
}

function ImageGallery({
  media,
  altFallback,
}: {
  media: MediaLike;
  altFallback: string;
}) {
  const urls = getMediaImageUrls(media);
  return (
    <article className="space-y-3">
      <div className={urls.length > 1 ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"}>
        {urls.map((src) => (
          <div key={src} className="relative aspect-[4/3] overflow-hidden bg-sand-200">
            {isLocalMediaUrl(src) ? (
              <Image
                src={src}
                alt={media.caption || altFallback}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={media.caption || altFallback}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
      {media.caption ? <p className="text-sm text-ink-soft/70">{media.caption}</p> : null}
    </article>
  );
}

export function ProjectMediaPost({
  post,
  altFallback,
}: {
  post: Post;
  altFallback: string;
}) {
  if (post.type === "INSTAGRAM" || isInstagramUrl(post.url)) {
    return <InstagramEmbedFrame url={post.url} caption={post.caption} />;
  }

  if (post.type === "VIDEO") {
    return <VideoPlayer url={post.url} caption={post.caption} />;
  }

  // IMAGE — or mixed urlsJson that might include an Instagram link as primary
  if (isInstagramUrl(post.url) && getMediaImageUrls(post).length <= 1) {
    return <InstagramEmbedFrame url={post.url} caption={post.caption} />;
  }

  return <ImageGallery media={post} altFallback={altFallback} />;
}
