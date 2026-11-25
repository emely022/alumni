-- Migration: 010_add_phone_and_linkedin_to_users
-- Description: Add nullable phone and linkedin_url columns to users table for user profile and settings

ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(50) NULL;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500) NULL;
