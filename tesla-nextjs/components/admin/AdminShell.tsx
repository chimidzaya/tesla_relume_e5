import Image from "next/image";
import type { ReactNode } from "react";
import { signOut } from "@/app/admin/actions";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { h3 } from "@/components/ui/typography";

/** Admin хуудсуудын нийтлэг бүрхүүл: бараан толгой хэсэг (тунгалаг цэс уншигдахуйц) + контент. */
export function AdminShell({
  title,
  email,
  image,
  actions,
  children,
}: {
  title: string;
  /** Гарчгийн хажууд харуулах жижиг зураг (засах хуудсанд). null бол «Зураг алга» гэж харагдана. */
  image?: { src: string; alt: string } | null;
  /** Нэвтэрсэн хэрэглэгчийн имэйл — байвал «Гарах» товч харагдана */
  email?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <header className="bg-ink px-gutter pb-12 pt-[136px] text-on-dark">
        <div className="mx-auto flex max-w-site flex-wrap items-end justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6">
            {image !== undefined && (
              <div className="relative flex aspect-[16/10] w-[160px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/[0.08] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)]">
                {image ? (
                  <Image src={image.src} alt={image.alt} fill sizes="160px" className="object-cover" />
                ) : (
                  <span className="font-sans text-xs text-on-dark-muted">Зураг алга</span>
                )}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Eyebrow tone="on-dark">Admin</Eyebrow>
              <h1 className={h3}>{title}</h1>
            </div>
          </div>
          {email && (
            <form action={signOut} className="flex items-center gap-4 font-sans text-sm text-on-dark-muted">
              <span>{email}</span>
              <button
                type="submit"
                className="min-h-10 rounded-full px-5 text-on-dark shadow-[inset_0_0_0_1px_rgb(255_255_255/0.6)] transition-colors hover:bg-white/[0.12]"
              >
                Гарах
              </button>
            </form>
          )}
        </div>
      </header>
      <div className="bg-beige px-gutter py-12">
        <div className="mx-auto flex max-w-site flex-col gap-8">
          {actions && <div className="flex flex-wrap items-center gap-4">{actions}</div>}
          {children}
        </div>
      </div>
    </>
  );
}
