import Link from "next/link";
import { modelHref, type Model } from "@/data/models";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const headers = ["Загвар", "Төрөл", "Суудал", "Нэг цэнэглэлтээр", "Эхлэх үнэ"];
const cell = "whitespace-nowrap border-b border-line px-6 py-[18px]";

/** 5 загварыг харьцуулах хүснэгт — data/models.ts-ээс автоматаар үүснэ. */
export function CompareTable({ models }: { models: Model[] }) {
  const notes = models.filter((model) => model.rangeNote);

  return (
    <Section id="compare" tone="beige">
      <Reveal>
        <SectionHeading eyebrow="Харьцуулалт" title="Танд аль загвар тохирох вэ?" />
      </Reveal>
      <Reveal className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left">
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
              <tr key={model.slug} className="transition-colors hover:bg-ink/5 [&:last-child>*]:border-b-0">
                <th scope="row" className={`${cell} font-semibold`}>
                  <Link href={modelHref(model)} className="hover:text-ink">
                    {model.name}
                  </Link>
                </th>
                <td className={cell}>{model.type}</td>
                <td className={cell}>{model.seats}</td>
                <td className={cell}>
                  {model.range}
                  {model.rangeNote && "*"}
                </td>
                <td className={`${cell} font-semibold`}>{model.price}</td>
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
