"use client";

import { useFormStatus } from "react-dom";
import { startTestDrivePayment } from "@/app/test-drive/actions";
import { LockIcon } from "@/components/order/OrderSteps";
import { buttonClass } from "@/components/ui/Button";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Magnetic } from "@/components/ui/Magnetic";

/** «20,000₮ төлөх» — дармагц spinner, давхар дарахаас сэргийлнэ, Byl руу шилжинэ */
export function TestDrivePayForm({ uid, amountLabel }: { uid: string; amountLabel: string }) {
  return (
    <form action={startTestDrivePayment} className="flex w-full max-w-[564px] flex-col gap-3">
      <input type="hidden" name="uid" value={uid} />
      <Magnetic className="block" max={6}>
        <Submit amountLabel={amountLabel} />
      </Magnetic>
      <p className="flex items-center gap-2 font-sans text-xs text-on-dark-muted">
        <LockIcon className="size-3.5 shrink-0" />
        Byl-ийн аюулгүй хуудсанд QPay-ээр төлнө. Төлмөгц энэ хуудас руу автоматаар буцна.
      </p>
    </form>
  );
}

function Submit({ amountLabel }: { amountLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <LoadingButton
      loading={pending}
      loadingText="Byl руу шилжиж байна…"
      className={buttonClass("outline-light", "md", "min-h-[54px] w-full text-md")}
    >
      <LockIcon /> {amountLabel} төлөх
      <span aria-hidden="true">→</span>
    </LoadingButton>
  );
}
