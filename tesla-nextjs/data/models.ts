/**
 * Бүх загварын мэдээлэл — сайтын цорын ганц эх сурвалж.
 * Нүүр хуудасны хэсгүүд, харьцуулах хүснэгт, цэс, хөл хэсэг бүгд эндээс уншина.
 */

export type Spec = { label: string; value: string };

export type VisualTheme = "blue" | "slate" | "red";

export type Model = {
  slug: string;
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

export const models: Model[] = [
  {
    slug: "model-3",
    name: "Model 3",
    category: "Спорт седан",
    lead: "Tesla-ийн хамгийн хямд үнэтэй загвар. Энгийн, цэвэрхэн дизайнтай, ашиглалтын зардал бага.",
    features: [
      "Урд суудал болон жолооны хүрд халаалттай",
      "16 инчийн төв дэлгэц, 7 чанга яригчтай аудио систем",
      "Supercharger-т 15 минут цэнэглэхэд 274 км хүртэл замын нөөц нэмэгдэнэ",
    ],
    specs: [
      { label: "Нэг цэнэглэлтээр", value: "517 км" },
      { label: "0–97 км/ц", value: "5.8 с" },
      { label: "Ачааны багтаамж", value: "680 л" },
      { label: "Эхлэх үнэ", value: "$36,990" },
    ],
    type: "Седан",
    seats: 5,
    range: "517 км",
    price: "$36,990",
    visual: { tag: "Седан", theme: "blue" },
    orderUrl: "https://www.tesla.com/model3/design",
    orderLabel: "Захиалах",
    learnUrl: "https://www.tesla.com/model3",
    hasDetailPage: true,
  },
  {
    slug: "model-y",
    name: "Model Y",
    category: "Дунд оврын SUV",
    lead: "Өдөр тутмын хэрэглээ болон холын аялалд тохирсон гэр бүлийн автомашин.",
    features: ["5 хүний суудалтай", "NHTSA аюулгүй байдлын үнэлгээгээр 5 од авсан"],
    specs: [
      { label: "Нэг цэнэглэлтээр", value: "560 км" },
      { label: "0–97 км/ц", value: "6.8 с" },
      { label: "Ачааны багтаамж", value: "2,095 л" },
      { label: "Эхлэх үнэ", value: "$39,990" },
    ],
    type: "SUV",
    seats: 5,
    range: "560 км",
    price: "$39,990",
    image: { src: "/images/model-y.png", alt: "Цагаан өнгийн Tesla Model Y уулын замд" },
    orderUrl: "https://www.tesla.com/modely/design",
    orderLabel: "Захиалах",
    learnUrl: "https://www.tesla.com/modely",
    hasDetailPage: false,
  },
  {
    slug: "model-yl",
    name: "Model Y L",
    category: "6 суудалтай SUV",
    badge: "Шинэ",
    lead: "Model Y-ээс тэнхлэг хоорондын зай нь урт тул салон илүү өргөн, 3 эгнээ суудалтай.",
    features: [
      "Model Y-ийн бүх үндсэн онцлог хэвээр",
      "Их бие нь уртасч, 3 дахь эгнээний суудал нэмэгдсэн",
      "Premium тоноглолтой",
    ],
    specs: [
      { label: "Нэг цэнэглэлтээр (CLTC)", value: "751 км" },
      { label: "Суудлын тоо", value: "6" },
      { label: "Тэнхлэг хоорондын зай", value: "3,040 мм" },
      { label: "Эхлэх үнэ", value: "$61,990" },
    ],
    type: "SUV",
    seats: 6,
    range: "751 км",
    rangeNote: "CLTC стандартаар",
    price: "$61,990",
    visual: { tag: "6 суудалтай", theme: "slate" },
    orderUrl: "https://www.tesla.com",
    orderLabel: "Захиалах",
    learnUrl: "https://www.tesla.com",
    hasDetailPage: false,
  },
  {
    slug: "cybertruck",
    name: "Cybertruck",
    category: "Пикап",
    lead: "Гадна их бие нь зэвэрдэггүй гангаар хийгдсэн, бартаат замд зориулсан пикап.",
    features: [
      "Ачааны тэвш 1.8 × 1.2 м",
      "Бартаат замын горимуудтай: гулгаатай зам, ус туулах",
      "Premium тоноглолтой",
    ],
    specs: [
      { label: "Нэг цэнэглэлтээр", value: "523 км" },
      { label: "0–97 км/ц", value: "2.6 с" },
      { label: "Тэвшний даац", value: "1,134 кг" },
      { label: "Эхлэх үнэ", value: "$109,990" },
    ],
    type: "Пикап",
    seats: 5,
    range: "523 км",
    price: "$109,990",
    image: { src: "/images/cybertruck.png", alt: "Tesla Cybertruck зэвэрдэггүй ган их биетэй пикап" },
    orderUrl: "https://www.tesla.com/cybertruck/design",
    orderLabel: "Захиалах",
    learnUrl: "https://www.tesla.com/cybertruck",
    hasDetailPage: false,
  },
  {
    slug: "roadster",
    name: "Roadster",
    category: "Спорт машин",
    badge: "Урьдчилсан захиалга",
    lead: "Tesla-ийн хамгийн хурдан загвар. Хөнгөн, бат бөх материалаар хийгдсэн.",
    features: ["2+2 буюу 4 суудалтай", "Хүйтэн хийн түлхэгчтэй (SpaceX багц)", "Авдаг дээвэртэй"],
    specs: [
      { label: "Нэг цэнэглэлтээр", value: "1,000 км" },
      { label: "0–97 км/ц", value: "1.9 с" },
      { label: "Дээд хурд", value: "400+ км/ц" },
      { label: "Эхлэх үнэ", value: "$200,000" },
    ],
    type: "Спорт",
    seats: 4,
    range: "1,000 км",
    price: "$200,000",
    visual: { tag: "Спорт", theme: "red" },
    orderUrl: "https://www.tesla.com/roadster",
    orderLabel: "Урьдчилан захиалах",
    learnUrl: "https://www.tesla.com/roadster",
    hasDetailPage: false,
  },
];

export function getModel(slug: string): Model | undefined {
  return models.find((m) => m.slug === slug);
}

/** Цэс, хөл хэсэгт ашиглах холбоос: дэлгэрэнгүй хуудастай бол тийшээ, үгүй бол нүүр хуудасны хэсэг рүү */
export function modelHref(model: Model): string {
  return model.hasDetailPage ? `/models/${model.slug}` : `/#${model.slug}`;
}
