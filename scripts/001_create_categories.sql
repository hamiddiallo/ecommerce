-- Create categories table for organizing products
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Categories are public read, admin write (no RLS needed for read)
alter table public.categories enable row level security;

create policy "Anyone can view categories"
  on public.categories for select
  using (true);
