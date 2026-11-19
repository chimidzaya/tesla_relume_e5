import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconCard, icons } from "@/components/model/IconCard";
import { InfoCard } from "@/components/model/InfoCard";
import { RevealDemo } from "@/components/styleguide/MotionDemo";
import { SgToc, type TocItem } from "@/components/styleguide/SgToc";
import { Code, SgSection, SgSub, Specimen, SpecRow, Swatch } from "@/components/styleguide/parts";
import { Button } from "@/components/ui/Button";
import { Badge, Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureList } from "@/components/ui/FeatureList";
import { ModelVisual } from "@/components/ui/ModelVisual";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpecGrid } from "@/components/ui/SpecGrid";
import { h1, h2, h3, h4, lead } from "@/components/ui/typography";
import type { IconName } from "@/data/model-details";
import { getModels } from "@/data/models";

export const metadata: Metadata = {
  title: "Дизайн систем",
  description: "Сайтын өнгө, үсэг, зай, компонент, хөдөлгөөний сан.",
  robots: { index: false },
};

const sections: TocItem[] = [
  { id: "principles", num: "01", label: "Зарчим" },
  { id: "brand", num: "02", label: "Брэнд" },
  { id: "color", num: "03", label: "Өнгө" },
  { id: "type", num: "04", label: "Үсэг" },
  { id: "space", num: "05", label: "Зай" },
  { id: "shape", num: "06", label: "Хэлбэр" },
  { id: "lines", num: "07", label: "Шугам" },
  { id: "shadow", num: "08", label: "Сүүдэр, бүрхүүл" },
  { id: "icons", num: "09", label: "Дүрс" },
  { id: "components", num: "10", label: "Компонент" },
  { id: "sections", num: "11", label: "Хэсгүүд" },
  { id: "motion", num: "12", label: "Хөдөлгөөн" },
];

/* ---------- Өнгө: globals.css-ээс build хийх үед шууд уншина ---------- */

const colorNotes: Record<string, string> = {
  ink: "Үндсэн бичвэр, гарчиг, бараан хэсэг, footer",
  muted: "Туслах бичвэр, eyebrow, lead",
  paper: "Хуудасны дэвсгэр",
  beige: "Cream гадаргуу: ээлжит хэсэг, карт, гүйлгэсэн header",
  line: "Hairline, хүрээ",
  taupe: "Үйлдлийн товч (btn--primary)",
  "taupe-hover": "Товчны hover",
  brown: "Гүн хүрэн (ModelVisual суурь)",
  "brown-muted": "Бүдэг хүрэн",
  "on-dark": "Бараан дээрх бичвэр",
  "on-dark-muted": "Бараан дээрх туслах бичвэр",
  shade: "Overlay-уудын суурь (--overlay-*)",
};

type ColorToken = { name: string; value: string };

async function readColorTokens(): Promise<ColorToken[]> {
  const css = await readFile(path.join(process.cwd(), "app", "globals.css"), "utf8");
  return [...css.matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => ({ name, value: value.trim() }));
}

