import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LockIcon, OrderSteps } from "@/components/order/OrderSteps";
import { PayForm } from "@/components/order/PayForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { h3, h4 } from "@/components/ui/typography";
import { getModel } from "@/data/models";
import { formatMNT } from "@/lib/format";

export const metadata: Metadata = { title: "Захиалга баталгаажуулах", robots: { index: false } };

/** Төлөхийн өмнө юу болохыг тайлбарлах 3 алхам (Norman: plan — «дараа нь юу болох вэ») */
const NEXT_STEPS = [
  { title: "Byl-ийн хуудсанд QPay-ээр төлнө", text: "И-мэйл, утсаа оруулаад банкны аппаараа QR уншуулна." },
  { title: "Энэ сайт руу автоматаар буцна", text: "Төлбөр баталгаажмагц захиалгын дугаар тань харагдана." },
  { title: "Манай ажилтан холбогдоно", text: "Өнгө, хүргэлтийн хугацааг тантай хамт тохирно." },
];

/**
 * Алхам 1 — захиалгаа шалгах. «Захиалах» товч шууд мөнгө авдаггүй: эхлээд юу төлөх,
 * хэд төлөх, дараа нь юу болохыг харуулж, хэрэглэгч ухамсартайгаар шийднэ.
 */
export default async function OrderReviewPage({ params, searchParams }: PageProps<"/order/[slug]">) {
  const { slug } = await params;
  const { error } = await searchParams;
  const model = await getModel(slug);
  if (!model) notFound();
  if (!model.deposit) redirect(model.orderUrl);

  const amount = formatMNT(model.deposit);

  return (
    <>
      <header className="bg-ink px-gutter pb-12 pt-[136px] text-on-dark">
        <div className="mx-auto flex max-w-site flex-col gap-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 font-sans text-sm text-on-dark-muted">
            <Link href="/" className="hover:text-on-dark hover:underline">
              Нүүр
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/models/${model.slug}`} className="hover:text-on-dark hover:underline">
              {model.name}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Захиалга</span>
          </nav>
          <OrderSteps current={0} />
          <div className="flex flex-col gap-3">
            <h1 className={h3}>Захиалгаа шалгаад урьдчилгаа төлөх</h1>
            <p className="max-w-[560px] text-on-dark-muted">
              {model.name}-д дараалалд орохын тулд {amount} урьдчилгаа төлнө. Үлдэгдлийг машин хүлээлгэн өгөхөд төлнө.
            </p>
          </div>
        </div>
      </header>

      <section className="bg-beige px-gutter py-12 lg:py-16">
        <div className="mx-auto grid max-w-site items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Баримт (receipt) — metaphor: юу худалдаж авч буйгаа нэг карт дээр */}
          <article className="overflow-hidden rounded-2xl bg-paper shadow-[inset_0_0_0_1px_var(--color-line)] lg:col-span-7">
            {model.image && (
              <div className="bg-brown-muted">
                <Image
                  src={model.image.src}
                  alt={model.image.alt}
                  width={1600}
                  height={1000}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  preload
                  className="block h-auto w-full"
                />
              </div>
            )}
            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <div className="flex flex-col gap-2">
                <Eyebrow>{model.category}</Eyebrow>
                <h2 className={h4}>Tesla {model.name}</h2>
              </div>
              <dl className="flex flex-col font-sans text-sm">
                <Row label="Загварын эхлэх үнэ" value={model.price} />
                <Row label="Үлдэгдэл" value="Машин хүлээлгэн өгөхөд" />
                <div className="mt-2 flex items-end justify-between gap-4 border-t border-dashed border-line pt-5">
                  <dt className="font-medium text-ink">Одоо төлөх урьдчилгаа</dt>
                  <dd className="text-3xl font-semibold tracking-tight tabular-nums text-ink">{amount}</dd>
                </div>
              </dl>
            </div>
          </article>

          <aside className="flex flex-col gap-6 rounded-2xl bg-paper p-6 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-8 lg:sticky lg:top-24 lg:col-span-5">
            {error && (
              <p role="alert" className="rounded-xl bg-[#f6e3de] px-4 py-3 font-sans text-sm text-[#b3412b]">
                {error === "agree"
                  ? "Нөхцөлийг чагтлаад дахин дарна уу."
                  : "Төлбөрийн хуудас нээгдсэнгүй. Мөнгө хасагдаагүй — дахин оролдоно уу."}
              </p>
            )}

            <div className="flex flex-col gap-4">
              <h2 className="font-sans text-md font-semibold text-ink">Дараа нь юу болох вэ?</h2>
              <ol className="flex flex-col gap-4">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-beige font-sans text-xs font-semibold text-ink">
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-sans text-sm font-medium text-ink">{step.title}</p>
                      <p className="font-sans text-sm text-muted">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <PayForm slug={model.slug} amountLabel={amount} />

            <div className="flex items-start gap-2 border-t border-line pt-5 font-sans text-xs leading-snug text-muted">
              <LockIcon className="mt-px size-4 shrink-0" />
              <p className="font-sans">
                Төлбөрийг <span className="font-medium text-ink">Byl</span> хүлээн авна. Банкны мэдээлэл тань энэ сайтад
                хадгалагдахгүй.
              </p>
            </div>

            <Link
              href={`/models/${model.slug}`}
              className="self-start font-sans text-sm text-muted underline-offset-[3px] hover:text-ink hover:underline"
            >
              ← {model.name} руу буцах
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}
