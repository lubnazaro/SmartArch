export const LOCALES = ["en", "ar", "he"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  he: "עברית",
};

export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
  he: "rtl",
};

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export const ADMIN_EMAILS = [
  "zarofiras@gmail.com",
  "lubnazaro@gmail.com",
] as const;

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return (ADMIN_EMAILS as readonly string[]).includes(email.toLowerCase());
}

export const CATEGORIES = {
  SMART_HOME: "SMART_HOME",
  INTERIOR: "INTERIOR",
} as const;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const MEDIA_TYPES = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  INSTAGRAM: "INSTAGRAM",
} as const;
