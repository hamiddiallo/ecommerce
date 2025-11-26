-- Add your email as an admin user
-- Replace the email with your actual admin email address

INSERT INTO admin_users (id)
SELECT id
FROM auth.users
WHERE email = 'abdoulhamid026@gmail.com'
ON CONFLICT (id) DO NOTHING;
