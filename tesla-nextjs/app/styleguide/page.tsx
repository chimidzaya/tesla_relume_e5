import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconCard, icons } from "@/components/model/IconCard";
import { InfoCard } from "@/components/model/InfoCard";
import { SubNav, type SubNavItem } from "@/components/model/SubNav";
import { RevealDemo } from "@/components/styleguide/MotionDemo";
import { Code, SgSection, SgSub, Specimen, SpecRow } from "@/components/styleguide/parts";
import { Button } from "@/components/ui/Button";
import { Badge, Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureList } from "@/components/ui/FeatureList";
import { ModelVisual } from "@/components/ui/ModelVisual";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpecGrid } from "@/components/ui/SpecGrid";
import { h1, h2, h3, h4 } from "@/components/ui/typography";
import type { IconName } from "@/data/model-details";
import { models } from "@/data/models";

export const metadata: Metadata = {
  title: "Дизайн систем",
  description: "Сайтын өнгө, үсэг, зай, компонент, хөдөлгөөний сан.",
  robots: { index: false },
};

const sections: SubNavItem[] = [
  { id: "principles", label: "01 Зарчим" },
  { id: "brand", label: "02 Брэнд" },
  { id: "color", label: "03 Өнгө" },
  { id: "type", label: "04 Үсэг" },
  { id: "space", label: "05 Зай" },
  { id: "shape", label: "06 Хэлбэр" },
  { id: "lines", label: "07 Шугам" },
  { id: "shadow", label: "08 Сүүдэр" },
  { id: "icons", label: "09 Дүрс" },
  { id: "components", label: "10 Компонент" },
  { id: "sections", label: "11 Хэсгүүд" },
  { id: "motion", label: "12 Хөдөлгөөн" },
];

/* ---------- Өнгө: globals.css-ээс шууд уншина ---------- */

