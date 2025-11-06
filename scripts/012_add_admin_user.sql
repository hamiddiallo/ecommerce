-- Add your email as an admin user
-- Replace 'votre-email@example.com' with your actual email address

INSERT INTO admin_users (user_id, email, role, created_at)
SELECT 
  id,
  email,
  'super_admin',
  NOW()
FROM auth.users
WHERE email = 'abdoulhamid028@gmail.com'
ON CONFLICT (user_id) DO NOTHING;