function luminance(hex: string) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Цагаан цаастай харьцуулсан WCAG контраст. */
function contrastOnPaper(value: string): string | null {
  if (!/^#[0-9a-f]{6}$/i.test(value)) return null;
  return `${(1.05 / (luminance(value) + 0.05)).toFixed(1)}:1`;
}

const semantic = [
  { role: "Бичвэр, гарчиг", token: "ink" },
  { role: "Туслах бичвэр", token: "muted" },
  { role: "Хуудасны дэвсгэр", token: "paper" },
  { role: "Гадаргуу, hover", token: "beige" },
  { role: "Шугам", token: "line" },
  { role: "Үйлдэл (accent)", token: "taupe" },
  { role: "Үйлдлийн hover", token: "taupe-hover" },
  { role: "Footer", token: "ink" },
  { role: "Бараан дээрх бичвэр", token: "on-dark" },
];

/* ---------- Үсэг ---------- */

const families = [
  { name: "Sans", font: "Onest", cls: "font-sans", use: "Гарчиг h1–h4, товч, label, тоо, eyebrow." },
  { name: "Serif", font: "Literata", cls: "font-serif", use: "Тайлбар <p>, lead, онцлогийн жагсаалт." },
  { name: "Mono", font: "ui-monospace", cls: "font-mono", use: "Токен, код, дугаар." },
];

const sizeScale = [
  { token: "--text-2xs", cls: "text-2xs", px: "10px" },
  { token: "text-xs", cls: "text-xs", px: "12px" },
  { token: "text-sm", cls: "text-sm", px: "14px" },
  { token: "text-base", cls: "text-base", px: "16px" },
  { token: "--text-md", cls: "text-md", px: "20px" },
  { token: "text-2xl", cls: "text-2xl", px: "24px" },
  { token: "text-[32px]", cls: "text-[32px]", px: "32px" },
  { token: "text-[40px]", cls: "text-[40px]", px: "40px" },
  { token: "--text-h2", cls: "text-h2", px: "clamp(32px, 2.4vw + 14px, 48px)" },
];

const displayScale = [
  { token: "--text-display-1", cls: "text-display-1", px: "clamp(52px, 9vw, 136px)", use: "Одоогоор ашиглагдаагүй" },
  { token: "--text-display-2", cls: "text-display-2", px: "clamp(40px, 6vw, 88px)", use: "Нүүр, загварын hero (h1), тоон үзүүлэлт" },
  { token: "--text-display-3", cls: "text-display-3", px: "clamp(40px, 4vw + 8px, 64px)", use: "Загварын нэр, CTA (h2)" },
];

const lineHeights = [
  { token: "--leading-display", value: "1.05", use: "Display гарчиг", cls: "leading-display" },
  { token: "--leading-tight", value: "1.2", use: "Гарчиг, цэс", cls: "leading-tight" },
  { token: "--leading-snug", value: "1.3", use: "Картын гарчиг, eyebrow", cls: "leading-snug" },
  { token: "--leading-body", value: "1.5", use: "Бичвэр, тайлбар, lead", cls: "leading-body" },
];

const trackings = [
  { token: "--tracking-display", value: "-0.03em", use: "Display гарчиг", sample: "Ирээдүйн жолоодлого", cls: "tracking-display text-2xl font-semibold" },
  { token: "--tracking-tight", value: "-0.02em", use: "h1–h4, гарчиг", sample: "Ирээдүйн жолоодлого", cls: "tracking-tight text-2xl font-semibold" },
  { token: "--tracking-label", value: "0.08em", use: "Eyebrow", sample: "СПОРТ СЕДАН", cls: "tracking-label text-xs font-medium" },
  { token: "--tracking-tagline", value: "0.12em", use: "Badge, tagline", sample: "ШИНЭ", cls: "tracking-tagline text-2xs font-medium" },
];

/* ---------- Зай, хэлбэр ---------- */

const spacing = [
  { token: "--space-1", tw: "1", px: 4 },
  { token: "--space-2", tw: "2", px: 8 },
  { token: "--space-3", tw: "3", px: 12 },
  { token: "--space-4", tw: "4", px: 16 },
  { token: "--space-5", tw: "6", px: 24 },
  { token: "--space-6", tw: "8", px: 32 },
  { token: "--space-7", tw: "12", px: 48 },
  { token: "--space-8", tw: "16", px: 64 },
  { token: "--space-9", tw: "24", px: 96 },
  { token: "--space-10", tw: "36", px: 144 },
];

const layout = [
  { name: "--spacing-gutter", value: "clamp(16px, 6vw, 92px)", note: "Хуудасны хажуугийн зай · px-gutter" },
  { name: "--container-site", value: "1328px", note: "Агуулгын дээд өргөн · max-w-site" },
  { name: "--header-h", value: "72px", note: "Header-ийн өндөр, scroll-padding-top" },
  { name: "--spacing-section-top", value: "clamp(64px, 9.5vw, 144px)", note: "Хэсгийн дээд зай · pt-section-top" },
  { name: "--spacing-section-bottom", value: "clamp(48px, 6.4vw, 96px)", note: "Хэсгийн доод зай · pb-section-bottom" },
  { name: "--breakpoint-nav", value: "72rem · 1152px", note: "Дээд цэс бүтэн харагдах өргөн · nav:" },
];

const radii = [
  { token: "radius-sm", cls: "rounded-lg", value: "8px", note: "Input, жижиг карт, цэсний холбоос" },
  { token: "radius", cls: "rounded-xl", value: "12px", note: "Карт, хүснэгт, зураг" },
  { token: "radius-lg", cls: "rounded-3xl", value: "24px", note: "ModelVisual градиент карт" },
  { token: "radius-pill", cls: "rounded-full", value: "999px", note: "Товч, pill, tab, badge" },
  { token: "50%", cls: "rounded-full aspect-square", value: "50%", note: "Дугуй дүрс, ✓ тэмдэг" },
  { token: "0", cls: "rounded-none", value: "0", note: "Бүтэн өргөнтэй зураг, hero" },
];

const iconNames: IconName[] = ["thermometer", "phone", "paw", "shield"];
const socials = ["facebook", "instagram", "x", "linkedin", "youtube"];

/* ---------- Хэсгүүд ---------- */

const pageSections = [
  {
    group: "Нүүр хуудас",
    items: [
      { file: "home/Hero.tsx", text: "Бүтэн дэлгэцийн зураг, overlay градиент, display h1, хоёр товч, scroll индикатор.", href: "/#top" },
      { file: "home/ModelSection.tsx", text: "Загвар бүр: зурагтай бол хагас/хагас cream дэвсгэр, үгүй бол текст + ModelVisual.", href: "/#model-3" },
      { file: "home/CompareTable.tsx", text: "5 загварын харьцуулах хүснэгт, data/models.ts-ээс автоматаар.", href: "/#compare" },
      { file: "home/ChargingStats.tsx", text: "Бараан дэвсгэр, display хэмжээтэй тоонууд, нимгэн босоо шугам.", href: "/#charging" },
    ],
  },
  {
    group: "Загварын хуудас",
    items: [
      { file: "model/DetailHero.tsx", text: "Загварын hero: зураг, overlay, нэр, гол тоонууд.", href: "/models/model-3" },
      { file: "model/SubNav.tsx", text: "Наалддаг дотоод цэс, scroll-spy. Энэ хуудсанд ч ашигласан.", href: "/models/model-3#overview" },
      { file: "model/FeatureRow.tsx", text: "Зураг + тайлбарын ээлжит мөр.", href: "/models/model-3#interior" },
      { file: "model/SafetySection.tsx", text: "Бараан дэвсгэртэй аюулгүй байдлын хэсэг.", href: "/models/model-3#safety" },
      { file: "model/TrimTabs.tsx", text: "Pill таб, ← → товчоор солигдоно (WAI-ARIA).", href: "/models/model-3#trims" },
      { file: "model/SpecsTable.tsx", text: "Бүлэгтэй техникийн үзүүлэлтийн хүснэгт.", href: "/models/model-3#specs" },
      { file: "model/CtaBanner.tsx", text: "Зурган дэвсгэртэй төгсгөлийн уриалга, --overlay.", href: "/models/model-3" },
      { file: "model/ComingSoon.tsx", text: "Дэлгэрэнгүй контентгүй загварын товч хуудас.", href: "/models/model-y" },
    ],
  },
  {
    group: "Бүх хуудсанд",
    items: [
      { file: "layout/Navbar.tsx", text: "Hero дээр тунгалаг + scrim, 40px гүйлгэхэд cream. 1152px-ээс доош hamburger.", href: "/" },
      { file: "layout/Footer.tsx", text: "Бараан (ink) footer: хаяг, сошиал, холбоосууд, маягт.", href: "#contact" },
      { file: "layout/ContactForm.tsx", text: "Нэр, имэйл, мессеж; хөтөч болон сервер дээр шалгана.", href: "#contact" },
    ],
  },
];

/* ---------- Хөдөлгөөн ---------- */

type Motion = {
  name: string;
  slug: string;
  purpose: "Шилжилт" | "Reveal" | "Hover" | "Дарах хариу" | "Төлөв" | "Feedback";
  trigger: string;
  pages: string;
  where: string;
  spec: string;
  reduced: string;
  href?: string;
};

/** REBA шиг: Macro — хуудас, хэсгийн түвшин; Micro — нэг элементийн хариу үйлдэл. */
const motionGroups: { title: string; items: Motion[] }[] = [
  {
    title: "Macro · хуудас, хэсгийн түвшин: шилжилт, reveal, гүйлгэх",
    items: [
      { name: "Scroll Reveal", slug: "scroll-reveal", purpose: "Reveal", trigger: "Хэсэг дэлгэцэнд 10% орж ирэхэд (нэг удаа)", pages: "Нүүр, загвар", where: "ui/Reveal.tsx", spec: "transition duration-700 ease-out · motion-safe:in-[.js]:opacity-0 translate-y-4 → data-visible:opacity-100 translate-y-0", reduced: "motion-safe: тул нуухгүй, шууд харагдана", href: "/#compare" },
      { name: "Transparent → Solid Header", slug: "header-solidify", purpose: "Төлөв", trigger: "40px-ээс доош гүйлгэх", pages: "Бүх хуудас", where: "layout/Navbar.tsx", spec: "transition duration-400 ease-in-out · дэвсгэр, бичвэр, hairline", reduced: "Өнгө солигдоно (хөдөлгөөнгүй)", href: "/" },
      { name: "Smooth Scroll (Lenis)", slug: "smooth-anchor-scroll", purpose: "Шилжилт", trigger: "Хулганы дугуйгаар гүйлгэх, #холбоос дарах", pages: "Бүх хуудас", where: "layout/SmoothScroll.tsx", spec: "Lenis lerp 0.1 · anchors (scroll-padding-top тооцно) · touch-д хөтчийн өөрийнх", reduced: "Lenis асахгүй, хөтчийн энгийн гүйлгэлт" },
      { name: "Hero Parallax · Fade", slug: "hero-parallax", purpose: "Шилжилт", trigger: "Нүүрнээс доош гүйлгэх", pages: "Нүүр", where: "home/Hero.tsx · globals.css @utility", spec: "scroll-parallax: translateY(18%) scale(1.12) · scroll-fade-out: opacity → 0 · animation-timeline: view(), range exit", reduced: "Хөдлөхгүй", href: "/" },
      { name: "Clip Reveal", slug: "clip-reveal", purpose: "Reveal", trigger: "Загварын зураг дэлгэцэнд орж ирэх", pages: "Нүүр", where: "home/ModelSection.tsx · globals.css @utility", spec: "scroll-clip-reveal: clip-path inset(14% 10%) → inset(0), scale 1.12 → 1 · range entry 5% → cover 40%", reduced: "Шууд бүтэн харагдана", href: "/#model-3" },
      { name: "Word Reveal", slug: "word-reveal", purpose: "Reveal", trigger: "Нүүр ачаалах / загварын хэсэг харагдах", pages: "Нүүр", where: "ui/TextReveal.tsx", spec: "motion-safe:animate-word-up (translateY 110% → 0, 0.9s) · үг бүр +70–90ms · overflow-hidden маск", reduced: "Шууд харагдана", href: "/" },
      { name: "Text Scramble", slug: "text-scramble", purpose: "Reveal", trigger: "Гарчгийн 60% нь дэлгэцийн доод ирмэгээс 18% дээш орж ирэх (нэг удаа)", pages: "Бүх хуудасны h1/h2, eyebrow", where: "ui/ScrambleText.tsx · SectionHeading · ModelSection · DetailHero …", spec: "slow motion: долгион 420–950ms-д ease-in-out тархана, үсэг бүр 460–720ms солигдоно, нийт ≈1.1–1.7с · тэмдэгт 80ms тутам · eyebrow → гарчиг 300ms · ижил төрлийн кирилл (том→том, жижиг→жижиг, тоо→тоо) · 60% бүдэг · байршил хөдлөхгүй", reduced: "Шууд бүтэн харагдана", href: "/#compare" },
      { name: "Count Up", slug: "count-up", purpose: "Feedback", trigger: "Тоо дэлгэцэнд орж ирэх", pages: "Нүүр (hero, цэнэглэлт)", where: "ui/CountUp.tsx", spec: "0 → утга · 1.6–2s easeOutExpo · requestAnimationFrame", reduced: "Эцсийн утга шууд" },
      { name: "Status Pop-in", slug: "status-pop", purpose: "Feedback", trigger: "Төлбөрийн үр дүнгийн хуудас нээгдэх", pages: "/order/success, /order/cancel", where: "order/OrderResult.tsx", spec: "transition duration-500 ease-out · starting:scale-50 starting:opacity-0", reduced: "Зөвхөн бүдэгрэлт (scale-гүй)" },
      { name: "Pending Pulse · Spinner", slug: "pending-pulse", purpose: "Feedback", trigger: "Төлбөр хүлээгдэж буй, товч дарсан", pages: "Захиалга", where: "order/OrderResult.tsx · OrderSteps.tsx", spec: "motion-safe:animate-pulse · animate-spin", reduced: "Лугшихгүй; spinner эргэсээр (төлөв харуулна)" },
      { name: "Scroll Dot", slug: "scroll-dot", purpose: "Төлөв", trigger: "Нүүр хуудас ачаалахад", pages: "Нүүр", where: "home/Hero.tsx", spec: "opacity 1 → 0, translateY(0 → 14px) · 1.8s infinite", reduced: "Нэг удаа тоглоод зогсоно", href: "/" },
    ],
  },
  {
    title: "Micro · нэг элементийн хариу үйлдэл: hover, дарах, төлөв",
    items: [
      { name: "Press Feedback", slug: "press-feedback", purpose: "Дарах хариу", trigger: "Товч дээр hover, дарах", pages: "Бүх хуудас", where: "ui/Button.tsx", spec: "transition duration-200 ease-in-out · active:translate-y-px", reduced: "Өнгө солигдоно" },
      { name: "Arrow Nudge", slug: "arrow-nudge", purpose: "Hover", trigger: "«Дэлгэрэнгүй →» дээр hover", pages: "Нүүр", where: "ui/Button.tsx (link)", spec: "transition-transform duration-200 · motion-safe:group-hover:translate-x-1", reduced: "Сум хөдлөхгүй", href: "/#model-3" },
      { name: "Magnetic Button", slug: "magnetic", purpose: "Hover", trigger: "Хулгана товчны 12px орчимд ойртох", pages: "Нүүр (hero 2 товч), бүх «Захиалах», «₮ төлөх»", where: "ui/Magnetic.tsx", spec: "translate = хулганы зай × 0.3, max 8px (төлөх товч 6px) · дагах 150ms, буцах 600ms ease-out", reduced: "Хөдлөхгүй; утас, таблетад идэвхгүй", href: "/" },
      { name: "Morphing Tabs (Сунах pill)", slug: "morphing-tabs", purpose: "Төлөв", trigger: "Хувилбарын tab сонгох (хулгана, ← →)", pages: "Загварын хуудас · Хувилбарууд", where: "model/TrimTabs.tsx", spec: "pill left/right 420ms, урагшлах тал түрүүлж ард тал 90ms хоцорно · зураг opacity+scale+blur 700ms · үнэ тоологдох 700ms · мөрүүд starting: + delay 0/70/140/210", reduced: "Pill шууд шилжинэ, зураг бүдгэрэлтгүй", href: "/models/model-3#trims" },
      { name: "Shared Indicator (цэсний зураас + hover сүүдэр)", slug: "subnav-indicator", purpose: "Төлөв", trigger: "Хуудас гүйлгэх / цэс дээгүүр хулгана", pages: "Загварын хуудас", where: "model/SubNav.tsx", spec: "Нэг зураас цэс хооронд сунаж шилжинэ (100ms хоцрол) · beige сүүдэр 300ms гулсана, эхний удаа байрандаа гарна", reduced: "Шууд шилжинэ", href: "/models/model-3#overview" },
      { name: "3D Tilt", slug: "tilt", purpose: "Hover", trigger: "Нүүр хуудасны загварын зураг дээр хулгана", pages: "Нүүр", where: "ui/Tilt.tsx · home/ModelSection.tsx", spec: "perspective-distant (1200px) · rotate-x/y max 5° · дагах 150ms, буцах 700ms · TiltGlare тусгал · shadow-2xl · наалт translate-z-12 (48px)", reduced: "Хазайхгүй; утсанд идэвхгүй", href: "/#model-yl" },
      { name: "Spotlight (хүрээ + туяа)", slug: "spotlight", purpose: "Hover", trigger: "Хулгана картын бүлэг дээгүүр хөдлөх", pages: "Харьцуулах хүснэгт, загварын InfoCard/IconCard, захиалгын хуудас", where: "ui/SpotlightGroup.tsx · globals.css @utility spotlight", spec: "::before taupe туяа 360px (--spot-glow, --spot-size) · ::after 1.5px ink хүрээ mask-composite: exclude · opacity 0.35s · бүлэг нэг гэрэл хуваалцана", reduced: "Хулганатай төхөөрөмжид л; утсанд харагдахгүй", href: "/#compare" },
      { name: "Image Zoom · Card Lift", slug: "image-zoom", purpose: "Hover", trigger: "Загварын зураг, картан дээр hover", pages: "Нүүр, загвар", where: "home/ModelSection.tsx · model/InfoCard.tsx", spec: "duration-1000 motion-safe:group-hover:scale-103 · motion-safe:hover:-translate-y-1 hover:shadow-xl", reduced: "Зөвхөн сүүдэр", href: "/#model-3" },
      { name: "Hamburger → X", slug: "hamburger-morph", purpose: "Төлөв", trigger: "Утасны цэс нээх, хаах (<1152px)", pages: "Бүх хуудас", where: "layout/Navbar.tsx", spec: "translate + rotate(±45°) · 0.2s", reduced: "Шууд" },
      { name: "Tap Dim", slug: "tap-dim", purpose: "Дарах хариу", trigger: "Цэсний холбоос товших", pages: "Бүх хуудас", where: "layout/Navbar.tsx", spec: ":active opacity 0.6", reduced: "Шууд" },
      { name: "Scrollspy Tabs", slug: "scrollspy-tabs", purpose: "Төлөв", trigger: "Хуудас гүйлгэх", pages: "Загвар, styleguide", where: "model/SubNav.tsx · styleguide/SgToc.tsx", spec: "идэвхтэй таб өнгө, зураас · 0.2s", reduced: "Өнгө шууд солигдоно", href: "/models/model-3#overview" },
      { name: "Link Color Hover", slug: "link-hover", purpose: "Hover", trigger: "Холбоос, хүснэгтийн мөр дээр hover", pages: "Бүх хуудас", where: "Footer, CompareTable, SpecsTable", spec: "color, background-color · 0.2s", reduced: "Шууд", href: "/#compare" },
    ],
  },
];

/** Tailwind-ийн үндсэн easing — өөрийн cubic-bezier токен байхгүй */
const easings = [
  { token: "ease-out", value: "cubic-bezier(0, 0, .2, 1)", use: "Reveal, зургийн zoom, карт, сум — гарч ирэх, хариулах" },
  { token: "ease-in-out", value: "cubic-bezier(.4, 0, .2, 1)", use: "Товч, header — төлөв солигдох" },
  { token: "ease-linear", value: "linear", use: "animate-spin (spinner)" },
];

/** Tailwind duration-* (мс) — тоо нь шууд хугацаа */
const durations = [
  { token: "duration-200", value: "200ms", use: "Товч, холбоос, таб, маягтын талбар — micro" },
  { token: "duration-300", value: "300ms", use: "Карт өргөгдөх, харьцуулах сум, алхмын тойрог" },
  { token: "duration-400", value: "400ms", use: "Transparent → Solid Header" },
  { token: "duration-500", value: "500ms", use: "Status Pop-in (starting:)" },
  { token: "duration-700", value: "700ms", use: "Scroll Reveal, картын зураг zoom" },
  { token: "duration-1000", value: "1000ms", use: "Загварын том зургийн удаан zoom" },
];

export default async function StyleguidePage() {
  const colors = await readColorTokens();
  const colorValue = Object.fromEntries(colors.map((c) => [c.name, c.value]));
  const [sample] = await getModels();

  return (
    <>
      <header className="bg-ink px-gutter pb-section-bottom pt-[168px] text-on-dark">
        <div className="mx-auto flex max-w-site flex-col gap-5">
          <Eyebrow tone="on-dark">Styleguide</Eyebrow>
          <h1 className={h1}>Дизайн систем</h1>
          <p className="max-w-[640px] text-on-dark-muted">
            Сайтын токен, үсэг, компонент, хөдөлгөөний сан. Өнгөний утгуудыг{" "}
            <Code className="bg-white/10 text-on-dark">app/globals.css</Code>-ээс build хийх үед шууд уншдаг тул тэнд
            өөрчлөхөд энэ хуудас автоматаар шинэчлэгдэнэ. Доорх компонентууд нь сайт дээрх бодит компонентууд.
          </p>
        </div>
      </header>

      <div className="px-gutter">
        <div className="mx-auto grid max-w-site gap-x-16 pb-section-bottom lg:grid-cols-[200px_minmax(0,1fr)] lg:pt-section-top">
          <SgToc items={sections} />
          <div className="min-w-0 pt-12 lg:pt-0">

      {/* 01 */}
      <SgSection id="principles" num="01" title="Зарчим">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Нэг дулаан өнгөний гэр бүл", "Цагаан цаас, бараан бэх, cream гадаргуу, үйлдэлд taupe. Түүхий hex биш --color-* токен."],
            ["Sans гарчиг, serif тайлбар", "Гарчиг, товч, тоо нь Onest; тайлбар, lead, <p> нь Literata."],
            ["8pt хэмнэл", "Бүх зай --space-* шатлалаас (4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144)."],
            ["Тайван хөдөлгөөн", "Tailwind ease-out / ease-in-out; motion-safe: тул «хөдөлгөөн багасгах» үед хөдлөхгүй."],
          ].map(([title, text]) => (
            <div key={title} className="flex flex-col gap-2 border-t border-ink pt-5">
              <h3 className="text-md">{title}</h3>
              <p className="text-muted">{text}</p>
            </div>
          ))}
        </div>
      </SgSection>

      {/* 02 */}
      <SgSection id="brand" num="02" title="Брэнд">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <Specimen label={<>Цаасан дээр · <Code>text-ink</Code></>} className="justify-center">
            <span className="-mr-[0.42em] text-[28px] font-bold leading-none tracking-[0.42em] text-ink">TESLA</span>
          </Specimen>
          <Specimen label={<>Cream дээр · <Code>bg-beige</Code></>} className="justify-center border-transparent bg-beige!">
            <span className="-mr-[0.42em] text-[28px] font-bold leading-none tracking-[0.42em] text-ink">TESLA</span>
          </Specimen>
          <Specimen dark label={<>Бараан дээр · <Code>text-on-dark</Code></>} className="justify-center">
            <span className="-mr-[0.42em] text-[28px] font-bold leading-none tracking-[0.42em]">TESLA</span>
          </Specimen>
          <Specimen label={<>Зураг дээр · <Code>--overlay</Code></>} className="relative justify-center overflow-hidden border-transparent">
            <Image src="/images/hero.png" alt="" fill sizes="400px" className="object-cover" />
            <span className="absolute inset-0 bg-[var(--overlay)]" />
            <span className="relative -mr-[0.42em] text-[28px] font-bold leading-none tracking-[0.42em] text-on-dark">TESLA</span>
          </Specimen>
        </div>
        <p className="text-muted">
          <Code>components/layout/Logo.tsx</Code> — текст wordmark, өнгөө эцэг элементээс (<Code>currentColor</Code>) авна. Header: 22px,
          footer: 20px.
        </p>
      </SgSection>

      {/* 03 */}
      <SgSection
        id="color"
        num="03"
        title="Өнгө"
        intro={
          <>
            Бүх өнгө <Code>@theme</Code> блокт. Tailwind-д <Code>bg-beige</Code>, <Code>text-muted</Code>, <Code>border-line</Code> гэх мэтээр
            ашиглана. Контраст нь цагаан цаастай харьцуулсан.
          </>
        }
      >
        <SgSub title="Үндсэн токен · globals.css">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map((c) => {
              const ratio = contrastOnPaper(c.value);
              return (
                <li key={c.name} className="overflow-hidden rounded-xl border border-line">
                  <div className="h-24 border-b border-line" style={{ background: `var(--color-${c.name})` }} />
                  <div className="flex flex-col gap-1 p-4 font-sans text-sm">
                    <Code className="self-start">--color-{c.name}</Code>
                    <span className="font-mono text-xs text-muted">
                      {c.value}
                      {ratio && ` · ${ratio}`}
                    </span>
                    {colorNotes[c.name] && <span className="text-muted">{colorNotes[c.name]}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </SgSub>

        <SgSub title="Семантик хэрэглээ" note="Компонентууд өнгийг үүргээр нь сонгоно.">
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[480px] font-sans text-sm">
              <thead>
                <tr className="border-b border-line bg-beige text-left">
                  <th className="px-4 py-3 font-medium">Үүрэг</th>
                  <th className="px-4 py-3 font-medium">Токен</th>
                  <th className="px-4 py-3 font-medium">Утга</th>
                </tr>
              </thead>
              <tbody>
                {semantic.map((s) => (
                  <tr key={s.role} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3">{s.role}</td>
                    <td className="px-4 py-3">
                      <Code>--color-{s.token}</Code>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      <Swatch color={`var(--color-${s.token})`} className="mr-2" />
                      {colorValue[s.token]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SgSub>

        <SgSub title="ModelVisual-ийн сэдэв" note={<>Зураггүй загварын картууд: ink, brown суурь дээр taupe, beige, brown-muted туяа.</>}>
          <div className="grid gap-6 sm:grid-cols-3">
            {(["blue", "slate", "red"] as const).map((theme) => (
              <div key={theme} className="flex flex-col gap-2">
                <ModelVisual name="Aa" tag={theme} theme={theme} />
                <Code className="self-start">theme: &quot;{theme}&quot;</Code>
              </div>
            ))}
          </div>
        </SgSub>
      </SgSection>

      {/* 04 */}
      <SgSection id="type" num="04" title="Үсэг">
        <SgSub title="Үсгийн гэр бүл" note="Onest, Literata хоёулаа cyrillic-ext багцтай тул монгол Ө, Ү зөв харагдана.">
          <div className="grid gap-6 md:grid-cols-3">
            {families.map((f) => (
              <div key={f.name} className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-6">
                <span className={`${f.cls} text-[40px] leading-tight`}>Аа Өө Үү 0123</span>
                <span className="font-sans text-sm">
                  <strong>
                    {f.name} · {f.font}
                  </strong>{" "}
                  — {f.use} <Code>{f.cls}</Code>
                </span>
              </div>
            ))}
          </div>
        </SgSub>

        <SgSub title="Хэмжээний шатлал · 1.25">
          <ul className="border-t border-line">
            {sizeScale.map((s) => (
              <SpecRow key={s.token} name={<Code>{s.token}</Code>} value={s.px}>
                <p className={`${s.cls} font-sans leading-tight`}>Ирээдүйн жолоодлого, цахилгаан машин</p>
              </SpecRow>
            ))}
          </ul>
        </SgSub>

        <SgSub title="Display · уян хатан">
          <ul className="border-t border-line">
            {displayScale.map((s) => (
              <SpecRow key={s.token} name={<Code>{s.token}</Code>} value={s.px} note={s.use}>
                <p className={`${s.cls} font-sans font-semibold leading-display tracking-display`}>Tesla</p>
              </SpecRow>
            ))}
          </ul>
        </SgSub>

        <SgSub title="Мөрийн өндөр">
          <ul className="border-t border-line">
            {lineHeights.map((l) => (
              <SpecRow key={l.token} name={<Code>{l.token}</Code>} value={l.value} note={l.use}>
                <p className={`${l.cls} max-w-[480px]`}>
                  Өдөр тутмын хэрэглээ болон холын аялалд тохирсон, ашиглалтын зардал бага, энгийн цэвэрхэн дизайнтай автомашин.
                </p>
              </SpecRow>
            ))}
          </ul>
        </SgSub>

        <SgSub title="Үсэг хоорондын зай">
          <ul className="border-t border-line">
            {trackings.map((t) => (
              <SpecRow key={t.token} name={<Code>{t.token}</Code>} value={t.value} note={t.use}>
                <span className={`${t.cls} font-sans`}>{t.sample}</span>
              </SpecRow>
            ))}
          </ul>
        </SgSub>

        <SgSub title="Бичвэрийн хэв маяг" note={<Code>components/ui/typography.ts</Code>}>
          <ul className="border-t border-line">
            <SpecRow name={<Code>Eyebrow</Code>} value="Onest 500 · 12px/1.3 · 0.08em · muted">
              <Eyebrow>Спорт седан</Eyebrow>
            </SpecRow>
            <SpecRow name={<Code>h1</Code>} value="Onest 600 · display-2 · 1.05 · -0.03em">
              <p className={`${h1} font-sans`}>Ирээдүйн жолоодлого</p>
            </SpecRow>
            <SpecRow name={<Code>h2</Code>} value="Onest 600 · display-3 · 1.05 · -0.03em">
              <p className={`${h2} font-sans`}>Model 3</p>
            </SpecRow>
            <SpecRow name={<Code>h3</Code>} value="Onest 600 · --text-h2 · 1.2 · -0.02em">
              <p className={`${h3} font-sans`}>Энгийн, цэвэрхэн дизайн</p>
            </SpecRow>
            <SpecRow name={<Code>h4</Code>} value="Onest 600 · 24px · 1.2 · -0.02em">
              <p className={`${h4} font-sans`}>Салоны тав тух</p>
            </SpecRow>
            <SpecRow name={<Code>lead</Code>} value="Literata 400 · 16px/1.5 · muted · max 564px">
              <p className={lead}>Tesla-ийн хамгийн хямд үнэтэй загвар. Энгийн, цэвэрхэн дизайнтай, ашиглалтын зардал бага.</p>
            </SpecRow>
            <SpecRow name={<Code>p</Code>} value="Literata 400 · 16px/1.5">
              <p>Өдөр тутмын хэрэглээ болон холын аялалд тохирсон гэр бүлийн автомашин.</p>
            </SpecRow>
            <SpecRow name={<Code>Badge</Code>} value="Onest 500 · 10px · 0.12em">
              <Badge>Шинэ</Badge>
            </SpecRow>
          </ul>
        </SgSub>
      </SgSection>

      {/* 05 */}
      <SgSection id="space" num="05" title="Зай" intro="REBA-гийн 8pt шатлал Tailwind-ийн 4px шатлалтай давхцана: --space-5 = 6 (24px) гэх мэт.">
        <SgSub title="8pt шатлал">
          <ul className="border-t border-line">
            {spacing.map((s) => (
              <SpecRow key={s.token} name={<Code>{s.token}</Code>} value={`${s.px}px · Tailwind ${s.tw}`}>
                <div className="h-4 rounded-sm bg-taupe" style={{ width: s.px }} />
              </SpecRow>
            ))}
          </ul>
        </SgSub>
        <SgSub title="Байршил">
          <ul className="border-t border-line">
            {layout.map((l) => (
              <SpecRow key={l.name} name={<Code>{l.name}</Code>} value={l.value} note={l.note} />
            ))}
          </ul>
        </SgSub>
      </SgSection>

      {/* 06 */}
      <SgSection id="shape" num="06" title="Хэлбэр">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {radii.map((r) => (
            <li key={r.token} className="flex flex-col gap-3">
              <div className={`aspect-square border border-ink bg-paper ${r.cls}`} />
              <div className="flex flex-col gap-1 font-sans text-sm">
                <Code className="self-start">{r.token}</Code>
                <span className="font-mono text-xs text-muted">
                  {r.value} · {r.cls.split(" ")[0]}
                </span>
                <span className="text-muted">{r.note}</span>
              </div>
            </li>
          ))}
        </ul>
      </SgSection>

      {/* 07 */}
      <SgSection id="lines" num="07" title="Шугам">
        <ul className="grid gap-6 font-sans sm:grid-cols-2 lg:grid-cols-3">
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-xl bg-beige">
              <div className="w-3/4 border-t border-line" />
            </div>
            <span className="text-sm">
              <strong>Hairline</strong> · 1px <Code>--color-line</Code> · header, хүснэгт, хүрээ
            </span>
          </li>
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-xl bg-beige">
              <span className="rounded-full px-5 py-2 text-sm shadow-[inset_0_0_0_1px_var(--color-ink)]">Outline</span>
            </div>
            <span className="text-sm">
              <strong>Outline</strong> · inset 1px <Code>ink</Code> · secondary товч
            </span>
          </li>
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-xl bg-ink">
              <span className="rounded-full px-5 py-2 text-sm text-on-dark shadow-[inset_0_0_0_1px_rgb(255_255_255/0.6)]">Ghost</span>
            </div>
            <span className="text-sm">
              <strong>Ghost</strong> · inset 1px white 60% · бараан, зураг дээр
            </span>
          </li>
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-xl bg-beige">
              <span className="rounded-full bg-paper px-5 py-2 text-sm outline-2 outline-offset-[3px] outline-ink [outline-style:solid]">Focus</span>
            </div>
            <span className="text-sm">
              <strong>Focus ring</strong> · 2px currentColor, offset 3px · <Code>:focus-visible</Code>
            </span>
          </li>
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-xl bg-beige">
              <span className="border-b-2 border-ink px-3 py-2 text-sm font-medium">Идэвхтэй таб</span>
            </div>
            <span className="text-sm">
              <strong>Active underline</strong> · 2px · SubNav, дээд цэс
            </span>
          </li>
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-xl bg-beige text-ink">
              <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-sm">
              <strong>Icon stroke</strong> · 2px, round cap · ✓ тэмдэг 3px
            </span>
          </li>
        </ul>
      </SgSection>

      {/* 08 */}
      <SgSection id="shadow" num="08" title="Сүүдэр, бүрхүүл" intro={<>Overlay-ууд <Code>--color-shade</Code> дээр суурилна. Drop shadow бараг хэрэглэдэггүй — шугам, гадаргуугаар ялгана.</>}>
        <SgSub title="Overlay токен">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "--overlay-soft", pct: "32%", use: "Hero-ийн дунд хэсэг" },
              { name: "--overlay", pct: "50%", use: "Зураг дээрх бичвэр, CTA" },
              { name: "--overlay-strong", pct: "80%", use: "Hero-ийн хамгийн доод хэсэг" },
            ].map((o) => (
              <figure key={o.name} className="flex flex-col gap-3">
                <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl">
                  <Image src="/images/hero.png" alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  <div className="absolute inset-0" style={{ background: `var(${o.name})` }} />
                  <span className="relative font-sans text-2xl font-semibold text-on-dark">Aa</span>
                </div>
                <figcaption className="font-sans text-sm">
                  <Code>{o.name}</Code> <span className="text-muted">· shade {o.pct} · {o.use}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </SgSub>
        <SgSub title="Scrim">
          <ul className="grid gap-6 font-sans sm:grid-cols-2">
            <li className="flex flex-col gap-3">
              <div className="relative h-28 overflow-hidden rounded-xl">
                <Image src="/images/hero.png" alt="" fill sizes="50vw" className="object-cover" />
                <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgb(25_20_14/0.35),transparent)]" />
                <span className="absolute left-4 top-4 text-sm font-bold tracking-[0.42em] text-on-dark">TESLA</span>
              </div>
              <span className="text-sm">
                <strong>Header scrim</strong> · ink 35% → transparent · тунгалаг header
              </span>
            </li>
            <li className="flex flex-col gap-3">
              <div className="grid h-28 place-items-center rounded-xl bg-beige shadow-[0_1px_0_var(--color-line)]">
                <span className="text-sm font-medium">Solid header</span>
              </div>
              <span className="text-sm">
                <strong>Header hairline</strong> · 0 1px 0 line · гүйлгэсэн header
              </span>
            </li>
          </ul>
        </SgSub>
      </SgSection>

      {/* 09 */}
      <SgSection id="icons" num="09" title="Дүрс" intro={<>Inline SVG, <Code>stroke=&quot;currentColor&quot;</Code>, 24×24 viewBox. Сошиал дүрс нь <Code>public/images/*.svg</Code>.</>}>
        <ul className="grid grid-cols-2 gap-4 font-sans sm:grid-cols-4 lg:grid-cols-6">
          {iconNames.map((name) => (
            <li key={name} className="flex flex-col items-center gap-3 rounded-xl border border-line p-5 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-beige text-ink" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  {icons[name]}
                </svg>
              </span>
              <Code>{name}</Code>
            </li>
          ))}
          <li className="flex flex-col items-center gap-3 rounded-xl border border-line p-5 text-center">
            <span className="grid size-12 place-items-center" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-[18px] rounded-full bg-beige p-[4px] text-ink" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <Code>check</Code>
          </li>
          <li className="flex flex-col items-center gap-3 rounded-xl border border-line p-5 text-center">
            <span className="grid size-12 place-items-center text-2xl">→</span>
            <Code>arrow</Code>
          </li>
          {socials.map((s) => (
            <li key={s} className="flex flex-col items-center gap-3 rounded-xl border border-line p-5 text-center">
              <span className="grid size-12 place-items-center">
                <Image src={`/images/${s}.svg`} alt="" width={24} height={24} unoptimized />
              </span>
              <Code>{s}</Code>
            </li>
          ))}
        </ul>
      </SgSection>

      {/* 10 */}
      <SgSection id="components" num="10" title="Компонент">
        <SgSub title="Button" note={<><Code>components/ui/Button.tsx</Code> — pill, Onest 500, 0.2s өнгө, дарахад 1px доош.</>}>
          <div className="grid gap-6 md:grid-cols-2">
            <Specimen label={<><Code>primary</Code> taupe · <Code>secondary</Code> outline · <Code>link</Code> — цайвар дээр</>}>
              <Button href="#components">Захиалах</Button>
              <Button href="#components" variant="secondary">
                Харьцуулалт
              </Button>
              <Button href="#components" variant="link" arrow>
                Дэлгэрэнгүй
              </Button>
            </Specimen>
            <Specimen dark label={<><Code>outline-light</Code> light · <Code>glass</Code> ghost — бараан, зураг дээр</>}>
              <Button href="#components" variant="outline-light">
                Захиалах
              </Button>
              <Button href="#components" variant="glass">
                Харьцуулах
              </Button>
              <Button href="#components">Taupe</Button>
            </Specimen>
          </div>
          <Specimen label={<>Хэмжээ: <Code>md</Code> 46px · <Code>sm</Code> 40px</>}>
            <Button href="#components">Medium</Button>
            <Button href="#components" size="sm">
              Small
            </Button>
          </Specimen>
        </SgSub>

        <SgSub title="Eyebrow, Badge" note={<Code>components/ui/Eyebrow.tsx</Code>}>
          <div className="grid gap-6 md:grid-cols-2">
            <Specimen label={<><Code>tone=&quot;default&quot;</Code> · <Code>badge</Code></>}>
              <Eyebrow>Спорт седан</Eyebrow>
              <Eyebrow badge="Шинэ">Гэр бүлийн SUV</Eyebrow>
              <Badge>Шинэ</Badge>
            </Specimen>
            <Specimen dark label={<><Code>tone=&quot;on-dark&quot;</Code> · <Code>tone=&quot;light&quot;</Code></>}>
              <Eyebrow tone="on-dark">Цэнэглэлт</Eyebrow>
              <Eyebrow tone="light">Цахилгаан автомашин</Eyebrow>
            </Specimen>
          </div>
        </SgSub>

        <SgSub title="SectionHeading" note={<Code>components/ui/SectionHeading.tsx</Code>}>
          <div className="grid gap-6 md:grid-cols-2">
            <Specimen block label={<Code>tone=&quot;light-bg&quot;</Code>} className="[&>div]:mb-0">
              <SectionHeading eyebrow="Танилцуулга" title="Энгийн, цэвэрхэн дизайн" lead="Хэсгийн гарчиг, serif тайлбар." />
            </Specimen>
            <Specimen block dark label={<Code>tone=&quot;dark-bg&quot;</Code>} className="[&>div]:mb-0">
              <SectionHeading tone="dark-bg" eyebrow="Цэнэглэлт" title="Хаана ч цэнэглэнэ" lead="Бараан дэвсгэр дээр." />
            </Specimen>
          </div>
        </SgSub>

        <SgSub title="FeatureList, SpecGrid" note={<>Загварын хэсгийн онцлог, 4 гол үзүүлэлт. Жишээ: {sample.name}</>}>
          <div className="grid gap-6 md:grid-cols-2">
            <Specimen block label={<Code>FeatureList</Code>}>
              <FeatureList items={sample.features} />
            </Specimen>
            <Specimen block label={<Code>SpecGrid</Code>}>
              <SpecGrid specs={sample.specs} />
            </Specimen>
          </div>
        </SgSub>

        <SgSub title="Карт" note={<><Code>model/InfoCard.tsx</Code> · <Code>model/IconCard.tsx</Code> · <Code>ui/ModelVisual.tsx</Code></>}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard image={{ src: "/images/model-y.png", alt: "Model Y" }} title="InfoCard" text="Зураг, гарчиг, тайлбартай карт. Танилцуулга хэсэгт." />
            <div className="rounded-xl bg-paper">
              <IconCard icon="phone" title="IconCard" text="Дүрстэй жижиг карт. Апп, аюулгүй байдлын хэсэгт." />
            </div>
            <ModelVisual name="Model 3" tag="Седан" theme="blue" />
          </div>
        </SgSub>
      </SgSection>

      {/* 11 */}
      <SgSection id="sections" num="11" title="Хэсгүүд (sections)" intro={<>Хуудас бүрийн хэсэг <Code>components/</Code> дотор. Холбоосоор бодит хуудсан дээр нь харна.</>}>
        {pageSections.map((group) => (
          <SgSub key={group.group} title={group.group}>
            <ul className="border-t border-line">
              {group.items.map((item) => (
                <SpecRow key={item.file} name={<Code>{item.file}</Code>}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <p className="text-muted">{item.text}</p>
                    <Link href={item.href} className="shrink-0 font-sans text-sm font-medium underline-offset-4 hover:underline">
                      Хуудсан дээр харах ↗
                    </Link>
                  </div>
                </SpecRow>
              ))}
            </ul>
          </SgSub>
        ))}
      </SgSection>

      {/* 12 */}
      <SgSection
        id="motion"
        num="12"
        title="Хөдөлгөөн"
       
        intro={<>Бүх хөдөлгөөн Tailwind класс: <Code>transition</Code> <Code>duration-*</Code> <Code>ease-*</Code> <Code>delay-*</Code> <Code>animate-*</Code> <Code>starting:</Code>. Байрлал, хэмжээ өөрчлөх хөдөлгөөн бүр <Code>motion-safe:</Code> — «хөдөлгөөн багасгах» тохиргоотой үед зөвхөн өнгө солигдоно.</>}
      >
        {motionGroups.map((group) => (
          <SgSub key={group.title} title={group.title}>
            <ul className="border-t border-line">
              {group.items.map((m) => (
                <li key={m.slug} id={m.slug} className="flex flex-col gap-3 border-b border-line py-5 font-sans text-sm">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <strong className="text-base">{m.name}</strong>
                    <Code>{m.slug}</Code>
                    <span className="rounded-full bg-beige px-2.5 py-0.5 text-xs">{m.purpose}</span>
                  </div>
                  <dl className="grid gap-x-6 gap-y-1.5 text-muted sm:grid-cols-[110px_minmax(0,1fr)]">
                    <dt className="text-ink">Үүсгэгч</dt>
                    <dd>{m.trigger}</dd>
                    <dt className="text-ink">Хуудас</dt>
                    <dd>{m.pages}</dd>
                    <dt className="text-ink">Хаана</dt>
                    <dd>
                      <Code>{m.where}</Code>
                    </dd>
                    <dt className="text-ink">Тохиргоо</dt>
                    <dd className="font-mono text-xs">{m.spec}</dd>
                    <dt className="text-ink">Reduced</dt>
                    <dd>{m.reduced}</dd>
                  </dl>
                  {m.href && (
                    <Link href={m.href} className="self-start font-medium text-ink underline-offset-4 hover:underline">
                      Хуудсан дээр харах ↗
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </SgSub>
        ))}

        <div className="grid gap-10 md:grid-cols-2">
          <SgSub title="Easing">
            <ul className="border-t border-line">
              {easings.map((e) => (
                <SpecRow key={e.token} name={<Code>{e.token}</Code>} value={e.value} note={e.use} />
              ))}
            </ul>
          </SgSub>
          <SgSub title="Duration">
            <ul className="border-t border-line">
              {durations.map((d) => (
                <SpecRow key={d.token} name={<Code>{d.token}</Code>} value={d.value} note={d.use} />
              ))}
            </ul>
          </SgSub>
        </div>

        <SgSub title="Тоглуулж үзэх">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <RevealDemo />
              <span className="font-sans text-sm text-muted">
                <strong className="text-ink">Staggered Scroll Reveal</strong> · translate-y-4 → 0 · duration-700 ease-out · delay-0 / delay-90 / delay-180
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex min-h-[120px] flex-wrap items-center justify-center gap-6 rounded-xl border border-line bg-paper p-6">
                <Button href="#motion">Дараад үз</Button>
                <Button href="#motion" variant="link" arrow>
                  Hover
                </Button>
                <span className="relative h-[42px] w-[26px] rounded-[14px] border-2 border-ink/60" aria-hidden="true">
                  <span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 animate-scroll-dot rounded-sm bg-ink" />
                </span>
              </div>
              <span className="font-sans text-sm text-muted">
                <strong className="text-ink">Press Feedback · Arrow Nudge · Scroll Dot</strong>
              </span>
            </div>
          </div>
        </SgSub>
      </SgSection>
          </div>
        </div>
      </div>
    </>
  );
}
