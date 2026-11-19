import Image from "next/image";
import { orderInfo, type Model } from "@/data/models";
import { OrderButton } from "@/components/order/OrderButton";
import { Button } from "@/components/ui/Button";
import { formatMNT } from "@/lib/format";
import { ModelVisual } from "@/components/ui/ModelVisual";
import { Reveal } from "@/components/ui/Reveal";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { Tilt, TiltGlare } from "@/components/ui/Tilt";
import { h2 } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

type Props = { model: Model; index: number };

const pad = (n: number) => String(n).padStart(2, "0");

/** Үнийг тусад нь харуулах тул үзүүлэлтийн тороос хасаж, гол 3-ыг үлдээнэ. */
function keySpecs(model: Model) {
  const specs = model.specs.filter((spec) => spec.value !== model.price);
  return (specs.length > 0 ? specs : model.specs).slice(0, 3);
}

/** «Шинэ», «Урьдчилсан захиалга» — зураг дээр бага зэрэг хазайсан наалт; tilt үед 48px «хөвж» гарна (translate-z) */
function Sticker({ children }: { children: string }) {
  return (
    <span className="absolute left-4 top-4 z-10 -rotate-2 translate-z-12 rounded-full bg-paper px-3.5 py-1.5 font-sans text-2xs font-semibold uppercase leading-none tracking-tagline text-ink shadow-[0_6px_20px_rgb(0_0_0/0.2)] sm:left-6 sm:top-6">
      {children}
    </span>
  );
}

/**
 * Нэг загварын танилцуулга.
 * - Хэсгүүд цайвар / бараан ээлжилнэ (хэмнэл, загвар бүр тусдаа «бүлэг» — Common Region)
 * - Зураг 7/12, бичвэр 5/12 — зураг давамгайлна; байрлал нь ээлжлэн солигдоно
 * - Шатлал: нэр → 3 гол тоо → үнэ → үйлдэл. Тоонууд нимгэн, том (font-light) — тансаг харагдана
 */
export function ModelSection({ model, index }: Props) {
  const dark = index % 2 === 1;
  const flip = index % 2 === 1;
  const muted = dark ? "text-on-dark-muted" : "text-muted";
  const rule = dark ? "border-white/15" : "border-line";

  return (
    <section
      id={model.slug}
      className={cn(
        "group px-gutter py-section-bottom lg:py-section-top",
        dark ? "bg-ink text-on-dark" : "bg-paper text-ink",
      )}
    >
      <div className="mx-auto grid max-w-site items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className={cn("lg:col-span-7", flip && "lg:order-2")}>
          {/* 3D tilt: хулганаар зураг бага зэрэг хазайж, гэрэл тусна; наалт нь зургаас «хөвж» гарна */}
          <Tilt>
            {/* Өргөгдсөн сүүдэр — зургаас тусдаа (clip-path сүүдрийг огтолдог тул) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl transition-shadow duration-700 group-data-tilting/tilt:shadow-2xl group-data-tilting/tilt:shadow-ink/25"
            />
            {/* Дэлгэцэнд орж ирэхэд хөшиг нээгдэх мэт тэлнэ (scroll-driven clip-path).
                overflow-hidden энд (Tilt-ийн дотор) — 3D гүнийг хавтгайруулахгүйн тулд */}
            <div className="relative overflow-hidden rounded-2xl bg-brown-muted scroll-clip-reveal">
              {model.image ? (
                <Image
                  src={model.image.src}
                  alt={model.image.alt}
                  width={1600}
                  height={1000}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  loading="eager"
                  className="block h-auto w-full transition-transform duration-1000 ease-out motion-safe:group-hover:scale-103"
                />
              ) : (
                model.visual && <ModelVisual name={model.name} tag={model.visual.tag} theme={model.visual.theme} />
              )}
              <TiltGlare />
            </div>
            {model.badge && <Sticker>{model.badge}</Sticker>}
          </Tilt>
        </Reveal>

        <Reveal className="lg:col-span-5">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className={cn("font-sans text-xs font-medium uppercase tracking-label", muted)}>
                <span className={dark ? "text-on-dark" : "text-ink"}>{pad(index + 1)}</span>
                <span className="mx-3 opacity-40">/</span>
                <ScrambleText text={model.category} />
              </p>
              <h2 className={h2}>
                <ScrambleText text={model.name} delay={250} />
              </h2>
              <p className={cn("line-clamp-2 max-w-[440px] font-serif leading-body", muted)}>{model.lead}</p>
            </div>

            <dl className={cn("grid grid-cols-3 border-y py-6", rule)}>
              {keySpecs(model).map((spec, i) => (
                <div
                  key={spec.label}
                  className={cn("flex flex-col-reverse justify-end gap-2", i > 0 && cn("border-l pl-3 sm:pl-6", rule))}
                >
                  <dt className={cn("pr-2 font-sans text-2xs uppercase leading-snug tracking-label", muted)}>
                    {spec.label}
                  </dt>
                  <dd className="whitespace-nowrap font-sans text-xl font-light leading-none tracking-tight tabular-nums sm:text-[28px]">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className={cn("font-sans text-2xs uppercase tracking-label", muted)}>Эхлэх үнэ</p>
                <p className="mt-1 font-sans text-2xl font-medium tracking-tight tabular-nums">{model.price}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button href={`/models/${model.slug}`} variant={dark ? "link-light" : "link"} arrow>
                  Дэлгэрэнгүй
                </Button>
                <OrderButton order={orderInfo(model)} variant={dark ? "outline-light" : "dark"}>
                  {model.orderLabel}
                </OrderButton>
              </div>
            </div>
            {model.deposit && (
              <p className={cn("-mt-6 font-sans text-xs", muted)}>
                Урьдчилгаа {formatMNT(model.deposit)} · Byl-ээр аюулгүй төлнө
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
