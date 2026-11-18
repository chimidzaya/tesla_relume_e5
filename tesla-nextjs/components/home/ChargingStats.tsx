import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stats = [
  { value: "80,000+", label: "Supercharger цэг" },
  { value: "99%", label: "Ажиллах хугацаа" },
  { value: "15 мин", label: "Хурдан цэнэглэлт" },
];

export function ChargingStats() {
  return (
    <Section id="charging" tone="dark">
      <Reveal>
        <SectionHeading eyebrow="Supercharger сүлжээ" title="Хаана ч цэнэглэх боломжтой" tone="dark-bg" />
      </Reveal>
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        {stats.map((stat) => (
          <Reveal key={stat.label} className="border-l-2 border-royal pl-8">
            <p className="whitespace-nowrap text-[clamp(44px,5.5vw,80px)] font-bold leading-[1.2] tracking-[-0.03em]">
              {stat.value}
            </p>
            <p className="mt-2 text-[22px] font-medium text-white/80">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
