import type { VisualTheme } from "@/data/models";

const themes: Record<VisualTheme, { base: string; glow: string }> = {
  /* Дулаан өнгөний гэр бүл: ink / brown суурь, taupe · beige · brown-muted туяа */
  blue: { base: "#19140e", glow: "rgba(186, 178, 165, 0.45)" },
  slate: { base: "#2b180a", glow: "rgba(235, 228, 217, 0.3)" },
  red: { base: "#2b180a", glow: "rgba(148, 135, 124, 0.55)" },
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
      <span className="text-display-2 font-semibold leading-display tracking-display">{name}</span>
      <span className="whitespace-nowrap rounded-full border border-white/50 px-3.5 py-1.5 text-sm">{tag}</span>
    </div>
  );
}
