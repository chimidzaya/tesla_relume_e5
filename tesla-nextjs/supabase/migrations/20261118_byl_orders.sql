-- Byl төлбөр: загварт урьдчилгааны дүн + захиалгын хүснэгт.
-- Supabase → SQL Editor дээр нэг удаа ажиллуулна.

alter table public.models
  add column if not exists deposit_amount integer
  check (deposit_amount is null or deposit_amount > 0);

update public.models set deposit_amount = 3000000 where slug = 'model-yl';

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  model_slug text not null,
  model_name text not null,
  amount integer not null check (amount > 0),
  status text not null default 'open' check (status in ('open', 'complete', 'expired', 'failed')),
  byl_checkout_id bigint,
  paid_amount numeric,
  customer_email text,
  phone text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- RLS: зөвхөн admin уншина. Бичих нь зөвхөн сервер дээрх secret key-ээр (RLS-ийг тойрдог).
alter table public.orders enable row level security;

drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders
  for select to authenticated
  using ((select public.is_admin()));
