import { WordReveal } from "@/components/ui/WordReveal";
import Image from "next/image";
import Link from "next/link";
import type { Spec } from "@/data/models";
import type { ImageRef } from "@/data/model-details";
import { OrderButton, type OrderInfo } from "@/components/order/OrderButton";
import { Button } from "@/components/ui/Button";
import { TestDriveButton } from "@/components/testdrive/TestDriveButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { h1 } from "@/components/ui/typography";

type DetailHeroProps = {
  name: string;
  category: string;
  lead: string;
  image: ImageRef;
  stats: Spec[];
  order: OrderInfo;
};

export function DetailHero({ name, category, lead, image, stats, order }: DetailHeroProps) {
  return (
    <header className="relative flex min-h-svh items-end overflow-hidden px-gutter pb-16 pt-[120px] text-on-dark lg:pb-[72px]">
      <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--overlay)_0%,transparent_30%),linear-gradient(0deg,var(--overlay-strong)_0%,var(--overlay-soft)_50%,transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-site flex-col gap-5">
        <nav aria-label="Breadcrumb" className="flex gap-2 text-sm text-on-dark-muted">
          <Link href="/" className="hover:text-on-dark hover:underline">
            Нүүр
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name}</span>
        </nav>
        <Eyebrow tone="light">{category}</Eyebrow>
        <h1 className={h1}>
          <WordReveal text={name} delay={200} />
        </h1>
        <p className="max-w-[564px] text-base text-on-dark-muted">{lead}</p>
        <dl className="my-2 flex flex-wrap gap-x-7 gap-y-3 sm:gap-x-12 sm:gap-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-0.5">
              <dt className="text-sm text-on-dark-muted">{stat.label}</dt>
              <dd className="text-2xl font-semibold leading-tight tracking-tight sm:text-[32px]">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-4">
          <OrderButton order={order}>Захиалах</OrderButton>
          <TestDriveButton model={order.slug} variant="outline-light" />
          <Button href="#trims" variant="glass">
            Хувилбаруудыг харах
          </Button>
        </div>
      </div>
    </header>
  );
}
