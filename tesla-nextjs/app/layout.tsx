import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  // Монгол Ө, Ү үсэг cyrillic-ext багцад байдаг
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

/** Гарчгуудад зориулсан гоёмсог serif фонт (Ө, Ү үсгийг дэмждэг) */
const playfair = Lora({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "Tesla — Ирээдүйн жолоодлого",
    template: "%s — Tesla",
  },
  description: "Tesla-ийн 5 загварын цахилгаан машинуудын танилцуулга, харьцуулалт.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body>
        {/* Reveal анимацыг зөвхөн JS ажиллаж байхад идэвхжүүлнэ */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
