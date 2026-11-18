import Image from "next/image";
import type { Model } from "@/data/models";
import { Button } from "@/components/ui/Button";
import { ModelVisual } from "@/components/ui/ModelVisual";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SpecGrid } from "@/components/ui/SpecGrid";
import { h2, lead } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

type Props = { model: Model; index: number; total: number };

const pad = (n: number) => String(n).padStart(2, "0");

/** Захиалах товчтой нэг холбогдсон хүрээнд харуулах тул үнийг үзүүлэлтийн тороос салгана. */
function splitSpecs(model: Model) {
  const specs = model.specs.filter((spec) => spec.value !== model.price);
  return specs.length > 0 ? specs : model.specs;
}

/**
 * Картын шатлал (дээрээс доош): дугаар + ангилал → нэр → тайлбар → онцлог → үзүүлэлт → үнэ + үйлдэл.
 * Proximity: холбоотой элементүүд бүлэг дотроо ойр (gap-3), бүлэг хооронд зай их (gap-8).
 */
function ModelContent({ model, index }: Props) {
  return (
    <div className="flex flex-col gap-10">
      {/* Нэр нь хамгийн том — нүд эхлээд түүн дээр тусна */}
      <div className="flex flex-col gap-4">
        <p className="font-sans text-xs font-medium uppercase tracking-label text-muted">
          <span className="tabular-nums text-ink">{pad(index + 1)}</span>
          <span className="mx-2 text-line">—</span>
          {model.category}
        </p>
        <h2 className={h2}>{model.name}</h2>
        <p className={cn(lead, "line-clamp-2")}>{model.lead}</p>
      </div>

      {/* Common Region: зөвхөн 3 гол тоо, нэг хүрээнд */}
      <SpecGrid specs={splitSpecs(model).slice(0, 3)} variant="card" />

      {/* Үнэ + үйлдэл нэг мөрөнд */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <p className="font-sans text-3xl font-semibold leading-none tracking-tight tabular-nums">
          {model.price}
          <span className="ml-2 font-serif text-sm font-normal italic tracking-normal text-muted">-аас</span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button href={`/models/${model.slug}`} variant="link" arrow>
            Дэлгэрэнгүй
          </Button>
          <Button href={model.orderUrl} variant="dark">
            {model.orderLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** «Шинэ», «Урьдчилсан захиалга» гэх мэт шошгыг зураг дээр бага зэрэг хазайлгаж онцолно. */
function Sticker({ children }: { children: string }) {
  return (
    <span className="absolute left-5 top-5 z-10 -rotate-3 rounded-full bg-paper px-4 py-2 font-sans text-xs font-semibold uppercase leading-none tracking-label text-ink shadow-[0_6px_20px_rgb(0_0_0/0.18)] sm:left-8 sm:top-8">
      {children}
    </span>
  );
}

/**
 * Нэг загварын танилцуулга. Зурагтай загвар хагас/хагас байрлалаар —
 * зураг нь ээлжлэн зүүн, баруун талд гарч хэмнэл үүсгэнэ.
 */
export function ModelSection({ model, index, total }: Props) {
  if (model.image) {
    const imageRight = index % 2 === 1;
    return (
      <section id={model.slug} className="group grid bg-beige lg:grid-cols-2">
        <div
          className={cn(
            "relative min-h-[280px] overflow-hidden sm:min-h-[420px] lg:min-h-[720px]",
            imageRight && "lg:order-2",
          )}
        >
          <Image
            src={model.image.src}
            alt={model.image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          />
          {model.badge && <Sticker>{model.badge}</Sticker>}
        </div>
        <div
          className={cn(
            "flex items-center px-gutter pb-section-bottom pt-section-top",
            imageRight ? "lg:justify-end lg:pr-20" : "lg:pl-20",
          )}
        >
          <Reveal className="w-full max-w-[560px]">
            <ModelContent model={model} index={index} total={total} />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <Section id={model.slug}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <ModelContent model={model} index={index} total={total} />
        </Reveal>
        {model.visual && (
          <Reveal className="relative">
            <ModelVisual name={model.name} tag={model.visual.tag} theme={model.visual.theme} />
            {model.badge && <Sticker>{model.badge}</Sticker>}
          </Reveal>
        )}
      </div>
    </Section>
  );
}
