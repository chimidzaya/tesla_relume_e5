import type { Metadata } from "next";
import { Literata, Onest } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getModels, modelHref } from "@/data/models";
import "./globals.css";

/** Sans: гарчиг, товч, label, тоо. Монгол Ө, Ү нь cyrillic-ext багцад байдаг. */
const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

/** Serif: тайлбар, бичвэр (<p>). */
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "Tesla — Ирээдүйн жолоодлого",
    template: "%s — Tesla",
  },
  description: "Tesla-ийн 5 загварын цахилгаан машинуудын танилцуулга, харьцуулалт.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const models = await getModels();
  const navLinks = models.map((model) => ({ label: model.name, href: modelHref(model) }));

  return (
    <html
      lang="mn"
      className={`${onest.variable} ${literata.variable} motion-safe:scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        {/* Reveal анимацыг зөвхөн JS ажиллаж байхад идэвхжүүлнэ */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
        <Navbar links={navLinks} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
