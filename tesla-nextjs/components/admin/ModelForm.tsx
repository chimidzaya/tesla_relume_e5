"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import type { Model } from "@/data/models";
import { cn } from "@/lib/cn";
import { IMAGE_TYPES, SPEC_ROWS, VISUAL_THEMES, type ModelFormState } from "@/lib/model-form";
import { Field, Fieldset, inputClass, submitClass } from "./fields";

type SaveAction = (prev: ModelFormState, formData: FormData) => Promise<ModelFormState>;

/** Загвар нэмэх / засах маягт. Алдаатай үед бичсэн утгууд хадгалагдана. */
export function ModelForm({ initial, action }: { initial: Model; action: SaveAction }) {
  const [state, formAction, pending] = useActionState(action, { attempt: 0 });
  const v = state.values ?? initial;
  const e = state.errors ?? {};
  const invalid = (key: string) => (e[key] ? true : undefined);

  return (
    <form key={state.attempt} action={formAction} className="flex flex-col gap-8" noValidate>
      {state.message && (
        <p role="alert" className="rounded-lg bg-paper px-4 py-3 font-sans text-sm text-[#b3412b] shadow-[inset_0_0_0_1px_var(--color-line)]">
          {state.message}
        </p>
      )}

      <Fieldset legend="Үндсэн мэдээлэл">
        <Field label="Нэр" error={e.name}>
          <input name="name" defaultValue={v.name} aria-invalid={invalid("name")} className={inputClass} />
        </Field>
        <Field label="Slug (холбоосын нэр)" hint="Жишээ нь: model-s → /models/model-s" error={e.slug}>
          <input name="slug" defaultValue={v.slug} aria-invalid={invalid("slug")} className={inputClass} />
        </Field>
        <Field label="Ангилал" hint="Жишээ нь: Спорт седан" error={e.category}>
          <input name="category" defaultValue={v.category} aria-invalid={invalid("category")} className={inputClass} />
        </Field>
        <Field label="Шошго (заавал биш)" hint="Жишээ нь: Шинэ" error={e.badge}>
          <input name="badge" defaultValue={v.badge ?? ""} className={inputClass} />
        </Field>
        <Field label="Тайлбар" error={e.lead} className="sm:col-span-2">
          <textarea
            name="lead"
            rows={3}
            defaultValue={v.lead}
            aria-invalid={invalid("lead")}
            className={cn(inputClass, "resize-y")}
          />
        </Field>
        <Field label="Онцлогууд" hint="Мөр бүрт нэг онцлог" error={e.features} className="sm:col-span-2">
          <textarea
            name="features"
            rows={4}
            defaultValue={v.features.join("\n")}
            className={cn(inputClass, "resize-y")}
          />
        </Field>
        <Field label="Дараалал" hint="Бага тоо нь эхэнд харагдана" error={e.sortOrder}>
          <input
            name="sort_order"
            type="number"
            defaultValue={Number.isFinite(v.sortOrder) ? v.sortOrder : ""}
            aria-invalid={invalid("sortOrder")}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-3 self-end pb-3 font-sans text-sm text-ink">
          <input name="has_detail_page" type="checkbox" defaultChecked={v.hasDetailPage} className="size-4 accent-ink" />
          Дэлгэрэнгүй хуудастай (цэснээс тийш холбоно)
        </label>
      </Fieldset>

      <Fieldset legend="Үзүүлэлтүүд (картан дээрх)">
        <p className="font-sans text-sm text-muted sm:col-span-2">
          Хоосон мөрийг хадгалахгүй. Нүүр хуудсанд 4 үзүүлэлт харуулахад хамгийн гоё харагдана.
        </p>
        <div className="grid gap-3 sm:col-span-2">
          {Array.from({ length: SPEC_ROWS }, (_, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <input
                name={`spec_label_${i}`}
                aria-label={`Үзүүлэлт ${i + 1} — нэр`}
                placeholder="Нэр (жишээ нь: 0–97 км/ц)"
                defaultValue={v.specs[i]?.label ?? ""}
                className={inputClass}
              />
              <input
                name={`spec_value_${i}`}
                aria-label={`Үзүүлэлт ${i + 1} — утга`}
                placeholder="Утга (жишээ нь: 5.8 с)"
                defaultValue={v.specs[i]?.value ?? ""}
                className={inputClass}
              />
            </div>
          ))}
        </div>
        {e.specs && <p className="font-sans text-sm text-[#b3412b] sm:col-span-2">{e.specs}</p>}
      </Fieldset>

      <Fieldset legend="Харьцуулах хүснэгт">
        <Field label="Төрөл" hint="Жишээ нь: SUV" error={e.type}>
          <input name="type" defaultValue={v.type} aria-invalid={invalid("type")} className={inputClass} />
        </Field>
        <Field label="Суудлын тоо" error={e.seats}>
          <input
            name="seats"
            type="number"
            min={1}
            max={9}
            defaultValue={Number.isFinite(v.seats) ? v.seats : ""}
            aria-invalid={invalid("seats")}
            className={inputClass}
          />
        </Field>
        <Field label="Нэг цэнэглэлтээр" hint="Жишээ нь: 517 км" error={e.range}>
          <input name="range" defaultValue={v.range} aria-invalid={invalid("range")} className={inputClass} />
        </Field>
        <Field label="Замын нөөцийн тайлбар (заавал биш)" hint="Жишээ нь: CLTC стандартаар">
          <input name="range_note" defaultValue={v.rangeNote ?? ""} className={inputClass} />
        </Field>
        <Field label="Эхлэх үнэ" hint="Жишээ нь: $36,990" error={e.price}>
          <input name="price" defaultValue={v.price} aria-invalid={invalid("price")} className={inputClass} />
        </Field>
      </Fieldset>

      <Fieldset legend="Зураг эсвэл градиент карт">
        <p className="font-sans text-sm text-muted sm:col-span-2">
          Зурагтай бол бүтэн өргөн зурагтай байрлалаар харагдана. Зураггүй бол доорх шошго, өнгөөр градиент карт
          харагдана.
        </p>
        <ImagePicker currentSrc={v.image?.src} error={e.image} />
        <Field label="Зургийн зам" hint="Хоосон болговол зураггүй (градиент карт) болно" error={undefined}>
          <input name="image_src" defaultValue={v.image?.src ?? ""} className={inputClass} />
        </Field>
        <Field label="Зургийн тайлбар (alt)" hint="Зураг дээр юу байгааг товч бичнэ">
          <input name="image_alt" defaultValue={v.image?.alt ?? ""} className={inputClass} />
        </Field>
        <Field label="Градиент картын шошго" hint="Жишээ нь: Седан">
          <input name="visual_tag" defaultValue={v.visual?.tag ?? ""} className={inputClass} />
        </Field>
        <Field label="Градиент картын өнгө" error={e.visual}>
          <select name="visual_theme" defaultValue={v.visual?.theme ?? "blue"} className={inputClass}>
            {VISUAL_THEMES.map((theme) => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </select>
        </Field>
      </Fieldset>

      <Fieldset legend="Товчлуурууд">
        <Field label="Захиалах товчны бичвэр" error={e.orderLabel}>
          <input
            name="order_label"
            defaultValue={v.orderLabel}
            aria-invalid={invalid("orderLabel")}
            className={inputClass}
          />
        </Field>
        <Field label="Захиалах холбоос" error={e.orderUrl}>
          <input
            name="order_url"
            type="url"
            defaultValue={v.orderUrl}
            aria-invalid={invalid("orderUrl")}
            className={inputClass}
          />
        </Field>
        <Field label="Дэлгэрэнгүй (tesla.com) холбоос" error={e.learnUrl}>
          <input
            name="learn_url"
            type="url"
            defaultValue={v.learnUrl}
            aria-invalid={invalid("learnUrl")}
            className={inputClass}
          />
        </Field>
      </Fieldset>

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" disabled={pending} className={submitClass}>
          {pending ? "Хадгалж байна…" : "Хадгалах"}
        </button>
        <Link href="/admin" className="font-sans text-base text-ink underline-offset-[3px] hover:underline">
          Болих
        </Link>
      </div>
    </form>
  );
}

/** Одоогийн зургийг харуулж, шинэ зураг сонгоход урьдчилан харуулна. Хадгалахад Supabase Storage руу хуулагдана. */
function ImagePicker({ currentSrc, error }: { currentSrc?: string; error?: string }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const shown = preview ?? currentSrc;

  return (
    <div className="flex flex-col gap-3 sm:col-span-2">
      <span className="font-sans text-sm font-medium text-ink">Зураг</span>
      <div className="flex flex-wrap items-center gap-5">
        <div className="relative flex aspect-[16/10] w-full max-w-[320px] items-center justify-center overflow-hidden rounded-xl bg-beige shadow-[inset_0_0_0_1px_var(--color-line)]">
          {shown ? (
            <Image src={shown} alt="" fill sizes="320px" unoptimized className="object-cover" />
          ) : (
            <span className="font-sans text-sm text-muted">Зураг алга</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex min-h-10 cursor-pointer items-center justify-center self-start rounded-full px-5 font-sans text-sm font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-ink)] transition-colors hover:bg-ink/[0.08] has-[:focus-visible]:outline-2">
            {shown ? "Зураг солих" : "Зураг сонгох"}
            <input
              name="image_file"
              type="file"
              accept={IMAGE_TYPES.join(",")}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
          </label>
          <span className="font-sans text-sm text-muted">
            {preview ? "Шинэ зураг — «Хадгалах» дарахад хуулагдана." : "JPG, PNG, WEBP · 4MB хүртэл"}
          </span>
          {error && <span className="font-sans text-sm text-[#b3412b]">{error}</span>}
        </div>
      </div>
    </div>
  );
}
