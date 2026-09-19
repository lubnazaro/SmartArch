"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/constants";
import { LOCALES, LOCALE_LABELS } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function swapLocale(pathname: string, next: Locale) {
  const parts = pathname.split("/");
  if (LOCALES.includes(parts[1] as Locale)) {
    parts[1] = next;
    return parts.join("/") || `/${next}`;
  }
  return `/${next}`;
}

export function SiteHeader({
  locale,
  dict,
  logoUrl,
}: {
  locale: Locale;
  dict: Dictionary;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const base = `/${locale}`;

  const links = [
    { href: base, label: dict.nav.home },
    { href: `${base}/smart-home`, label: dict.nav.smartHome },
    { href: `${base}/interior-design`, label: dict.nav.interior },
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/faq`, label: dict.nav.faq },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-sand-200/60 bg-sand-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <Link href={base} className="relative z-10 flex items-center gap-3">
          {logoUrl ? (
            // Custom uploaded logo
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Smart Arch"
              className="h-8 w-auto sm:h-9"
            />
          ) : (
            <span className="font-display text-2xl tracking-tight text-ink sm:text-[1.7rem]">
              Smart Arch
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== base && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm tracking-wide transition-colors",
                  active
                    ? "text-ink"
                    : "text-ink-soft/70 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={swapLocale(pathname, l)}
                className={cn(
                  "px-2 py-1 text-xs uppercase tracking-[0.14em] transition-colors",
                  l === locale
                    ? "text-bronze"
                    : "text-ink-soft/50 hover:text-ink"
                )}
                hrefLang={l}
              >
                {l}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-sand-300/80 bg-sand-50/80 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-sand-200 bg-sand-50 px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-base text-ink-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex gap-3 border-t border-sand-200 pt-4">
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={swapLocale(pathname, l)}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-sm",
                  l === locale ? "text-bronze" : "text-ink-soft/60"
                )}
              >
                {LOCALE_LABELS[l]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
