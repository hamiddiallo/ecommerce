-- Create admin role```sql file="scripts/009_create_admin_roles.sql"
-- Create admin roles table to manage admin users
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

alter table public.admin_users enable row level security;

-- Only admins can view admin users
create policy "Admins can view admin users"
  on public.admin_users for select
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Function to check if user is admin
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from public.admin_users
    where id = user_id
  );
$$;