const colorNotes: Record<string, string> = {
  royal: "Гол өнгө: холбоос hover, идэвхтэй цэс, шошго, ✓ тэмдэг, дүрсний дэвсгэр, focus ring",
  "royal-dark": "Гол өнгөний бараан хувилбар (нөөц)",
  periwinkle: "Бараан дэвсгэр дээрх eyebrow, ✓ тэмдэг; secondary товч; текст сонголт",
  pink: "Үндсэн товчны градиентийн эхлэл, товчны сүүдэр",
  "pink-dark": "Ягааны бараан хувилбар (нөөц)",
  ink: "Үндсэн бичвэр, гарчиг, бараан хэсгийн дэвсгэр",
  muted: "Туслах бичвэр, тайлбар, lead",
  surface: "Цайвар гадаргуу: ээлжит хэсэг, карт, footer",
  line: "Hairline: хүснэгт, SpecGrid, картын хүрээ",
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

/** Цагаан дэвсгэртэй харьцуулсан WCAG контраст. Hex биш утгад null. */
function contrastOnWhite(value: string): string | null {
  if (!/^#[0-9a-f]{6}$/i.test(value)) return null;
  return `${(1.05 / (luminance(value) + 0.05)).toFixed(1)}:1`;
}

/* ---------- Үсэг ---------- */

const headingScale = [
  { name: "h1", cls: h1, use: "Hero гарчиг (нүүр, загварын хуудас)" },
  { name: "h2", cls: h2, use: "Загварын нэр, CTA гарчиг" },
  { name: "h3", cls: h3, use: "SectionHeading-ийн гарчиг" },
  { name: "h4", cls: h4, use: "Жижиг хэсгийн гарчиг" },
];

const textStyles = [
  { name: "Eyebrow", cls: "text-sm font-semibold uppercase tracking-[0.08em] text-royal", sample: "Спорт седан", spec: "Inter 600 · 14px · 0.08em · uppercase" },
  { name: "Lead", cls: "text-lg text-muted", sample: "Tesla-ийн хамгийн хямд үнэтэй загвар.", spec: "Inter 400 · 18px · muted" },
  { name: "Body", cls: "text-base", sample: "Өдөр тутмын хэрэглээ болон холын аялалд тохирсон.", spec: "Inter 400 · 16px/1.5" },
  { name: "Small", cls: "text-sm text-muted", sample: "Нэг цэнэглэлтээр", spec: "Inter 400 · 14px · muted" },
  { name: "Stat", cls: "text-4xl font-semibold leading-[1.15] tracking-[-0.02em]", sample: "517 км", spec: "Inter 600 · 26→36px · -0.02em" },
  { name: "Logo", cls: "text-[22px] font-bold leading-none tracking-[0.42em]", sample: "TESLA", spec: "Inter 700 · 22px · 0.42em" },
];

/* ---------- Зай, хэлбэр ---------- */

const spacing = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 28];

const layout = [
  { name: "--container-site", value: "80rem · 1280px", note: "Агуулгын дээд өргөн (max-w-site)" },
  { name: "--breakpoint-nav", value: "72rem · 1152px", note: "Дээд цэс бүтэн харагдах өргөн (nav:)" },
  { name: "Header", value: "72px", note: "Тогтмол дээд цэсний өндөр; scroll-padding-top 72px" },
  { name: "SubNav", value: "+52px", note: "Дотоод цэстэй хуудсанд scroll-padding-top 124px" },
  { name: "Хажуугийн зай", value: "px-5 → sm:px-8 → lg:px-16", note: "20 → 32 → 64px" },
  { name: "Хэсгийн зай", value: "py-16 → sm:py-20 → lg:py-28", note: "64 → 80 → 112px (Section)" },
];

const radii = [
  { cls: "rounded", value: "4px", note: "Input, цэсний холбоос, код шошго" },
  { cls: "rounded-lg", value: "8px", note: "InfoCard, IconCard, footer самбар" },
  { cls: "rounded-xl", value: "12px", note: "IconCard-ийн дүрсний дэвсгэр" },
  { cls: "rounded-3xl", value: "24px", note: "ModelVisual градиент карт" },
  { cls: "rounded-full", value: "9999px", note: "Товч, Badge, ✓ тэмдэг, scroll индикатор" },
  { cls: "rounded-none", value: "0", note: "Бүтэн өргөнтэй зураг, hero" },
];

const iconNames: IconName[] = ["thermometer", "phone", "paw", "shield"];
const socials = ["facebook", "instagram", "x", "linkedin", "youtube"];

/* ---------- Хэсгүүд ---------- */

const pageSections = [
  {
    group: "Нүүр хуудас",
    items: [
      { file: "home/Hero.tsx", text: "Бүтэн дэлгэцийн зураг, хар градиент бүрхүүл, h1, хоёр товч, scroll индикатор.", href: "/#top" },
      { file: "home/ModelSection.tsx", text: "Загвар бүр: зурагтай бол хагас/хагас, үгүй бол текст + ModelVisual.", href: "/#model-3" },
      { file: "home/CompareTable.tsx", text: "5 загварын харьцуулах хүснэгт, data/models.ts-ээс автоматаар.", href: "/#compare" },
      { file: "home/ChargingStats.tsx", text: "Бараан дэвсгэртэй цэнэглэлтийн тоон үзүүлэлт.", href: "/#charging" },
    ],
  },
  {
    group: "Загварын хуудас",
    items: [
      { file: "model/DetailHero.tsx", text: "Загварын hero: зураг, нэр, гол тоонууд.", href: "/models/model-3" },
      { file: "model/SubNav.tsx", text: "Наалддаг дотоод цэс; харж буй хэсгийг тодруулна. Энэ хуудсанд ч ашигласан.", href: "/models/model-3#overview" },
      { file: "model/FeatureRow.tsx", text: "Зураг + тайлбарын ээлжит мөр.", href: "/models/model-3#interior" },
      { file: "model/SafetySection.tsx", text: "Аюулгүй байдлын хэсэг.", href: "/models/model-3#safety" },
      { file: "model/TrimTabs.tsx", text: "Хувилбаруудын таб, ← → товчоор солигдоно (WAI-ARIA).", href: "/models/model-3#trims" },
      { file: "model/SpecsTable.tsx", text: "Бүлэгтэй техникийн үзүүлэлтийн хүснэгт.", href: "/models/model-3#specs" },
      { file: "model/CtaBanner.tsx", text: "Зурган дэвсгэртэй төгсгөлийн уриалга.", href: "/models/model-3" },
      { file: "model/ComingSoon.tsx", text: "Дэлгэрэнгүй контентгүй загварын товч хуудас.", href: "/models/model-y" },
    ],
  },
  {
    group: "Бүх хуудсанд",
    items: [
      { file: "layout/Navbar.tsx", text: "Hero дээр тунгалаг, 40px гүйлгэхэд цагаан болно; 1152px-ээс доош hamburger.", href: "/" },
      { file: "layout/Footer.tsx", text: "Хаяг, сошиал, холбоосууд, холбоо барих маягт.", href: "#contact" },
      { file: "layout/ContactForm.tsx", text: "Нэр, имэйл, мессеж; хөтөч болон сервер дээр шалгана.", href: "#contact" },
    ],
  },
];

/* ---------- Хөдөлгөөн ---------- */

const motions = [
  { name: "Scroll Reveal", where: "ui/Reveal.tsx", spec: "opacity 0 → 1, translateY(24px) → 0 · 0.7s ease", trigger: "Хэсэг дэлгэцэнд 10% орж ирэхэд (нэг удаа)" },
  { name: "Button Lift", where: "ui/Button.tsx", spec: "translateY(-2px) + сүүдэр томорно · 300ms", trigger: "Үндсэн товч дээр hover" },
  { name: "Arrow Nudge", where: "ui/Button.tsx (link)", spec: "→ translateX(4px) · transform", trigger: "«Дэлгэрэнгүй →» холбоос дээр hover" },
  { name: "Header Solidify", where: "layout/Navbar.tsx", spec: "дэвсгэр, өнгө, hairline · 300ms", trigger: "40px-ээс доош гүйлгэх" },
  { name: "Hamburger → X", where: "layout/Navbar.tsx", spec: "translate + rotate(±45°), дунд зураас opacity 0 · 200ms", trigger: "Утасны цэс нээх, хаах" },
  { name: "Scroll Dot", where: "home/Hero.tsx", spec: "opacity 1 → 0, translateY(0 → 14px) · 1.8s infinite", trigger: "Нүүр хуудас ачаалахад" },
  { name: "Color Hover", where: "Footer, SubNav, хүснэгт", spec: "color / background-color transition", trigger: "Холбоос, мөр дээр hover" },
  { name: "Smooth Anchor Scroll", where: "globals.css", spec: "html { scroll-behavior: smooth }", trigger: "#холбоос дарах" },
];

export default async function StyleguidePage() {
  const colors = await readColorTokens();
  const sample = models[0];

  return (
    <>
      <header className="bg-ink px-5 pb-16 pt-[136px] text-white sm:px-8 lg:px-16 lg:pb-24 lg:pt-[168px]">
        <div className="mx-auto flex max-w-site flex-col gap-5">
          <Eyebrow tone="periwinkle">Styleguide</Eyebrow>
          <h1 className={h1}>Дизайн систем</h1>
          <p className="max-w-[640px] text-lg text-white/75">
            Сайтын токен, үсэг, компонент, хөдөлгөөний сан. Өнгөний утгуудыг <Code className="bg-white/10 text-white">app/globals.css</Code>
            -ээс build хийх үед шууд уншдаг тул тэнд өөрчлөхөд энэ хуудас автоматаар шинэчлэгдэнэ. Компонентууд нь сайт дээрх бодит
            компонентууд.
          </p>
        </div>
      </header>

      <SubNav items={sections} />

      {/* 01 */}
      <SgSection id="principles" num="01" title="Зарчим">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Нэг эх сурвалж", "Бүх загварын өгөгдөл data/models.ts-д. Цэс, хүснэгт, footer эндээс автоматаар үүснэ."],
            ["Токеноор өнгөлнө", "Түүхий hex биш, @theme доторх --color-* токен. Өнгө солиход нэг газар засна."],
            ["Сарнай ягаан + бараан бэх", "Цагаан цаас, ягаавтар хүрэн бичвэр, үйлдэлд ягаан градиент. Lora гарчиг, Inter бичвэр."],
            ["Тайван хөдөлгөөн", "Зөөлөн reveal, жижиг hover. prefers-reduced-motion үед бүх хөдөлгөөн зогсоно."],
          ].map(([title, text]) => (
            <div key={title} className="flex flex-col gap-2 border-t-2 border-royal pt-5">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-muted">{text}</p>
            </div>
          ))}
        </div>
      </SgSection>

      {/* 02 */}
      <SgSection id="brand" num="02" title="Брэнд" tone="surface">
        <div className="grid gap-6 md:grid-cols-3">
          <Specimen label={<>Цагаан дээр · <Code>text-ink</Code></>} className="justify-center">
            <span className="-mr-[0.42em] text-[28px] font-bold leading-none tracking-[0.42em] text-ink">TESLA</span>
          </Specimen>
          <Specimen dark label={<>Бараан дээр · <Code>text-white</Code></>} className="justify-center">
            <span className="-mr-[0.42em] text-[28px] font-bold leading-none tracking-[0.42em]">TESLA</span>
          </Specimen>
          <Specimen label={<>Зураг дээр · hero бүрхүүлтэй</>} className="relative justify-center overflow-hidden border-transparent">
            <Image src="/images/hero.png" alt="" fill sizes="400px" className="object-cover" />
            <span className="absolute inset-0 bg-black/45" />
            <span className="relative -mr-[0.42em] text-[28px] font-bold leading-none tracking-[0.42em] text-white">TESLA</span>
          </Specimen>
        </div>
        <p className="text-muted">
          <Code>components/layout/Logo.tsx</Code> — текст wordmark, өнгөө эцэг элементээс (<Code>currentColor</Code>) авна.
          Header: 22px, footer: 20px. Сүүлийн үсгийн зайг <Code>-mr-[0.42em]</Code>-ээр нөхөж төвд байрлуулна.
        </p>
      </SgSection>

      {/* 03 */}
      <SgSection id="color" num="03" title="Өнгө" intro={<>Бүх өнгө <Code>@theme</Code> блокт. Tailwind-д <Code>bg-royal</Code>, <Code>text-muted</Code>, <Code>border-line</Code> гэх мэтээр ашиглана. Контраст нь цагаан дэвсгэртэй харьцуулсан.</>}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((c) => {
            const ratio = contrastOnWhite(c.value);
            return (
              <li key={c.name} className="overflow-hidden rounded-lg border border-line">
                <div className="h-24 border-b border-line" style={{ background: `var(--color-${c.name})` }} />
                <div className="flex flex-col gap-1 p-4 text-sm">
                  <Code className="self-start">--color-{c.name}</Code>
                  <span className="font-mono text-[13px] text-muted">
                    {c.value}
                    {ratio && ` · ${ratio}`}
                  </span>
                  {colorNotes[c.name] && <span className="text-muted">{colorNotes[c.name]}</span>}
                </div>
              </li>
            );
          })}
        </ul>

        <SgSub title="Градиент" note="Үндсэн товч, контакт маягтын товч.">
          <div className="flex flex-col gap-2">
            <div className="h-20 rounded-lg bg-gradient-to-r from-pink to-royal" />
            <Code className="self-start">bg-gradient-to-r from-pink to-royal</Code>
          </div>
        </SgSub>

        <SgSub title="ModelVisual-ийн сэдэв" note={<>Зураггүй загварын картууд. <Code>components/ui/ModelVisual.tsx</Code></>}>
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
      <SgSection id="type" num="04" title="Үсэг" tone="surface">
        <SgSub title="Үсгийн гэр бүл" note="Хоёулаа latin, cyrillic, cyrillic-ext багцтай тул монгол Ө, Ү зөв харагдана.">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-6">
              <span className="font-display text-6xl">Аа Өө Үү 0123</span>
              <span className="text-sm">
                <strong>Display · Lora</strong> — h1, h2, h3. <Code>font-display</Code>
              </span>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-6">
              <span className="font-sans text-6xl">Аа Өө Үү 0123</span>
              <span className="text-sm">
                <strong>Sans · Inter</strong> — бичвэр, h4, товч, label, тоо. <Code>font-sans</Code>
              </span>
            </div>
          </div>
        </SgSub>

        <SgSub title="Гарчгийн шатлал" note={<><Code>components/ui/typography.ts</Code> — утсан, таблет, компьютерт гурван алхмаар томорно.</>}>
          <ul className="border-t border-line">
            {headingScale.map((h) => (
              <SpecRow key={h.name} name={<Code>{h.name}</Code>} value={h.cls} note={h.use}>
                <p className={h.name === "h4" ? `${h.cls}` : `font-display ${h.cls}`}>Ирээдүйн жолоодлого</p>
              </SpecRow>
            ))}
          </ul>
        </SgSub>

        <SgSub title="Бичвэрийн хэв маяг">
          <ul className="border-t border-line">
            {textStyles.map((t) => (
              <SpecRow key={t.name} name={t.name} value={t.spec}>
                <p className={t.cls}>{t.sample}</p>
              </SpecRow>
            ))}
          </ul>
        </SgSub>
      </SgSection>

      {/* 05 */}
      <SgSection id="space" num="05" title="Зай" intro="Tailwind-ийн 4px шатлал. Түүхий px-ийн оронд шатлалын утгыг хэрэглэнэ.">
        <SgSub title="4px шатлал">
          <ul className="border-t border-line">
            {spacing.map((s) => (
              <SpecRow key={s} name={<Code>{s}</Code>} value={`${s * 4}px · ${s / 4}rem`}>
                <div className="h-4 rounded-sm bg-royal/70" style={{ width: s * 4 }} />
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
      <SgSection id="shape" num="06" title="Хэлбэр" tone="surface">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {radii.map((r) => (
            <li key={r.cls} className="flex flex-col gap-3">
              <div className={`aspect-square border-2 border-royal bg-periwinkle/30 ${r.cls}`} />
              <div className="flex flex-col gap-1 text-sm">
                <Code className="self-start">{r.cls}</Code>
                <span className="font-mono text-[13px] text-muted">{r.value}</span>
                <span className="text-muted">{r.note}</span>
              </div>
            </li>
          ))}
        </ul>
      </SgSection>

      {/* 07 */}
      <SgSection id="lines" num="07" title="Шугам">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-lg bg-surface">
              <div className="w-3/4 border-t border-line" />
            </div>
            <p className="text-sm"><strong>Hairline</strong> · 1px <Code>border-line</Code> · хүснэгт, SpecGrid, header</p>
          </li>
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-lg bg-ink">
              <span className="rounded-full border-[1.5px] border-white/85 bg-white/10 px-5 py-2 text-sm text-white">Outline</span>
            </div>
            <p className="text-sm"><strong>Outline light</strong> · 1.5px white 85% · зураг дээрх хоёрдогч товч</p>
          </li>
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-lg bg-surface">
              <span className="rounded-full bg-white px-5 py-2 text-sm outline-2 outline-offset-[3px] outline-royal [outline-style:solid]">Focus</span>
            </div>
            <p className="text-sm"><strong>Focus ring</strong> · 2px <Code>royal</Code>, offset 3px · <Code>:focus-visible</Code></p>
          </li>
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-lg bg-surface">
              <span className="border-b-2 border-royal px-3 py-2 text-sm font-medium text-royal">Идэвхтэй таб</span>
            </div>
            <p className="text-sm"><strong>Active underline</strong> · 2px · SubNav, дээд цэсний идэвхтэй холбоос</p>
          </li>
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-lg bg-surface">
              <div className="h-12 border-l-2 border-royal pl-4 text-sm">Тоон үзүүлэлт</div>
            </div>
            <p className="text-sm"><strong>Accent rule</strong> · зүүн 2px <Code>border-royal</Code> · ChargingStats</p>
          </li>
          <li className="flex flex-col gap-3">
            <div className="grid h-24 place-items-center rounded-lg bg-surface text-ink">
              <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="text-sm"><strong>Icon stroke</strong> · 2px, round cap · ✓ тэмдэг 3px</p>
          </li>
        </ul>
      </SgSection>

      {/* 08 */}
      <SgSection id="shadow" num="08" title="Сүүдэр, бүрхүүл" tone="surface">
        <SgSub title="Зураг дээрх бүрхүүл" note="Зураг дээрх цагаан бичвэр уншигдахуйц байхын тулд.">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { name: "Hero gradient", cls: "bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.35)_45%,rgba(0,0,0,0.6)_100%)]", spec: "black 55% → 35% → 60% · home/Hero" },
              { name: "CTA overlay", cls: "bg-black/45", spec: "black 45% · model/CtaBanner" },
            ].map((o) => (
              <figure key={o.name} className="flex flex-col gap-3">
                <div className="relative grid aspect-[16/9] place-items-center overflow-hidden rounded-lg">
                  <Image src="/images/hero.png" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  <div className={`absolute inset-0 ${o.cls}`} />
                  <span className="relative font-display text-3xl font-semibold text-white">{o.name}</span>
                </div>
                <figcaption className="text-sm text-muted">{o.spec}</figcaption>
              </figure>
            ))}
          </div>
        </SgSub>
        <SgSub title="Сүүдэр">
          <ul className="grid gap-6 sm:grid-cols-3">
            {[
              { name: "Button glow", cls: "shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--color-pink)_60%,transparent)]", spec: "0 8px 24px -8px pink 60% · үндсэн товч" },
              { name: "Header hairline", cls: "shadow-[0_1px_0_var(--color-line)]", spec: "0 1px 0 line · гүйлгэсэн header + backdrop-blur" },
              { name: "Drawer", cls: "shadow-[0_12px_24px_rgba(0,0,0,0.08)]", spec: "0 12px 24px black 8% · утасны цэс" },
            ].map((s) => (
              <li key={s.name} className="flex flex-col gap-3">
                <div className={`grid h-28 place-items-center rounded-lg bg-white ${s.cls}`}>
                  <span className="text-sm font-medium">{s.name}</span>
                </div>
                <span className="text-sm text-muted">{s.spec}</span>
              </li>
            ))}
          </ul>
        </SgSub>
      </SgSection>

      {/* 09 */}
      <SgSection id="icons" num="09" title="Дүрс" intro={<>Inline SVG, <Code>stroke=&quot;currentColor&quot;</Code>, 24×24 viewBox. Сошиал дүрс нь <Code>public/images/*.svg</Code>.</>}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {iconNames.map((name) => (
            <li key={name} className="flex flex-col items-center gap-3 rounded-lg border border-line p-5 text-center">
              <span className="grid size-12 place-items-center rounded-xl bg-royal" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  {icons[name]}
                </svg>
              </span>
              <Code>{name}</Code>
            </li>
          ))}
          <li className="flex flex-col items-center gap-3 rounded-lg border border-line p-5 text-center">
            <span className="grid size-12 place-items-center" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-[18px] rounded-full bg-royal p-[4px] text-white" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <Code>check</Code>
          </li>
          <li className="flex flex-col items-center gap-3 rounded-lg border border-line p-5 text-center">
            <span className="grid size-12 place-items-center text-2xl">→</span>
            <Code>arrow</Code>
          </li>
          {socials.map((s) => (
            <li key={s} className="flex flex-col items-center gap-3 rounded-lg border border-line p-5 text-center">
              <span className="grid size-12 place-items-center">
                <Image src={`/images/${s}.svg`} alt="" width={24} height={24} unoptimized />
              </span>
              <Code>{s}</Code>
            </li>
          ))}
        </ul>
      </SgSection>

      {/* 10 */}
      <SgSection id="components" num="10" title="Компонент" tone="surface">
        <SgSub title="Button" note={<><Code>components/ui/Button.tsx</Code> — дотоод холбоос бол next/link, гадаад бол шинэ цонхонд нээгдэнэ.</>}>
          <div className="grid gap-6 md:grid-cols-2">
            <Specimen label={<><Code>primary</Code> · <Code>secondary</Code> · <Code>link</Code> — цайвар дэвсгэр дээр</>}>
              <Button href="#components">Захиалах</Button>
              <Button href="#components" variant="secondary">Харьцуулалт</Button>
              <Button href="#components" variant="link" arrow>Дэлгэрэнгүй</Button>
            </Specimen>
            <Specimen dark label={<><Code>primary</Code> · <Code>outline-light</Code> · <Code>glass</Code> — бараан, зураг дээр</>}>
              <Button href="#components">Захиалах</Button>
              <Button href="#components" variant="outline-light">Харьцуулах</Button>
              <Button href="#components" variant="glass" size="sm">Харьцуулалт</Button>
            </Specimen>
          </div>
          <Specimen label={<>Хэмжээ: <Code>md</Code> 46px · <Code>sm</Code> 40px</>}>
            <Button href="#components">Medium</Button>
            <Button href="#components" size="sm">Small</Button>
          </Specimen>
        </SgSub>

        <SgSub title="Eyebrow, Badge" note={<Code>components/ui/Eyebrow.tsx</Code>}>
          <div className="grid gap-6 md:grid-cols-2">
            <Specimen label={<><Code>tone=&quot;blue&quot;</Code> · <Code>badge</Code></>}>
              <Eyebrow>Спорт седан</Eyebrow>
              <Eyebrow badge="Шинэ">Гэр бүлийн SUV</Eyebrow>
              <Badge>Шинэ</Badge>
            </Specimen>
            <Specimen dark label={<><Code>tone=&quot;periwinkle&quot;</Code> · <Code>tone=&quot;light&quot;</Code></>}>
              <Eyebrow tone="periwinkle">Цэнэглэлт</Eyebrow>
              <Eyebrow tone="light">Цахилгаан автомашин</Eyebrow>
            </Specimen>
          </div>
        </SgSub>

        <SgSub title="SectionHeading" note={<Code>components/ui/SectionHeading.tsx</Code>}>
          <div className="grid gap-6 md:grid-cols-2">
            <Specimen block label={<Code>tone=&quot;light-bg&quot;</Code>} className="[&>div]:mb-0">
              <SectionHeading eyebrow="Танилцуулга" title="Энгийн, цэвэрхэн дизайн" lead="Хэсгийн гарчиг, тайлбар." />
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

        <SgSub title="Карт" note={<><Code>model/InfoCard.tsx</Code> · <Code>model/IconCard.tsx</Code></>}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard image={{ src: "/images/model-y.png", alt: "Model Y" }} title="InfoCard" text="Зураг, гарчиг, тайлбартай карт. Танилцуулга хэсэгт." />
            <IconCard icon="phone" title="IconCard" text="Дүрстэй жижиг карт. Апп, аюулгүй байдлын хэсэгт." />
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
                    <Link href={item.href} className="shrink-0 text-sm font-medium text-royal hover:underline">
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
      <SgSection id="motion" num="12" title="Хөдөлгөөн" tone="surface" intro={<><Code>prefers-reduced-motion</Code> асаалттай үед reveal, scroll dot, smooth scroll бүгд унтарна (globals.css).</>}>
        <SgSub title="Сайт дээрх хөдөлгөөн">
          <ul className="border-t border-line">
            {motions.map((m) => (
              <SpecRow key={m.name} name={<strong>{m.name}</strong>} value={m.where} note={m.trigger}>
                <p className="font-mono text-[13px]">{m.spec}</p>
              </SpecRow>
            ))}
          </ul>
        </SgSub>

        <SgSub title="Тоглуулж үзэх">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <RevealDemo />
              <p className="text-sm text-muted"><strong className="text-ink">Scroll Reveal</strong> · translateY(24px) → 0 · 0.7s ease</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex min-h-[120px] flex-wrap items-center justify-center gap-6 rounded-lg border border-line bg-white p-6">
                <Button href="#motion">Hover хийж үз</Button>
                <Button href="#motion" variant="link" arrow>Дэлгэрэнгүй</Button>
                <span className="relative h-[42px] w-[26px] rounded-[14px] border-2 border-ink/60" aria-hidden="true">
                  <span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 animate-scroll-dot rounded-sm bg-ink" />
                </span>
              </div>
              <p className="text-sm text-muted"><strong className="text-ink">Button Lift · Arrow Nudge · Scroll Dot</strong></p>
            </div>
          </div>
        </SgSub>
      </SgSection>
    </>
  );
}
