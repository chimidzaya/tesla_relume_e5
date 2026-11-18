import type { SpecsTableData } from "@/data/model-details";

const cell = "border-b border-line px-6 py-[18px] align-top";

/** Бүлэгтэй техникийн үзүүлэлтийн хүснэгт. */
export function SpecsTable({ specs }: { specs: SpecsTableData }) {
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr>
              {["Үзүүлэлт", ...specs.columns].map((column) => (
                <th
                  key={column}
                  scope="col"
                  className={`${cell} bg-[#fafafa] text-sm font-semibold uppercase tracking-[0.06em] text-muted`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          {specs.groups.map((group) => (
            <tbody key={group.title}>
              <tr>
                <th
                  colSpan={specs.columns.length + 1}
                  scope="colgroup"
                  className={`${cell} pt-7 text-sm font-bold uppercase tracking-[0.06em] text-royal`}
                >
                  {group.title}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label} className="transition-colors hover:bg-royal/5">
                  <th scope="row" className={`${cell} w-[32%] font-medium text-muted`}>
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td key={specs.columns[i]} className={cell}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <ul className="mt-5 flex list-disc flex-col gap-1.5 pl-[18px] text-[13px] text-muted">
        {specs.footnotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
        <li>
          Эх сурвалж:{" "}
          <a href={specs.source.url} target="_blank" rel="noopener noreferrer" className="underline">
            {specs.source.label}
          </a>
        </li>
      </ul>
    </>
  );
}
