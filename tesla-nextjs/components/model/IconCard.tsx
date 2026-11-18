import type { ReactNode } from "react";
import type { IconName } from "@/data/model-details";

const icons: Record<IconName, ReactNode> = {
  thermometer: <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />,
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  paw: (
    <>
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.05Q6.52 17.48 4.4 16.7a3.5 3.5 0 0 1 .64-6.7z" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
};

export function IconCard({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <div className="flex h-full flex-col gap-2.5 rounded-lg bg-surface p-7">
      <span className="mb-2 grid size-12 place-items-center rounded-xl bg-royal" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icons[icon]}
        </svg>
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-[15px] text-muted">{text}</p>
    </div>
  );
}
