-- Update order policies to allow admin access
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Update order_items policies for admin access
create policy "Admins can view all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );
