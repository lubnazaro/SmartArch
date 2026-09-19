import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Smart Arch — Architecture & Interior Design",
    template: "%s · Smart Arch",
  },
  description:
    "Architecture and interior design studio with integrated smart home solutions. Bethlehem / Jerusalem.",
  metadataBase: new URL("https://www.smartarch.net"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
