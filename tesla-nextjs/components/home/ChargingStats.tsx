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
          <Reveal key={stat.label} className="border-l border-on-dark-muted/40 pl-8">
            <p className="whitespace-nowrap font-sans text-display-2 font-semibold leading-display tracking-display">
              {stat.value}
            </p>
            <p className="mt-3 text-md text-on-dark-muted">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
