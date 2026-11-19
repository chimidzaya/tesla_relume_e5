"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { startCheckout } from "@/app/order/actions";
import { buttonClass } from "@/components/ui/Button";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/cn";
import { LockIcon } from "./OrderSteps";

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
          "flex cursor-pointer items-start gap-3 rounded-xl p-4 font-sans text-sm leading-snug text-ink transition-shadow duration-200",
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

      {/* Гол үйлдэл — magnetic (бүтэн өргөнтэй тул бага хүчтэй) */}
      <Magnetic className="block" max={6}>
        <Submit disabled={!agreed} amountLabel={amountLabel} />
      </Magnetic>

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
    <LoadingButton
      loading={pending}
      disabled={disabled}
      loadingText="Byl руу шилжиж байна…"
      // Hover-ийн өнгө идэвхгүй үед солигдохгүй (товч «дарагдахгүй» харагдана)
      className={buttonClass("dark", "md", "min-h-[54px] w-full text-md disabled:hover:bg-ink")}
    >
      <LockIcon /> {amountLabel} төлөх
      <span aria-hidden="true">→</span>
    </LoadingButton>
  );
}
