import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { WordReveal } from "./WordReveal";
import { h3, lead as leadClass } from "./typography";

/** Хэсгийн гарчиг: жижиг дээд гарчиг + том гарчиг + тайлбар. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light-bg",
  className,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  /** light-bg: цагаан дэвсгэр дээр, dark-bg: бараан дэвсгэр дээр */
  tone?: "light-bg" | "dark-bg";
  className?: string;
}) {
  const dark = tone === "dark-bg";
  return (
    <div className={cn("mb-10 flex max-w-3xl flex-col gap-4 lg:mb-14", className)}>
      {/* Staggered scramble: эхлээд жижиг гарчиг, 300ms-ийн дараа том гарчиг */}
      <Eyebrow tone={dark ? "on-dark" : "default"}>
        <WordReveal text={eyebrow} />
      </Eyebrow>
      <h2 className={h3}>
        <WordReveal text={title} delay={300} />
      </h2>
      {lead && <p className={cn(leadClass, dark && "text-on-dark-muted")}>{lead}</p>}
    </div>
  );
}
