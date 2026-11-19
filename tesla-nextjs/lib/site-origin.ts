import { headers } from "next/headers";

/** Сайтын хаяг (Vercel дээр https://…vercel.app, локалд http://localhost:3000) — Byl-ийн буцах холбоосонд */
export async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
