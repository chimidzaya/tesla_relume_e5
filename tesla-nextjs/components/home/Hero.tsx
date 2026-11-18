import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { h1 } from "@/components/ui/typography";

export function Hero({ firstSectionId }: { firstSectionId: string }) {
  return (
    <header
      id="top"
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-gutter pb-24 pt-[120px] text-center text-on-dark"
    >
      <Image src="/images/hero.png" alt="" fill preload sizes="100vw" className="object-cover" />
      {/* --overlay-soft → --overlay → --overlay-strong */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--overlay)_0%,var(--overlay-soft)_45%,var(--overlay-strong)_100%)]" />

      <div className="relative flex max-w-[880px] flex-col items-center gap-6">
        <Eyebrow tone="light">Цахилгаан автомашин</Eyebrow>
        <h1 className={h1}>Ирээдүйн жолоодлогод тавтай морил</h1>
        <p className="max-w-[564px] text-base text-on-dark-muted">Tesla-ийн хамгийн шилдэг 5 загварын цахилгаан машинууд</p>
        <div className="mt-2 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Button href={`#${firstSectionId}`}>Загваруудтай танилцах</Button>
          <Button href="#compare" variant="outline-light">
            Харьцуулах
          </Button>
        </div>
      </div>

      <a
        href={`#${firstSectionId}`}
        aria-label="Доош гүйлгэх"
        className="absolute bottom-8 left-1/2 h-[42px] w-[26px] -translate-x-1/2 rounded-[14px] border-2 border-white/70"
      >
        <span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 animate-scroll-dot rounded-sm bg-white" />
      </a>
    </header>
  );
}
