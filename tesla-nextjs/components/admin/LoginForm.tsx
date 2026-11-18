"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/actions";
import { Field, inputClass, submitClass } from "./fields";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <form action={action} className="flex w-full max-w-[400px] flex-col gap-5">
      <Field label="Имэйл">
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          className={inputClass}
        />
      </Field>
      <Field label="Нууц үг">
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <button type="submit" disabled={pending} className={submitClass}>
        {pending ? "Нэвтэрч байна…" : "Нэвтрэх"}
      </button>
      <p role="status" aria-live="polite" className="min-h-5 font-sans text-sm text-[#b3412b]">
        {state.message}
      </p>
    </form>
  );
}
