import { cn } from "@/lib/cn";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** ✓ тэмдэгтэй онцлогийн жагсаалт. */
export function FeatureList({ items, tone = "default" }: { items: string[]; tone?: "default" | "light" }) {
  return (
    <ul className="flex flex-col gap-2.5 font-serif">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <CheckIcon
            className={cn(
              "mt-[3px] size-[18px] shrink-0 rounded-full p-[4px]",
              tone === "light" ? "bg-on-dark-muted text-ink" : "bg-beige text-ink",
            )}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
