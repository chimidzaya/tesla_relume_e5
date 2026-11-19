import type { Metadata } from "next";
import { Literata, Onest } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { TestDriveProvider } from "@/components/testdrive/TestDriveProvider";
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
  const testDriveModels = models.map(({ slug, name, category, image }) => ({ slug, name, category, image }));

  return (
    <html
      lang="mn"
      // Lenis асвал (html.lenis) хөтчийн smooth-ийг унтраана — хоёр зэрэг ажиллавал гүйлгэлт «гацна»
      // Машин сонгох цонх нээлттэй үед ард талын хуудас гүйлгэгдэхгүй
      className={`${onest.variable} ${literata.variable} motion-safe:scroll-smooth [&.lenis]:scroll-auto has-[dialog[open]]:overflow-hidden`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        {/* Reveal анимацыг зөвхөн JS ажиллаж байхад идэвхжүүлнэ */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
        <SmoothScroll />
        {/* Туршилтын жолоодлого: машин сонгох цонх + Cal.com popup + баталгаажуулалт — бүх хуудсанд */}
        <TestDriveProvider models={testDriveModels}>
          <Navbar links={navLinks} />
          <main>{children}</main>
          <Footer />
        </TestDriveProvider>
      </body>
    </html>
  );
}
