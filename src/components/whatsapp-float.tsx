"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppFloat({
  href,
  label = "WhatsApp",
}: {
  href: string;
  label?: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={cn(
        "fixed bottom-6 end-6 z-40 inline-flex h-12 w-12 items-center justify-center",
        "border border-bronze/40 bg-sand-50/90 text-bronze shadow-[0_8px_30px_rgba(26,23,20,0.12)]",
        "backdrop-blur-md transition-all duration-300",
        "hover:border-bronze hover:bg-sand-50 hover:text-ink",
        "dark:border-bronze/50 dark:bg-sand-100/90 dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40"
      )}
    >
      <MessageCircle className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
    </a>
  );
}
