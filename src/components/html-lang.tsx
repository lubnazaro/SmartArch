"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/constants";
import { LOCALE_DIR } from "@/lib/constants";

export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_DIR[locale];
  }, [locale]);
  return null;
}
