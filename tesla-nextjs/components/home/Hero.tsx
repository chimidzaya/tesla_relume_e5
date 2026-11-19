import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { h1 } from "@/components/ui/typography";

export type HeroStat = { value: string; label: string };

/** Гарчгийн дараа гарах элементүүд — гарчиг дуусах үед зөөлөн бүдгэрч орж ирнэ (Tailwind starting:) */
const fadeIn = "transition duration-700 ease-out motion-safe:starting:translate-y-3 starting:opacity-0";

/**
 * Кино маягийн нүүр: зураг бүтэн дэлгэцээр, бичвэр зүүн доод буланд (уншигдах зам — F хэлбэр),
 * доод мөрөнд гурван гол тоо. Төвд байрласан олон товчноос илүү тайван, «үнэтэй» харагдана.
 *
 * Хөдөлгөөн:
 * - Гарчиг үг үгээр доороос гарна (TextReveal), тоонууд 0-ээс гүйнэ (CountUp)
 * - Доош гүйлгэхэд зураг удаан доошилж томорно, бичвэр дээшээ хөөрч бүдгэрнэ (scroll-driven, JS-гүй)
 */
export function Hero({ firstSectionId, stats }: { firstSectionId: string; stats: HeroStat[] }) {
  return (
    // overflow-clip (hidden биш): hidden нь scroll container үүсгэж view() timeline-ийг тасалдаг
    <header id="top" className="relative flex min-h-svh flex-col justify-end overflow-clip text-on-dark">
      <div className="absolute inset-0 origin-top scroll-parallax">
        <Image src="/images/hero.png" alt="" fill preload sizes="100vw" className="object-cover" />
      </div>
      {/* Доороос болон зүүнээс бараан — бичвэр уншигдана, зургийн дээд хэсэг цэлмэг үлдэнэ */}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(12_10_7/0.92)_0%,rgb(12_10_7/0.45)_40%,rgb(12_10_7/0.1)_70%,rgb(12_10_7/0.35)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(12_10_7/0.55)_0%,transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-site px-gutter pb-10 pt-40 scroll-fade-out">
        <div className="flex max-w-[760px] flex-col gap-6">
          <Eyebrow tone="light" className={fadeIn}>
            Цахилгаан автомашин · 2026
          </Eyebrow>
          <h1 className={h1}>
            <TextReveal text="Ирээдүйн жолоодлогод тавтай морил" delay={150} />
          </h1>
          <p className={`max-w-[480px] text-md leading-snug text-on-dark-muted ${fadeIn} delay-500`}>
            Таван загвар. Нэг зорилго — цэвэр эрчим хүчээр илүү хол, илүү хурдан.
          </p>
          <div className={`mt-2 flex flex-wrap items-center gap-3 ${fadeIn} delay-700`}>
            <Magnetic>
              <Button href={`#${firstSectionId}`} variant="outline-light">
                Загваруудтай танилцах
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="#compare" variant="glass">
                Харьцуулах
              </Button>
            </Magnetic>
          </div>
        </div>

        {stats.length > 0 && (
          <dl className={`mt-16 grid grid-cols-3 border-t border-white/20 pt-6 lg:mt-24 ${fadeIn} delay-900`}>
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse gap-1 ${i > 0 ? "border-l border-white/20 pl-4 sm:pl-8" : "pr-4"}`}
              >
                <dt className="font-sans text-2xs uppercase tracking-label text-on-dark-muted sm:text-xs">{stat.label}</dt>
                <dd className="whitespace-nowrap font-sans text-xl font-light tracking-tight tabular-nums sm:text-4xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  );
}
