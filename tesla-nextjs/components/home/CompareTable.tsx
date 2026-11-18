import Link from "next/link";
import { modelHref, type Model } from "@/data/models";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pickBest } from "@/lib/model-stats";

const headers = ["Загвар", "Төрөл", "Суудал", "Замын нөөц", "Эхлэх үнэ"];
const cell = "whitespace-nowrap border-b border-line px-5 py-5 first:pl-0 last:pr-0";

/** Онцлох шошго: ижил хэлбэртэй мөрүүдийн дунд ялгарна (Similarity-г зориуд эвдэх) */
function Highlight({ children }: { children: string }) {
  return (
    <span className="ml-3 rounded-full bg-ink px-2.5 py-1 align-middle font-sans text-2xs font-medium uppercase leading-none tracking-tagline text-on-dark">
      {children}
    </span>
  );
}

/** Загваруудыг харьцуулах хүснэгт — Supabase-ийн өгөгдлөөс автоматаар үүснэ. */
export function CompareTable({ models }: { models: Model[] }) {
  const notes = models.filter((model) => model.rangeNote);
  const longest = models.length > 1 ? pickBest(models, (m) => m.range, "max")?.model.slug : undefined;
  const cheapest = models.length > 1 ? pickBest(models, (m) => m.price, "min")?.model.slug : undefined;

  return (
    <Section id="compare" tone="beige">
      <Reveal>
        <SectionHeading eyebrow="Харьцуулалт" title="Танд аль загвар тохирох вэ?" />
      </Reveal>
      <Reveal className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className={`${cell} border-ink/60 font-sans text-2xs font-medium uppercase tracking-label text-muted`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.slug} className="group">
                <th scope="row" className={`${cell} text-md font-semibold tracking-tight`}>
                  <Link href={modelHref(model)} className="inline-flex items-center gap-2">
                    {model.name}
                    <span
                      aria-hidden="true"
                      className="text-muted opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100"
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
                <td className={`${cell} font-medium tabular-nums`}>
                  {model.price}
                  {model.slug === cheapest && <Highlight>Хамгийн хямд</Highlight>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      <p className="mt-6 text-sm text-muted">
        {notes.map((model) => `* ${model.name}: ${model.rangeNote}. `)}
        Үнэ болон үзүүлэлтүүд улс, тоноглолоос хамаарч өөр байж болно.
      </p>
    </Section>
  );
}
