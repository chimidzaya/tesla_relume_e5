import { CountUp } from "@/components/ui/CountUp";
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
          <Reveal key={stat.label} className="border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="whitespace-nowrap font-sans text-display-2 font-light leading-display tracking-display tabular-nums">
              <CountUp value={stat.value} duration={2000} />
            </p>
            <p className="mt-3 text-md text-on-dark-muted">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
