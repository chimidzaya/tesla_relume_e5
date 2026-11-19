-- Туршилтын жолоодлого: Cal.com-ын цаг + Byl-ийн 20,000₮ төлбөр.
-- Supabase → SQL Editor дээр нэг удаа ажиллуулна.
--
-- Урсгал: Cal дээр цаг сонгоно (захиалга «хүлээгдэж буй») → 30 минутын дотор Byl-ээр төлнө
--         → webhook захиалгыг Cal API-аар баталгаажуулна. Төлөөгүй бол цаг цуцлагдана.

create table if not exists public.test_drives (
  booking_uid text primary key,               -- Cal.com-ын захиалгын uid
  model_slug text,                            -- metadata[model] — сайтаас дамжуулсан найдвартай slug
  model_name text,
  name text,
  email text,
  phone text,
  start_time timestamptz not null,
  end_time timestamptz,
  status text not null default 'pending_payment' check (
    status in ('pending_payment', 'confirmed', 'rescheduled', 'cancelled', 'expired', 'refund_needed')
  ),
  expires_at timestamptz,                     -- энэ хүртэл төлөөгүй бол цаг цуцлагдана
  order_id uuid references public.orders (id),
  paid_at timestamptz,
  rescheduled_from text,                      -- цагаа өөрчилсөн бол хуучин захиалгын uid
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists test_drives_start_time_idx on public.test_drives (start_time desc);
create index if not exists test_drives_pending_idx on public.test_drives (expires_at) where status = 'pending_payment';

-- RLS: зөвхөн admin уншина. Бичих нь зөвхөн сервер дээрх secret key-ээр (webhook, төлбөр).
alter table public.test_drives enable row level security;

drop policy if exists "admins read test drives" on public.test_drives;
create policy "admins read test drives" on public.test_drives
  for select to authenticated
  using ((select public.is_admin()));

-- Byl-ийн захиалгын хүснэгтэд төрөл + Cal-ын захиалгатай холбоос
alter table public.orders
  add column if not exists kind text not null default 'deposit' check (kind in ('deposit', 'test_drive')),
  add column if not exists booking_uid text;
