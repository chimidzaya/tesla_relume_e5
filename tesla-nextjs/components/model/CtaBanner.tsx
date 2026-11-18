import Image from "next/image";
import type { ModelDetail } from "@/data/model-details";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { h2 } from "@/components/ui/typography";

export function CtaBanner({ cta, orderUrl }: { cta: ModelDetail["cta"]; orderUrl: string }) {
  return (
    <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden px-gutter py-16 text-center text-on-dark lg:py-28">
      <Image src={cta.image.src} alt={cta.image.alt} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/50" />
      <Reveal className="relative flex flex-col items-center gap-5">
        <h2 className={h2}>{cta.title}</h2>
        <p className="text-base">{cta.text}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href={orderUrl}>Захиалах</Button>
          <Button href={cta.secondary.href} variant="outline-light">
            {cta.secondary.label}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
