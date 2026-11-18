import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { h1 } from "@/components/ui/typography";

export function Hero({ firstSectionId }: { firstSectionId: string }) {
  return (
    <header
      id="top"
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 pb-24 pt-[120px] text-center text-white sm:px-8 lg:px-16"
    >
      <Image src="/images/hero.png" alt="" fill preload sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.35)_45%,rgba(0,0,0,0.6)_100%)]" />

      <div className="relative flex max-w-[820px] flex-col items-center gap-6">
        <Eyebrow tone="light">Цахилгаан автомашин</Eyebrow>
        <h1 className={h1}>Ирээдүйн жолоодлогод тавтай морил</h1>
        <p className="max-w-[560px] text-lg text-white/90">Tesla-ийн хамгийн шилдэг 5 загварын цахилгаан машинууд</p>
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
