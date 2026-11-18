import { ChargingStats } from "@/components/home/ChargingStats";
import { CompareTable } from "@/components/home/CompareTable";
import { Hero } from "@/components/home/Hero";
import { ModelSection } from "@/components/home/ModelSection";
import { models } from "@/data/models";

export default function HomePage() {
  return (
    <>
      <Hero firstSectionId={models[0].slug} />
      {models.map((model) => (
        <ModelSection key={model.slug} model={model} />
      ))}
      <CompareTable models={models} />
      <ChargingStats />
    </>
  );
}
