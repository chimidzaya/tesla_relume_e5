import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { h3 } from "./typography";

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
    <div className={cn("mb-10 flex max-w-3xl flex-col gap-3 lg:mb-14", className)}>
      <Eyebrow tone={dark ? "periwinkle" : "blue"}>{eyebrow}</Eyebrow>
      <h2 className={h3}>{title}</h2>
      {lead && <p className={cn("mt-1 text-lg", dark ? "text-white/75" : "text-muted")}>{lead}</p>}
    </div>
  );
}
