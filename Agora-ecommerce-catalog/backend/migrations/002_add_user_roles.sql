-- Migration: Add new user roles
-- Run this if you have an existing database with the old role ENUM

-- Alter the users table to add new roles
ALTER TABLE users 
MODIFY COLUMN role ENUM('customer', 'admin', 'moderator', 'editor', 'viewer', 'super_admin') 
DEFAULT 'customer';

-- Optional: Create a super_admin user (change the password hash as needed)
-- Password: Admin123! (bcrypt hash)
-- INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified)
-- VALUES (
--   'superadmin@agora.com',
--   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.XqJ8aNdj5UYXQC',
--   'Super',
--   'Admin',
--   'super_admin',
--   'active',
--   TRUE
-- );

