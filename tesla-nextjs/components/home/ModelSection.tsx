import Image from "next/image";
import type { Model } from "@/data/models";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureList } from "@/components/ui/FeatureList";
import { ModelVisual } from "@/components/ui/ModelVisual";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SpecGrid } from "@/components/ui/SpecGrid";
import { h2 } from "@/components/ui/typography";

function ModelContent({ model }: { model: Model }) {
  return (
    <div className="flex flex-col gap-5">
      <Eyebrow badge={model.badge}>{model.category}</Eyebrow>
      <h2 className={h2}>{model.name}</h2>
      <p className="max-w-[560px] text-lg text-muted">{model.lead}</p>
      <FeatureList items={model.features} />
      <SpecGrid specs={model.specs} />
      <div className="mt-2 flex flex-wrap items-center gap-6">
        <Button href={model.orderUrl}>{model.orderLabel}</Button>
        <Button href={`/models/${model.slug}`} variant="link" arrow>
          Дэлгэрэнгүй
        </Button>
      </div>
    </div>
  );
}

/**
 * Нэг загварын танилцуулга. Зурагтай загвар бүтэн өргөн зурагтай байрлалаар,
 * зураггүй загвар нь текст + градиент картаар харагдана.
 */
export function ModelSection({ model }: { model: Model }) {
  if (model.image) {
    return (
      <section id={model.slug} className="grid bg-surface lg:grid-cols-2">
        <div className="relative min-h-[280px] sm:min-h-[420px] lg:min-h-[720px]">
          <Image
            src={model.image.src}
            alt={model.image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center px-5 py-16 sm:px-8 sm:py-20 lg:py-28 lg:pl-20 lg:pr-16">
          <Reveal className="w-full max-w-[560px]">
            <ModelContent model={model} />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <Section id={model.slug}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <ModelContent model={model} />
        </Reveal>
        {model.visual && (
          <Reveal>
            <ModelVisual name={model.name} tag={model.visual.tag} theme={model.visual.theme} />
          </Reveal>
        )}
      </div>
    </Section>
  );
}
