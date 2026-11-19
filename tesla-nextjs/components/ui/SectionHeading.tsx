import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { ScrambleText } from "./ScrambleText";
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
      {/* Staggered scramble: эхлээд жижиг гарчиг, 150ms-ийн дараа том гарчиг */}
      <Eyebrow tone={dark ? "on-dark" : "default"}>
        <ScrambleText text={eyebrow} />
      </Eyebrow>
      <h2 className={h3}>
        <ScrambleText text={title} delay={150} />
      </h2>
      {lead && <p className={cn(leadClass, dark && "text-on-dark-muted")}>{lead}</p>}
    </div>
  );
}
