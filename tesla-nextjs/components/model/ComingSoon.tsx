import Link from "next/link";
import type { Model } from "@/data/models";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureList } from "@/components/ui/FeatureList";
import { Section } from "@/components/ui/Section";
import { SpecGrid } from "@/components/ui/SpecGrid";
import { h1 } from "@/components/ui/typography";

/** Дэлгэрэнгүй контент хараахан ороогүй загварын хуудас — товч мэдээллийг харуулна. */
export function ComingSoon({ model }: { model: Model }) {
  return (
    <>
      <header className="bg-ink px-gutter pb-16 pt-[140px] text-on-dark lg:pb-20">
        <div className="mx-auto flex max-w-site flex-col gap-5">
          <nav aria-label="Breadcrumb" className="flex gap-2 text-sm text-on-dark-muted">
            <Link href="/" className="hover:text-on-dark hover:underline">
              Нүүр
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{model.name}</span>
          </nav>
          <Eyebrow tone="on-dark" badge={model.badge}>
            {model.category}
          </Eyebrow>
          <h1 className={h1}>{model.name}</h1>
          <p className="max-w-[564px] text-base text-on-dark-muted">{model.lead}</p>
        </div>
      </header>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-semibold">Гол онцлогууд</h2>
            <FeatureList items={model.features} />
            <SpecGrid specs={model.specs} />
          </div>
          <div className="flex flex-col items-start gap-4 self-start rounded-xl bg-beige p-8">
            <p className="text-xl font-semibold">Дэлгэрэнгүй хуудас удахгүй нэмэгдэнэ</p>
            <p className="text-muted">
              {model.name}-ийн бүрэн танилцуулгыг бэлтгэж байна. Одоохондоо албан ёсны сайтаас дэлгэрэнгүй мэдээллийг
              үзнэ үү.
            </p>
            <div className="mt-2 flex flex-wrap gap-4">
              <Button href={model.learnUrl}>Tesla.com дээр үзэх</Button>
              <Button href={`/#${model.slug}`} variant="secondary">
                Нүүр хуудас руу буцах
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
