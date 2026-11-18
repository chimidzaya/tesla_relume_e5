import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/model/ComingSoon";
import { CtaBanner } from "@/components/model/CtaBanner";
import { DetailHero } from "@/components/model/DetailHero";
import { FeatureRow } from "@/components/model/FeatureRow";
import { IconCard } from "@/components/model/IconCard";
import { InfoCard } from "@/components/model/InfoCard";
import { SafetySection } from "@/components/model/SafetySection";
import { SpecsTable } from "@/components/model/SpecsTable";
import { SubNav, type SubNavItem } from "@/components/model/SubNav";
import { TrimTabs } from "@/components/model/TrimTabs";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getModelDetail } from "@/data/model-details";
import { getModel, models } from "@/data/models";

/** Жагсаалтад байхгүй загвар руу орвол 404 буцаана. */
export const dynamicParams = false;

/** Бүх загварын хуудсыг build хийх үед урьдчилан бэлдэнэ. */
export function generateStaticParams() {
  return models.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({ params }: PageProps<"/models/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return {};
  return { title: model.name, description: model.lead };
}

const sections: SubNavItem[] = [
  { id: "overview", label: "Танилцуулга" },
  { id: "interior", label: "Салон" },
  { id: "connected", label: "Апп" },
  { id: "safety", label: "Аюулгүй байдал" },
  { id: "trims", label: "Хувилбарууд" },
  { id: "specs", label: "Үзүүлэлт" },
];

export default async function ModelPage({ params }: PageProps<"/models/[slug]">) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();

  const detail = getModelDetail(slug);
  if (!detail) return <ComingSoon model={model} />;

  const { hero, overview, interior, connected, safety, trims, specs, cta } = detail;

  return (
    <>
      <DetailHero
        name={model.name}
        category={model.category}
        lead={hero.lead}
        image={hero.image}
        stats={hero.stats}
        orderUrl={model.orderUrl}
      />
      <SubNav items={sections} />

      <Section id="overview">
        <Reveal>
          <SectionHeading eyebrow={overview.eyebrow} title={overview.title} lead={overview.lead} />
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {overview.cards.map((card) => (
            <Reveal key={card.title}>
              <InfoCard {...card} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="interior" tone="beige">
        <Reveal>
          <SectionHeading eyebrow={interior.eyebrow} title={interior.title} lead={interior.lead} />
        </Reveal>
        <div className="flex flex-col gap-16">
          {interior.rows.map((row, i) => (
            <Reveal key={row.title}>
              <FeatureRow {...row} reverse={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="connected">
        <Reveal>
          <SectionHeading eyebrow={connected.eyebrow} title={connected.title} lead={connected.lead} />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {connected.items.map((item) => (
            <Reveal key={item.title}>
              <IconCard {...item} />
            </Reveal>
          ))}
        </div>
      </Section>

      <SafetySection id="safety" safety={safety} />

      <Section id="trims">
        <Reveal>
          <SectionHeading eyebrow={trims.eyebrow} title={trims.title} lead={trims.lead} />
        </Reveal>
        <Reveal>
          <TrimTabs trims={trims.items} orderUrl={model.orderUrl} />
        </Reveal>
      </Section>

      <Section id="specs" tone="beige">
        <Reveal>
          <SectionHeading eyebrow={specs.eyebrow} title={specs.title} lead={specs.lead} />
        </Reveal>
        <Reveal>
          <SpecsTable specs={specs} />
        </Reveal>
      </Section>

      <CtaBanner cta={cta} orderUrl={model.orderUrl} />
    </>
  );
}
