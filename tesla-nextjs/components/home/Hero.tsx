import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { h1 } from "@/components/ui/typography";

export type HeroStat = { value: string; label: string };

/**
 * Кино маягийн нүүр: зураг бүтэн дэлгэцээр, бичвэр зүүн доод буланд (уншигдах зам — F хэлбэр),
 * доод мөрөнд гурван гол тоо. Төвд байрласан олон товчноос илүү тайван, «үнэтэй» харагдана.
 */
export function Hero({ firstSectionId, stats }: { firstSectionId: string; stats: HeroStat[] }) {
  return (
    <header id="top" className="relative flex min-h-svh flex-col justify-end overflow-hidden text-on-dark">
      <Image src="/images/hero.png" alt="" fill preload sizes="100vw" className="object-cover" />
      {/* Доороос болон зүүнээс бараан — бичвэр уншигдана, зургийн дээд хэсэг цэлмэг үлдэнэ */}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(12_10_7/0.92)_0%,rgb(12_10_7/0.45)_40%,rgb(12_10_7/0.1)_70%,rgb(12_10_7/0.35)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(12_10_7/0.55)_0%,transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-site px-gutter pb-10 pt-40">
        <div className="flex max-w-[760px] flex-col gap-6">
          <Eyebrow tone="light">Цахилгаан автомашин · 2026</Eyebrow>
          <h1 className={h1}>Ирээдүйн жолоодлогод тавтай морил</h1>
          <p className="max-w-[480px] text-md leading-snug text-on-dark-muted">
            Таван загвар. Нэг зорилго — цэвэр эрчим хүчээр илүү хол, илүү хурдан.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button href={`#${firstSectionId}`} variant="outline-light">
              Загваруудтай танилцах
            </Button>
            <Button href="#compare" variant="glass">
              Харьцуулах
            </Button>
          </div>
        </div>

        {stats.length > 0 && (
          <dl className="mt-16 grid grid-cols-3 border-t border-white/20 pt-6 lg:mt-24">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse gap-1 ${i > 0 ? "border-l border-white/20 pl-4 sm:pl-8" : "pr-4"}`}
              >
                <dt className="font-sans text-2xs uppercase tracking-label text-on-dark-muted sm:text-xs">{stat.label}</dt>
                <dd className="whitespace-nowrap font-sans text-xl font-light tracking-tight tabular-nums sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  );
}
