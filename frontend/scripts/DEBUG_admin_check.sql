-- DEBUG: Check if admin_users table exists and has data
-- Run these queries in Supabase SQL Editor to diagnose the issue

-- 1. Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'admin_users'
);

-- 2. Check all users in auth.users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 3. Check all admin users
SELECT * FROM admin_users;

-- 4. Check if your email is in admin_users (replace with your email)
SELECT au.*, u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.id
WHERE u.email = 'abdoulhamid026@gmail.com';

-- 5. If table exists but user not found, manually insert
-- (Replace the email with yours)
INSERT INTO admin_users (id)
SELECT id FROM auth.users
WHERE email = 'abdoulhamid026@gmail.com'
ON CONFLICT (id) DO NOTHING
RETURNING *;
