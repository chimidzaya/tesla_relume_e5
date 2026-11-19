import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Seamless loading товч.
 *
 * Хоёр төрлийн «дарж болохгүй» төлөвийг тод ялгана:
 * - loading (aria-busy): ажиллаж байна → бүдэг (75%), курсор «хүлээх», дээгүүр нь гэрэл гүйнэ (shimmer)
 * - disabled: нөхцөл биелээгүй → илүү бүдэг (45%), курсор «хориотой»
 * Хоёуланд нь дарах хөдөлгөөн, magnetic татах унтарна. Hover өнгийг унтраахын тулд дуудах газарт
 * өөрийн дэвсгэрээ давтана, жишээ нь `disabled:hover:bg-taupe` — товч «дарагдахгүй» харагдана.
 *
 * Seamless шилжилт: энгийн ба ачааллын бичиг нэг grid нүдэнд давхарлагдсан тул товчны өргөн үсрэхгүй;
 * хуучин бичиг дээшээ бүдгэрч, spinner-тэй шинэ бичиг доороос орж ирнэ.
 */
export const busyClass = cn(
  // Нөхцөл биелээгүй
  "disabled:cursor-not-allowed disabled:opacity-45 disabled:translate-y-0 disabled:shadow-none",
  // Ажиллаж байна (disabled-ийн дараа бичигдэж, давуу эрхтэй)
  "aria-busy:cursor-progress aria-busy:opacity-75",
);

export function LoadingButton({
  loading,
  loadingText,
  children,
  className,
  disabled,
  type = "submit",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  loading: boolean;
  /** Ачаалж байх үеийн бичиг, жишээ нь «Илгээж байна…» */
  loadingText: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn("relative isolate overflow-hidden", className, busyClass)}
      {...rest}
    >
      {/* Shimmer — зөвхөн ачаалж байх үед */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-transparent via-white/35 to-transparent",
          loading ? "motion-safe:animate-shimmer opacity-100" : "opacity-0",
        )}
      />
      <span className="grid place-items-center">
        <span
          aria-hidden={loading}
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center justify-center gap-2 transition duration-300 ease-out",
            loading && "opacity-0 motion-safe:-translate-y-2",
          )}
        >
          {children}
        </span>
        <span
          aria-hidden={!loading}
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center justify-center gap-2 transition duration-300 ease-out",
            !loading && "opacity-0 motion-safe:translate-y-2",
          )}
        >
          <Spinner />
          {loadingText}
        </span>
      </span>
    </button>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0 animate-spin" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
