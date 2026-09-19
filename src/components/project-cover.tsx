import Image from "next/image";
import { isLocalMediaUrl } from "@/lib/media";

/** Renders a project cover only when src is a real image path/URL. */
export function ProjectCoverImage({
  src,
  alt,
  priority = false,
  className = "object-cover",
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  if (isLocalMediaUrl(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={className}
        sizes={sizes}
      />
    );
  }

  // Remote image hosts not listed in next.config — use plain img
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${className}`} />
  );
}
