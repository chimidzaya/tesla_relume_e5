-- Туршилтын жолоодлогын захиалга (Cal.com webhook-оор бөглөгдөнө).
-- Supabase → SQL Editor дээр нэг удаа ажиллуулна.

create table if not exists public.test_drives (
  booking_uid text primary key,               -- Cal.com-ын захиалгын uid
  model_slug text,                            -- metadata[model] — сайтаас дамжуулсан найдвартай slug
  model_name text,                            -- «Машин» асуултын хариу (эсвэл slug-аас олсон нэр)
  name text,
  email text,
  phone text,
  start_time timestamptz not null,
  end_time timestamptz,
  status text not null default 'booked' check (status in ('booked', 'rescheduled', 'cancelled')),
  rescheduled_from text,                      -- цагаа өөрчилсөн бол хуучин захиалгын uid
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists test_drives_start_time_idx on public.test_drives (start_time desc);

-- RLS: зөвхөн admin уншина. Бичих нь зөвхөн сервер дээрх secret key-ээр (webhook).
alter table public.test_drives enable row level security;

drop policy if exists "admins read test drives" on public.test_drives;
create policy "admins read test drives" on public.test_drives
  for select to authenticated
  using ((select public.is_admin()));
