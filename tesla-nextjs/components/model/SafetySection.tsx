import Image from "next/image";
import type { ModelDetail } from "@/data/model-details";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureList } from "@/components/ui/FeatureList";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { h3 } from "@/components/ui/typography";

export function SafetySection({ id, safety }: { id: string; safety: ModelDetail["safety"] }) {
  return (
    <Section id={id} tone="dark">
      <Reveal className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl lg:aspect-square">
          <Image
            src={safety.image.src}
            alt={safety.image.alt}
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-5">
          <Eyebrow tone="on-dark">{safety.eyebrow}</Eyebrow>
          <h2 className={h3}>{safety.title}</h2>
          {safety.lead && <p className="text-on-dark-muted">{safety.lead}</p>}
          <FeatureList items={safety.items} tone="light" />
          <div className="rounded-r-lg border-l-[3px] border-on-dark-muted bg-white/5 px-6 py-5">
            <strong>{safety.note.title}</strong>
            <p className="mt-1.5 text-sm text-on-dark-muted">{safety.note.text}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
