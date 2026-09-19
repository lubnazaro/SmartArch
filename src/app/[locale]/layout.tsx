import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { HtmlLang } from "@/components/html-lang";
import { isLocale, type Locale } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { ensureSiteSettings, whatsappLink } from "@/lib/content";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const settings = await ensureSiteSettings();

  return (
    <>
      <HtmlLang locale={locale} />
      <SiteHeader locale={locale} dict={dict} logoUrl={settings.logoUrl} />
      <main className="flex-1 pt-[4.5rem] sm:pt-24">{children}</main>
      <SiteFooter locale={locale} dict={dict} settings={settings} />
      <WhatsAppFloat
        href={whatsappLink(settings.whatsapp)}
        label={dict.contact.whatsapp}
      />
    </>
  );
}
