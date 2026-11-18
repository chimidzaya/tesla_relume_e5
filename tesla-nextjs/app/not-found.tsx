import { Button } from "@/components/ui/Button";
import { h1 } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-ink px-gutter pb-20 pt-[140px] text-on-dark">
      <div className="mx-auto flex w-full max-w-site flex-col items-start gap-5">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-on-dark-muted">404</p>
        <h1 className={h1}>Хуудас олдсонгүй</h1>
        <p className="max-w-[564px] text-base text-on-dark-muted">
          Таны хайсан хуудас байхгүй эсвэл зөөгдсөн байна. Нүүр хуудаснаас загваруудтай танилцаарай.
        </p>
        <Button href="/">Нүүр хуудас руу буцах</Button>
      </div>
    </section>
  );
}
