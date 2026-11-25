-- Migration: 008_add_role_and_is_active_to_users
-- Description: Add role and is_active columns to users table

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(30) NOT NULL DEFAULT 'alumni' CHECK (role IN ('admin', 'alumni', 'student', 'coordinator', 'employer'));

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
