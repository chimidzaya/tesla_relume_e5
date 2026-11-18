import { ChargingStats } from "@/components/home/ChargingStats";
import { CompareTable } from "@/components/home/CompareTable";
import { Hero } from "@/components/home/Hero";
import { ModelSection } from "@/components/home/ModelSection";
import { getModels } from "@/data/models";

/** Загваруудын мэдээлэл Supabase-ээс ирдэг тул хуудсыг 60 секунд тутам шинэчилнэ. */
export const revalidate = 60;

export default async function HomePage() {
  const models = await getModels();

  return (
    <>
      <Hero firstSectionId={models[0]?.slug ?? "compare"} />
      {models.map((model) => (
        <ModelSection key={model.slug} model={model} />
      ))}
      <CompareTable models={models} />
      <ChargingStats />
    </>
  );
}
