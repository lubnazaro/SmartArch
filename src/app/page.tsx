import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Smart Arch — Architecture & Interior Design",
  description:
    "Smart Arch brings thoughtful design and smart technology together for spaces that look beautiful and work beautifully.",
};

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
