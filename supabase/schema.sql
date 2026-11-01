-- ─── Velvet Brew · Supabase schema (optional) ──────────────────────────────
-- Run this in the Supabase SQL editor, then set VITE_SUPABASE_URL and
-- VITE_SUPABASE_ANON_KEY in Vercel (see .env.example). The app also works
-- with zero configuration on localStorage (demo mode).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer text not null default 'Guest',
  phone text,
  order_type text not null default 'takeout',
  total numeric(10, 2) not null default 0,
  status text not null default 'received',
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  category text not null,
  price numeric(10, 2) not null,
  cost numeric(10, 2) not null default 0,
  desc text,
  emoji text,
  tags text[] default '{}',
  available boolean not null default true
);

create table if not exists public.inventory_items (
  id text primary key,
  name text not null,
  unit text not null,
  stock numeric(10, 2) not null default 0,
  par numeric(10, 2) not null default 0,
  reorder_at numeric(10, 2) not null default 0,
  cost_per_unit numeric(10, 2) not null default 0,
  emoji text
);

-- Basic lockdown: allow anonymous inserts/reads for the demo.
-- Tighten these policies before going to production.
alter table public.orders enable row level security;
alter table public.menu_items enable row level security;
alter table public.inventory_items enable row level security;

create policy "anon read orders" on public.orders for select using (true);
create policy "anon insert orders" on public.orders for insert with check (true);
create policy "anon update orders" on public.orders for update using (true);
create policy "anon read menu" on public.menu_items for select using (true);
create policy "anon read inventory" on public.inventory_items for select using (true);

-- Index for the dashboard's daily/weekly reports
create index if not exists orders_created_at_idx on public.orders (created_at desc);
