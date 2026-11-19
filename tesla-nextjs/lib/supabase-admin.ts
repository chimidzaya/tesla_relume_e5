import { createClient } from "@supabase/supabase-js";

/**
 * Secret key-тэй Supabase client — RLS-ийг тойрно. ЗӨВХӨН сервер дээр (Server Action, Route Handler).
 * `orders` хүснэгтэд бичихэд ашиглана. SUPABASE_SECRET_KEY-д NEXT_PUBLIC_ угтвар бүү тавь.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("SUPABASE_SECRET_KEY тохируулагдаагүй байна.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type TestDriveStatus = "booked" | "rescheduled" | "cancelled";

export type TestDriveRow = {
  booking_uid: string;
  model_slug: string | null;
  model_name: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  start_time: string;
  end_time: string | null;
  status: TestDriveStatus;
  rescheduled_from: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderStatus = "open" | "complete" | "expired" | "failed";

export type OrderRow = {
  id: string;
  model_slug: string;
  model_name: string;
  amount: number;
  status: OrderStatus;
  byl_checkout_id: number | null;
  paid_amount: number | null;
  customer_email: string | null;
  phone: string | null;
  created_at: string;
  paid_at: string | null;
};
