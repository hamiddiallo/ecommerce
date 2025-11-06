-- Create cart table for shopping cart items
create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

alter table public.cart enable row level security;

-- Users can only access their own cart
create policy "Users can view own cart"
  on public.cart for select
  using (auth.uid() = user_id);

create policy "Users can insert into own cart"
  on public.cart for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cart"
  on public.cart for update
  using (auth.uid() = user_id);

create policy "Users can delete from own cart"
  on public.cart for delete
  using (auth.uid() = user_id);
