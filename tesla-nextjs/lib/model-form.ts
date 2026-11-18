import type { Model, ModelRow, VisualTheme } from "@/data/models";

/** Маягтад харуулах үзүүлэлтийн мөрийн тоо (хоосон мөрийг хадгалахгүй). */
export const SPEC_ROWS = 6;

export const VISUAL_THEMES: { value: VisualTheme; label: string }[] = [
  { value: "blue", label: "Цэнхэр" },
  { value: "slate", label: "Саарал" },
  { value: "red", label: "Улаан" },
];

/** Supabase Storage-ийн зургийн bucket */
export const IMAGE_BUCKET = "model-images";
export const IMAGE_MAX_BYTES = 4 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const STORAGE_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/`;

/** Хуулсан зургийн файлыг шалгана (сонгоогүй бол null). */
export function getImageFile(formData: FormData): { file: File | null; error?: string } {
  const file = formData.get("image_file");
  if (!(file instanceof File) || file.size === 0) return { file: null };
  if (!IMAGE_TYPES.includes(file.type)) return { file: null, error: "Зөвхөн JPG, PNG, WEBP, AVIF зураг." };
  if (file.size > IMAGE_MAX_BYTES) return { file: null, error: "Зураг 4MB-аас бага байх ёстой." };
  return { file };
}

export type ModelFormErrors = Partial<Record<string, string>>;

export type ModelFormState = {
  /** Маягтыг дахин зурахад ашиглана (алдаатай үед бичсэн утгууд хадгалагдана) */
  attempt: number;
  message?: string;
  errors?: ModelFormErrors;
  values?: Model;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_PATTERN = /^https?:\/\/\S+$/;

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Маягтын өгөгдлийг Model болгож, алдааг шалгана. */
export function parseModelForm(formData: FormData): { values: Model; row?: ModelRow; errors: ModelFormErrors } {
  const specs = Array.from({ length: SPEC_ROWS }, (_, i) => ({
    label: text(formData, `spec_label_${i}`),
    value: text(formData, `spec_value_${i}`),
  }));

  const imageSrc = text(formData, "image_src");
  const imageAlt = text(formData, "image_alt");
  const visualTag = text(formData, "visual_tag");
  const visualTheme = text(formData, "visual_theme") as VisualTheme;

  const values: Model = {
    slug: text(formData, "slug").toLowerCase(),
    sortOrder: Number(text(formData, "sort_order")),
    name: text(formData, "name"),
    category: text(formData, "category"),
    badge: text(formData, "badge") || undefined,
    lead: text(formData, "lead"),
    features: text(formData, "features")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    specs,
    type: text(formData, "type"),
    seats: Number(text(formData, "seats")),
    range: text(formData, "range"),
    rangeNote: text(formData, "range_note") || undefined,
    price: text(formData, "price"),
    image: imageSrc || imageAlt ? { src: imageSrc, alt: imageAlt } : undefined,
    visual: visualTag ? { tag: visualTag, theme: visualTheme } : undefined,
    orderUrl: text(formData, "order_url"),
    orderLabel: text(formData, "order_label"),
    deposit: text(formData, "deposit") ? Number(text(formData, "deposit").replace(/[\s,]/g, "")) : undefined,
    learnUrl: text(formData, "learn_url"),
    hasDetailPage: formData.get("has_detail_page") === "on",
  };

  const errors: ModelFormErrors = {};
  const required: [keyof Model, string][] = [
    ["name", "Нэрээ оруулна уу."],
    ["category", "Ангиллаа оруулна уу."],
    ["lead", "Тайлбараа оруулна уу."],
    ["type", "Төрлөө оруулна уу."],
    ["range", "Замын нөөцөө оруулна уу."],
    ["price", "Үнээ оруулна уу."],
    ["orderLabel", "Товчны бичвэрээ оруулна уу."],
  ];
  for (const [key, message] of required) {
    if (!values[key]) errors[key] = message;
  }

  if (!SLUG_PATTERN.test(values.slug)) {
    errors.slug = "Зөвхөн латин жижиг үсэг, тоо, зураас (жишээ нь: model-s).";
  } else if (values.slug === "new") {
    errors.slug = "«new» нэрийг ашиглах боломжгүй.";
  }
  if (!Number.isInteger(values.sortOrder)) errors.sortOrder = "Бүхэл тоо оруулна уу.";
  if (!Number.isInteger(values.seats) || values.seats < 1 || values.seats > 9) {
    errors.seats = "1–9 хооронд бүхэл тоо оруулна уу.";
  }
  if (!URL_PATTERN.test(values.orderUrl)) errors.orderUrl = "https://-ээр эхэлсэн холбоос оруулна уу.";
  if (!URL_PATTERN.test(values.learnUrl)) errors.learnUrl = "https://-ээр эхэлсэн холбоос оруулна уу.";
  if (values.deposit !== undefined && (!Number.isInteger(values.deposit) || values.deposit < 1000)) {
    errors.deposit = "1,000₮-өөс дээш бүхэл тоо оруулна уу (хоосон бол Byl төлбөргүй).";
  }

  if (specs.some((spec) => Boolean(spec.label) !== Boolean(spec.value))) {
    errors.specs = "Үзүүлэлт бүрийн нэр болон утгыг хоёуланг нь бөглөнө үү.";
  }

  if (values.image) {
    const src = values.image.src;
    if (src && !(src.startsWith("/") || src.startsWith(STORAGE_PREFIX))) {
      errors.image = "Зураг хуулж оруулна уу, эсвэл «/images/...» хэлбэрийн зам бичнэ үү.";
    } else if (src && !values.image.alt) {
      errors.image = "Зургийн тайлбар (alt) оруулна уу.";
    }
  }
  if (values.visual && !VISUAL_THEMES.some((theme) => theme.value === values.visual?.theme)) {
    errors.visual = "Өнгөө сонгоно уу.";
  }

  if (Object.keys(errors).length > 0) return { values, errors };

  const row: ModelRow = {
    slug: values.slug,
    sort_order: values.sortOrder,
    name: values.name,
    category: values.category,
    badge: values.badge ?? null,
    lead: values.lead,
    features: values.features,
    specs: specs.filter((spec) => spec.label && spec.value),
    type: values.type,
    seats: values.seats,
    range: values.range,
    range_note: values.rangeNote ?? null,
    price: values.price,
    image: values.image?.src ? values.image : null,
    visual: values.visual ?? null,
    order_url: values.orderUrl,
    order_label: values.orderLabel,
    deposit_amount: values.deposit ?? null,
    learn_url: values.learnUrl,
    has_detail_page: values.hasDetailPage,
  };

  return { values, row, errors };
}
