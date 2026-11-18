"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { ContactErrors } from "@/lib/contact";
import { cn } from "@/lib/cn";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "success"; message: string }
  | { state: "error"; message: string; errors?: ContactErrors };

const inputClass =
  "w-full rounded border border-line bg-white px-3.5 py-2.5 text-[15px] outline-none transition-colors placeholder:text-muted/70 focus:border-royal";

/** «Холбоо барих» маягт — мэдээллийг /api/contact (Node.js сервер) руу илгээнэ. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ state: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result: { ok: boolean; message: string; errors?: ContactErrors } = await response.json();

      if (response.ok && result.ok) {
        setStatus({ state: "success", message: result.message });
        form.reset();
      } else {
        setStatus({ state: "error", message: result.message, errors: result.errors });
      }
    } catch {
      setStatus({ state: "error", message: "Сүлжээний алдаа гарлаа. Дахин оролдоно уу." });
    }
  }

  const errors = status.state === "error" ? status.errors : undefined;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <p className="text-sm font-semibold">Бидэнд бичих</p>

      <Field label="Нэр" error={errors?.name}>
        <input name="name" type="text" autoComplete="name" maxLength={80} required className={inputClass} />
      </Field>
      <Field label="Имэйл" error={errors?.email}>
        <input name="email" type="email" autoComplete="email" maxLength={120} required className={inputClass} />
      </Field>
      <Field label="Мессеж" error={errors?.message}>
        <textarea name="message" rows={3} maxLength={2000} required className={cn(inputClass, "resize-y")} />
      </Field>

      <button
        type="submit"
        disabled={status.state === "sending"}
        className="mt-1 inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-r from-pink to-royal px-6 text-[15px] font-medium text-white shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--color-pink)_60%,transparent)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status.state === "sending" ? "Илгээж байна…" : "Илгээх"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "min-h-5 text-sm",
          status.state === "success" && "text-green-700",
          status.state === "error" && "text-red-700",
        )}
      >
        {status.state === "success" || status.state === "error" ? status.message : ""}
      </p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">{label}</span>
      {children}
      {error && <span className="text-red-700">{error}</span>}
    </label>
  );
}
