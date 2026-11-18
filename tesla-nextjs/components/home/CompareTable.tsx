import Link from "next/link";
import { modelHref, type Model } from "@/data/models";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const headers = ["Загвар", "Төрөл", "Суудал", "Нэг цэнэглэлтээр", "Эхлэх үнэ"];
const cell = "whitespace-nowrap border-b border-line px-6 py-[18px]";

/** "1,000 км", "$36,990" → 1000, 36990. Тоо олдохгүй бол null. */
function toNumber(value: string): number | null {
  const n = Number.parseFloat(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Утга нь хамгийн их (эсвэл бага) загварын slug */
function pickBest(models: Model[], key: "range" | "price", mode: "max" | "min"): string | undefined {
  let best: { slug: string; n: number } | undefined;
  for (const model of models) {
    const n = toNumber(model[key]);
    if (n === null) continue;
    if (!best || (mode === "max" ? n > best.n : n < best.n)) best = { slug: model.slug, n };
  }
  return best?.slug;
}

/** Онцлох шошго: ижил хэлбэртэй мөрүүдийн дунд ялгарна (Similarity-г зориуд эвдэх) */
function Highlight({ children }: { children: string }) {
  return (
    <span className="ml-2 rounded-full bg-ink px-2 py-0.5 align-middle font-sans text-2xs font-medium uppercase tracking-tagline text-on-dark">
      {children}
    </span>
  );
}

/** Загваруудыг харьцуулах хүснэгт — Supabase-ийн өгөгдлөөс автоматаар үүснэ. */
export function CompareTable({ models }: { models: Model[] }) {
  const notes = models.filter((model) => model.rangeNote);
  const longest = models.length > 1 ? pickBest(models, "range", "max") : undefined;
  const cheapest = models.length > 1 ? pickBest(models, "price", "min") : undefined;

  return (
    <Section id="compare" tone="beige">
      <Reveal>
        <SectionHeading eyebrow="Харьцуулалт" title="Танд аль загвар тохирох вэ?" />
      </Reveal>
      <Reveal className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className={`${cell} bg-[#fafafa] text-sm font-semibold uppercase tracking-[0.06em] text-muted`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.slug} className="group transition-colors hover:bg-ink/5 [&:last-child>*]:border-b-0">
                <th scope="row" className={`${cell} font-semibold`}>
                  <Link href={modelHref(model)} className="inline-flex items-center gap-1.5">
                    {model.name}
                    <span
                      aria-hidden="true"
                      className="text-muted opacity-0 transition-[opacity,transform] group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                </th>
                <td className={`${cell} text-muted`}>{model.type}</td>
                <td className={`${cell} text-muted tabular-nums`}>{model.seats}</td>
                <td className={`${cell} tabular-nums`}>
                  {model.range}
                  {model.rangeNote && "*"}
                  {model.slug === longest && <Highlight>Хамгийн хол</Highlight>}
                </td>
                <td className={`${cell} font-semibold tabular-nums`}>
                  {model.price}
                  {model.slug === cheapest && <Highlight>Хамгийн хямд</Highlight>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      <p className="mt-4 text-sm text-muted">
        {notes.map((model) => `* ${model.name}: ${model.rangeNote}. `)}
        Үнэ болон үзүүлэлтүүд улс, тоноглолоос хамаарч өөр байж болно.
      </p>
    </Section>
  );
}
