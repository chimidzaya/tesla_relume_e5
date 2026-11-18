import Image from "next/image";
import Link from "next/link";
import type { Spec } from "@/data/models";
import type { ImageRef } from "@/data/model-details";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { h1 } from "@/components/ui/typography";

type DetailHeroProps = {
  name: string;
  category: string;
  lead: string;
  image: ImageRef;
  stats: Spec[];
  orderUrl: string;
};

export function DetailHero({ name, category, lead, image, stats, orderUrl }: DetailHeroProps) {
  return (
    <header className="relative flex min-h-svh items-end overflow-hidden px-5 pb-16 pt-[120px] text-white sm:px-8 lg:px-16 lg:pb-[72px]">
      <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,transparent_30%),linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.25)_50%,transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-site flex-col gap-5">
        <nav aria-label="Breadcrumb" className="flex gap-2 text-sm text-white/75">
          <Link href="/" className="hover:text-white hover:underline">
            Нүүр
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name}</span>
        </nav>
        <Eyebrow tone="light">{category}</Eyebrow>
        <h1 className={h1}>{name}</h1>
        <p className="max-w-[600px] text-lg text-white/90">{lead}</p>
        <dl className="my-2 flex flex-wrap gap-x-7 gap-y-3 sm:gap-x-12 sm:gap-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-0.5">
              <dt className="text-sm text-white/75">{stat.label}</dt>
              <dd className="text-2xl font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[32px]">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-4">
          <Button href={orderUrl}>Захиалах</Button>
          <Button href="#trims" variant="outline-light">
            Хувилбаруудыг харах
          </Button>
        </div>
      </div>
    </header>
  );
}
