-- ============================================================
-- Sistem RAB — Skema Database Supabase
-- Cara pakai: Supabase Dashboard > SQL Editor > New query > paste semua
-- isi file ini > Run. Cukup dijalankan sekali di awal.
-- ============================================================

create table if not exists price_items (
  id text primary key,
  kategori text not null check (kategori in ('bahan','upah','alat')),
  nama text not null,
  satuan text not null,
  harga numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists ahsp_items (
  id text primary key,
  kode text not null default '',
  kategori text not null,
  nama text not null,
  satuan text not null,
  komponen jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id text primary key,
  nama text not null,
  lokasi text not null default '',
  tanggal date,
  buk numeric not null default 10,
  ppn numeric not null default 11,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update kolom updated_at setiap kali baris proyek diubah
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated_at on projects;
create trigger trg_projects_updated_at
before update on projects
for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
--
-- Aplikasi ini belum pakai sistem login (dibuat untuk pemakaian
-- pribadi/single-user). Supaya app bisa baca & tulis lewat anon key,
-- RLS diaktifkan lalu semua operasi diizinkan untuk semua role.
--
-- CATATAN KEAMANAN: siapa pun yang punya URL + anon key project ini
-- bisa membaca/mengubah datanya. Jangan sebarkan anon key secara
-- publik (misalnya di repo GitHub publik). Kalau nanti ingin
-- menambahkan login supaya lebih aman / bisa multi-user, policy di
-- bawah ini perlu diganti dengan pengecekan auth.uid().
-- ============================================================

alter table price_items enable row level security;
alter table ahsp_items enable row level security;
alter table projects enable row level security;

drop policy if exists "allow all - price_items" on price_items;
create policy "allow all - price_items" on price_items
  for all using (true) with check (true);

drop policy if exists "allow all - ahsp_items" on ahsp_items;
create policy "allow all - ahsp_items" on ahsp_items
  for all using (true) with check (true);

drop policy if exists "allow all - projects" on projects;
create policy "allow all - projects" on projects
  for all using (true) with check (true);
