import type { VisualTheme } from "@/data/models";

const themes: Record<VisualTheme, { base: string; glow: string }> = {
  blue: { base: "#2e1a2b", glow: "rgba(217, 87, 143, 0.6)" },
  slate: { base: "#3a2440", glow: "rgba(190, 150, 230, 0.55)" },
  red: { base: "#3a1424", glow: "rgba(245, 120, 150, 0.6)" },
};

/** Зураггүй загварт зориулсан, нэр бүхий градиент карт. */
export function ModelVisual({ name, tag, theme }: { name: string; tag: string; theme: VisualTheme }) {
  const { base, glow } = themes[theme];
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[16/10] items-end justify-between gap-4 overflow-hidden rounded-3xl p-6 text-white sm:p-8 lg:aspect-[600/640]"
      style={{
        background: `radial-gradient(120% 80% at 80% 10%, ${glow}, transparent 60%), radial-gradient(90% 70% at 0% 100%, rgba(255, 255, 255, 0.12), transparent 60%), ${base}`,
      }}
    >
      <span className="font-display text-[clamp(40px,6vw,84px)] font-semibold italic leading-none tracking-[-0.03em]">{name}</span>
      <span className="whitespace-nowrap rounded-full border border-white/50 px-3.5 py-1.5 text-sm">{tag}</span>
    </div>
  );
}
