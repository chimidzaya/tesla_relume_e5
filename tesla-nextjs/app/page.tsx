import { ChargingStats } from "@/components/home/ChargingStats";
import { CompareTable } from "@/components/home/CompareTable";
import { Hero, type HeroStat } from "@/components/home/Hero";
import { ModelRail } from "@/components/home/ModelRail";
import { ModelSection } from "@/components/home/ModelSection";
import { getModels } from "@/data/models";
import { acceleration, pickBest } from "@/lib/model-stats";

/** Загваруудын мэдээлэл Supabase-ээс ирдэг тул хуудсыг 60 секунд тутам шинэчилнэ. */
export const revalidate = 60;

export default async function HomePage() {
  const models = await getModels();

  // Нүүрний тоонууд өгөгдлөөс тооцогдоно — admin-аас өөрчлөхөд автоматаар шинэчлэгдэнэ
  const longest = pickBest(models, (m) => m.range, "max");
  const fastest = pickBest(models, acceleration, "min");
  const stats: HeroStat[] = [
    { value: String(models.length), label: "Загвар" },
    ...(longest ? [{ value: longest.value, label: "Замын нөөц" }] : []),
    ...(fastest ? [{ value: fastest.value, label: "0–97 км/ц" }] : []),
  ];

  return (
    <>
      <Hero firstSectionId={models[0]?.slug ?? "compare"} stats={stats} />
      {/* Загварын бүлгийн зам — баруун талд, том дэлгэцэнд */}
      <ModelRail items={models.map((model) => ({ slug: model.slug, name: model.name }))} />
      {models.map((model, index) => (
        <ModelSection key={model.slug} model={model} index={index} />
      ))}
      <CompareTable models={models} />
      <ChargingStats />
    </>
  );
}
