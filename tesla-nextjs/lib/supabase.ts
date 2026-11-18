import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Supabase-ийн орчны хувьсагч (.env.local) тохируулагдаагүй байна.");
}

/** Supabase client — сервер болон хөтөч хоёуланд ашиглаж болно (publishable key). */
export const supabase = createClient(url, key);
