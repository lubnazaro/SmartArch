import Link from "next/link";
import type { Locale } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import type { SiteSettings } from "@prisma/client";

export function SiteFooter({
  locale,
  dict,
  settings,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
}) {
  const year = new Date().getFullYear();
  const base = `/${locale}`;

  return (
    <footer className="mt-auto border-t border-sand-200/80 bg-sand-100/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl tracking-tight text-ink">
            {dict.brand}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft/75">
            {dict.footer.designTech}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-bronze">
            {dict.nav.projects}
          </p>
          <Link href={`${base}/smart-home`} className="block text-ink-soft hover:text-ink">
            {dict.nav.smartHome}
          </Link>
          <Link href={`${base}/interior-design`} className="block text-ink-soft hover:text-ink">
            {dict.nav.interior}
          </Link>
          <Link href={`${base}/about`} className="block text-ink-soft hover:text-ink">
            {dict.nav.about}
          </Link>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-bronze">
            {dict.nav.contact}
          </p>
          <a href={`mailto:${settings.email}`} className="block text-ink-soft hover:text-ink">
            {settings.email}
          </a>
          <a href={`tel:${settings.phone}`} className="block text-ink-soft hover:text-ink">
            {settings.phone}
          </a>
          <p className="text-ink-soft/80">{settings.address}</p>
        </div>
      </div>
      <div className="border-t border-sand-200/80 px-4 py-5 text-center text-xs text-ink-soft/60 sm:px-6">
        © {year} Smart Arch. {dict.footer.rights}
      </div>
    </footer>
  );
}
