-- Update product policies to allow admin write access
-- Drop existing policies
drop policy if exists "Anyone can view products" on public.products;

-- Recreate with admin write access
create policy "Anyone can view products"
  on public.products for select
  using (true);

create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

create policy "Admins can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );
