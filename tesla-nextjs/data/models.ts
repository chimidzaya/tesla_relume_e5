/**
 * Бүх загварын мэдээлэл — Supabase-ийн `public.models` хүснэгтээс уншина.
 * Нүүр хуудасны хэсгүүд, харьцуулах хүснэгт, цэс, хөл хэсэг бүгд getModels()-ийг ашиглана.
 */

import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";

export type Spec = { label: string; value: string };

export type VisualTheme = "blue" | "slate" | "red";

export type Model = {
  slug: string;
  /** Нүүр хуудас, цэс дээрх дараалал (бага нь эхэнд) */
  sortOrder: number;
  name: string;
  category: string;
  badge?: string;
  lead: string;
  features: string[];
  /** Нүүр хуудсанд харагдах 4 гол үзүүлэлт */
  specs: Spec[];
  /** Харьцуулах хүснэгтийн багануудад */
  type: string;
  seats: number;
  range: string;
  rangeNote?: string;
  price: string;
  /** Зурагтай бол бүтэн өргөн зурагтай байрлалаар, үгүй бол градиент картаар харагдана */
  image?: { src: string; alt: string };
  visual?: { tag: string; theme: VisualTheme };
  orderUrl: string;
  orderLabel: string;
  learnUrl: string;
  /** data/model-details.ts дотор бүрэн контенттой эсэх */
  hasDetailPage: boolean;
};

/** Database-ийн мөрийн хэлбэр (snake_case) */
export type ModelRow = {
  slug: string;
  sort_order: number;
  name: string;
  category: string;
  badge: string | null;
  lead: string;
  features: string[];
  specs: Spec[];
  type: string;
  seats: number;
  range: string;
  range_note: string | null;
  price: string;
  image: { src: string; alt: string } | null;
  visual: { tag: string; theme: VisualTheme } | null;
  order_url: string;
  order_label: string;
  learn_url: string;
  has_detail_page: boolean;
};

export function toModel(row: ModelRow): Model {
  return {
    slug: row.slug,
    sortOrder: row.sort_order,
    name: row.name,
    category: row.category,
    badge: row.badge ?? undefined,
    lead: row.lead,
    features: row.features,
    specs: row.specs,
    type: row.type,
    seats: row.seats,
    range: row.range,
    rangeNote: row.range_note ?? undefined,
    price: row.price,
    image: row.image ?? undefined,
    visual: row.visual ?? undefined,
    orderUrl: row.order_url,
    orderLabel: row.order_label,
    learnUrl: row.learn_url,
    hasDetailPage: row.has_detail_page,
  };
}

/** Кэшийн шошго — admin хэсэг хадгалахад үүнийг шинэчилж, сайт шууд шинэ мэдээлэл харуулна. */
export const MODELS_CACHE_TAG = "models";

/** Database-д шууд (admin-аас бус) өөрчлөлт орвол сайтад хамгийн ихдээ 60 секундийн дараа харагдана. */
export const MODELS_REVALIDATE_SECONDS = 60;

/** Бүх загварыг sort_order-оор эрэмбэлж авна. Үр дүн нь кэшлэгдэнэ. */
export const getModels = unstable_cache(
  async (): Promise<Model[]> => {
    const { data, error } = await supabase.from("models").select("*").order("sort_order");
    if (error) throw new Error(`Загваруудыг Supabase-ээс уншиж чадсангүй: ${error.message}`);
    return (data as ModelRow[]).map(toModel);
  },
  ["models"],
  { tags: [MODELS_CACHE_TAG], revalidate: MODELS_REVALIDATE_SECONDS },
);

export async function getModel(slug: string): Promise<Model | undefined> {
  const models = await getModels();
  return models.find((m) => m.slug === slug);
}

/** Цэс, хөл хэсэгт ашиглах холбоос: дэлгэрэнгүй хуудастай бол тийшээ, үгүй бол нүүр хуудасны хэсэг рүү */
export function modelHref(model: Pick<Model, "slug" | "hasDetailPage">): string {
  return model.hasDetailPage ? `/models/${model.slug}` : `/#${model.slug}`;
}
