import { notFound } from "next/navigation";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { ensureSiteSettings, whatsappLink } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { FadeIn } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const settings = await ensureSiteSettings();
  const wa = whatsappLink(settings.whatsapp);

  const rows = [
    {
      label: dict.contact.phone,
      value: settings.phone,
      href: `tel:${settings.phone}`,
      icon: Phone,
    },
    {
      label: dict.contact.whatsapp,
      value: settings.whatsapp,
      href: wa,
      icon: MessageCircle,
    },
    {
      label: dict.contact.email,
      value: settings.email,
      href: `mailto:${settings.email}`,
      icon: Mail,
    },
    {
      label: dict.contact.instagram,
      value: settings.instagramHandle,
      href: settings.instagramUrl,
      icon: InstagramIcon,
    },
    {
      label: dict.contact.address,
      value: settings.address,
      href: null,
      icon: MapPin,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 section-space sm:px-6">
      <FadeIn>
        <h1 className="page-title">{dict.contact.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft/75 sm:text-xl">
          {dict.contact.subtitle}
        </p>
        <div className="mt-10 h-px w-16 bg-bronze/40" />
      </FadeIn>

      <div className="mt-14 divide-y divide-sand-200 border-y section-rule">
        {rows.map((row, i) => {
          const Icon = row.icon;
          const content = (
            <div className="flex items-start gap-4 py-6">
              <Icon className="mt-1 h-5 w-5 text-bronze" />
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-bronze">
                  {row.label}
                </p>
                <p className="mt-1 text-lg text-ink">{row.value}</p>
              </div>
            </div>
          );
          return (
            <FadeIn key={row.label} delay={i * 0.05}>
              {row.href ? (
                <a href={row.href} target={row.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block transition-colors hover:bg-sand-100/50">
                  {content}
                </a>
              ) : (
                content
              )}
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.2}>
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ size: "lg" }), "mt-10 rounded-none")}
        >
          {dict.contact.message}
        </a>
      </FadeIn>
    </div>
  );
}
