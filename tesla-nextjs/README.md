# Tesla — Ирээдүйн жолоодлого

Tesla-ийн 5 загварын цахилгаан машиныг танилцуулах сайт.
**Next.js 16** (App Router), **Tailwind CSS 4**, **TypeScript** дээр бүтээгдсэн.

> Энэ хавтас бол сайтын **Next.js хувилбар**. Repo-гийн үндсэн хавтсанд байгаа `index.html`, `model-3.html`, `style.css`, `script.js`, `images/` нь анхны **HTML/CSS хувилбар** бөгөөд өөрчлөгдөөгүй.

## Ажиллуулах

Node.js 20 эсвэл түүнээс дээш хувилбар шаардлагатай.

```bash
cd tesla-nextjs  # энэ хавтас руу орох
npm install      # хамаарлуудыг суулгах
npm run dev      # хөгжүүлэлтийн сервер → http://localhost:3000
npm run build    # production build
npm start        # production сервер
npm run lint     # кодын шалгалт
```

## Бүтэц

```
app/
  layout.tsx              Бүх хуудсанд: цэс, хөл хэсэг, Inter фонт
  page.tsx                Нүүр хуудас
  models/[slug]/page.tsx  Загварын дэлгэрэнгүй хуудас (/models/model-3 г.м.)
  api/contact/route.ts    «Холбоо барих» маягтыг хүлээн авах Node.js API
  not-found.tsx           404 хуудас
  globals.css             Tailwind болон дизайн токенууд (өнгө, хэмжээ)
components/
  layout/   Navbar, Footer, ContactForm, Logo
  ui/       Button, Eyebrow, Section, SectionHeading, FeatureList, SpecGrid, Reveal, ModelVisual
  home/     Hero, ModelSection, CompareTable, ChargingStats
  model/    DetailHero, SubNav, InfoCard, FeatureRow, IconCard, SafetySection, TrimTabs, SpecsTable, CtaBanner, ComingSoon
data/
  models.ts         5 загварын мэдээлэл — сайтын цорын ганц эх сурвалж
  model-3.ts        Model 3 дэлгэрэнгүй хуудасны контент
  model-details.ts  Дэлгэрэнгүй контентын төрлүүд ба бүртгэл
lib/
  contact.ts        Маягтын өгөгдөл шалгах функц
public/images/      Зургууд
```

## Контент засах

- **Загварын тоо, үнэ, тайлбар:** `data/models.ts`. Нүүр хуудас, харьцуулах хүснэгт, цэс бүгд автоматаар шинэчлэгдэнэ.
- **Шинэ загварт дэлгэрэнгүй хуудас нэмэх:** `data/model-3.ts`-ийг жишээ болгон шинэ файл үүсгээд `data/model-details.ts`-д бүртгэнэ. Дараа нь `data/models.ts` дотор `hasDetailPage: true` болгоно.

## Vercel дээр байршуулах

Repo-г import хийхдээ **Root Directory**-г `tesla-nextjs` гэж тохируулна. Framework нь Next.js гэж автоматаар танигдана.

## API

`POST /api/contact` — `{ name, email, message }` JSON хүлээн авна.
- Зөв бол `200 { ok: true, message }`
- Буруу бол `400 { ok: false, message, errors }`

Имэйл илгээдэггүй, зөвхөн серверийн лог руу бичнэ.
