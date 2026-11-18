"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { startCheckout } from "@/app/order/actions";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { LockIcon, Spinner } from "./OrderSteps";

/**
 * Төлөх маягт.
 * - Constraint: нөхцөлийг зөвшөөрөхөөс өмнө товч идэвхгүй (сервер дээр ч дахин шалгана)
 * - Signifier: цоож + дүн товчин дээрээ — дарахад юу болохыг урьдчилан хэлнэ
 * - Feedback: дармагц spinner, «Byl руу шилжиж байна»; давхар дарахаас сэргийлнэ
 */
export function PayForm({ slug, amountLabel }: { slug: string; amountLabel: string }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <form action={startCheckout} className="flex flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />

      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-xl p-4 font-sans text-sm leading-snug text-ink transition-shadow",
          agreed ? "shadow-[inset_0_0_0_2px_var(--color-ink)]" : "shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]",
        )}
      >
        <input
          type="checkbox"
          name="agree"
          required
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          aria-describedby="agree-hint"
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-ink"
        />
        <span>
          Урьдчилгаа нь захиалгаа баталгаажуулах төлбөр бөгөөд үлдэгдлийг машин хүлээлгэн өгөхөд төлнө гэдгийг
          ойлгосон.
        </span>
      </label>

      <Submit disabled={!agreed} amountLabel={amountLabel} />

      <p id="agree-hint" aria-live="polite" className="font-sans text-xs text-muted">
        {agreed
          ? "Дарахад Byl-ийн аюулгүй төлбөрийн хуудас нээгдэнэ. Тэнд QPay-ээр төлнө."
          : "Үргэлжлүүлэхийн тулд дээрх нөхцөлийг чагтална уу."}
      </p>
    </form>
  );
}

function Submit({ disabled, amountLabel }: { disabled: boolean; amountLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      className={buttonClass(
        "dark",
        "md",
        "min-h-[54px] w-full text-md disabled:cursor-not-allowed disabled:bg-ink/30 disabled:text-on-dark/80",
      )}
    >
      {pending ? (
        <>
          <Spinner /> Byl руу шилжиж байна…
        </>
      ) : (
        <>
          <LockIcon /> {amountLabel} төлөх
          <span aria-hidden="true">→</span>
        </>
      )}
    </button>
  );
}
