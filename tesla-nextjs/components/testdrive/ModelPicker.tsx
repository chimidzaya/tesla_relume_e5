"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { HOLD_MINUTES, TEST_DRIVE_FEE, type TestDriveModel } from "@/lib/cal";
import { formatMNT } from "@/lib/format";

export type PickerModel = TestDriveModel & { category: string; image?: { src: string; alt: string } };

const STEPS = ["Машин", "Цаг", "Төлбөр", "Баталгаажих"];

/**
 * Алхам 1 — машин сонгох цонх (native <dialog>: Esc-ээр хаагдана, focus цонхон дотор үлдэнэ).
 * - Машинууд radio бүлэг: нэг л машин сонгогдоно (constraint), сонгосон карт хүрээ + ✓ тэмдэгтэй (feedback)
 * - Машин сонгоогүй бол «Цаг сонгох» товч идэвхгүй — дараагийн алхам руу хоосон очихгүй
 * - Дээд талын алхмын заалт хэрэглэгч урсгалын аль хэсэгт явааг харуулна
 */
export function ModelPicker({
  open,
  models,
  onClose,
  onPick,
}: {
  open: boolean;
  models: PickerModel[];
  onClose: () => void;
  onPick: (model: TestDriveModel) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const model = models.find((m) => m.slug === selected);

  return (
    <dialog
      ref={ref}
      aria-labelledby="testdrive-title"
      onClose={onClose}
      // Цонхны гадна (backdrop) дарвал хаагдана
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className={cn(
        "m-auto max-h-[calc(100svh-32px)] w-[calc(100%-32px)] max-w-[760px] overflow-y-auto overscroll-contain rounded-2xl bg-paper p-0 text-ink shadow-2xl",
        "backdrop:bg-ink/55 backdrop:backdrop-blur-sm",
        // Нээгдэхдээ доороос зөөлөн гарч ирнэ
        "transition-[opacity,translate,display,overlay] transition-discrete duration-300 ease-out",
        "translate-y-3 opacity-0 open:translate-y-0 open:opacity-100 starting:open:translate-y-3 starting:open:opacity-0",
        "motion-reduce:translate-y-0",
      )}
    >
      <form
        className="flex flex-col gap-6 p-6 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          if (model) onPick({ slug: model.slug, name: model.name });
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <ol className="flex flex-wrap items-center gap-2 font-sans text-2xs uppercase tracking-label text-muted">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-2" aria-current={i === 0 ? "step" : undefined}>
                  {i > 0 && <span aria-hidden="true" className="h-px w-4 bg-line" />}
                  <span
                    className={cn(
                      "grid size-5 place-items-center rounded-full text-[10px] tabular-nums",
                      i === 0 ? "bg-ink text-on-dark" : "inset-ring inset-ring-line",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={i === 0 ? "text-ink" : undefined}>{step}</span>
                </li>
              ))}
            </ol>
            <h2 id="testdrive-title" className="font-sans text-2xl font-semibold tracking-tight">
              Аль машиныг туршиж үзэх вэ?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Хаах"
            className="-mr-2 -mt-1 grid size-10 shrink-0 place-items-center rounded-full text-xl text-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
          >
            ×
          </button>
        </div>

        <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <legend className="sr-only">Машин</legend>
          {models.map((m) => (
            <label
              key={m.slug}
              className={cn(
                "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl bg-paper inset-ring inset-ring-line transition",
                "hover:inset-ring-ink/40 has-checked:inset-ring-2 has-checked:inset-ring-ink",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink",
              )}
            >
              <input
                type="radio"
                name="model"
                value={m.slug}
                checked={selected === m.slug}
                onChange={() => setSelected(m.slug)}
                className="sr-only"
              />
              <span className="relative aspect-[16/10] bg-beige">
                {m.image ? (
                  <Image
                    src={m.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 240px, 45vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center font-sans text-lg font-semibold text-muted">
                    {m.name}
                  </span>
                )}
              </span>
              <span className="flex flex-col gap-0.5 px-4 py-3">
                <span className="font-sans font-semibold">{m.name}</span>
                <span className="font-sans text-xs text-muted">{m.category}</span>
              </span>
              {/* Сонгосон тэмдэг */}
              <span
                aria-hidden="true"
                className="absolute right-2.5 top-2.5 grid size-6 scale-50 place-items-center rounded-full bg-ink text-xs text-on-dark opacity-0 transition duration-200 group-has-checked:scale-100 group-has-checked:opacity-100"
              >
                ✓
              </span>
            </label>
          ))}
        </fieldset>

        <div className="flex flex-col-reverse items-stretch gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-muted" aria-live="polite">
            {model ? (
              <>
                <span className="font-medium text-ink">{model.name}</span> — дараагийн алхамд цагаа сонгоно.
              </>
            ) : (
              "Эхлээд машинаа сонгоно уу."
            )}
            <span className="mt-0.5 block text-xs">
              Цаг сонгосны дараа {formatMNT(TEST_DRIVE_FEE)} төлж баталгаажуулна ({HOLD_MINUTES} минутын дотор).
            </span>
          </p>
          <button
            type="submit"
            disabled={!model}
            className={buttonClass("dark", "md", "group disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink")}
          >
            Цаг сонгох
            <span aria-hidden="true" className="transition-transform duration-200 motion-safe:group-enabled:group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </form>
    </dialog>
  );
}
