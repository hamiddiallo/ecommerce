-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  unit text not null, -- 'piece', 'carton', 'dozen', 'paquet', etc.
  stock integer not null default 0,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Products are public read, admin write
alter table public.products enable row level security;

create policy "Anyone can view products"
  on public.products for select
  using (true);
