import type { Spec } from "./models";
import { model3Detail } from "./model-3";

export type ImageRef = { src: string; alt: string };

export type IconName = "thermometer" | "phone" | "paw" | "shield";

type SectionIntro = { eyebrow: string; title: string; lead?: string };

export type Trim = {
  id: string;
  name: string;
  image: ImageRef;
  price: string;
  summary: string;
  stats: Spec[];
};

export type SpecsTableData = SectionIntro & {
  columns: string[];
  groups: { title: string; rows: { label: string; values: string[] }[] }[];
  footnotes: string[];
  source: { label: string; url: string };
};

export type ModelDetail = {
  hero: { image: ImageRef; lead: string; stats: Spec[] };
  overview: SectionIntro & { cards: { image: ImageRef; title: string; text: string }[] };
  interior: SectionIntro & { rows: { image: ImageRef; title: string; text: string }[] };
  connected: SectionIntro & { items: { icon: IconName; title: string; text: string }[] };
  safety: SectionIntro & { image: ImageRef; items: string[]; note: { title: string; text: string } };
  trims: SectionIntro & { items: Trim[] };
  specs: SpecsTableData;
  cta: { title: string; text: string; image: ImageRef; secondary: { label: string; href: string } };
};

/** Дэлгэрэнгүй контенттой загварууд. Шинэ загвар нэмэхдээ энд бүртгэж, models.ts дотор hasDetailPage: true болгоно. */
const details: Record<string, ModelDetail> = {
  "model-3": model3Detail,
};

export function getModelDetail(slug: string): ModelDetail | undefined {
  return details[slug];
}
