-- Migration: 009_add_password_hash_to_users
-- Description: Add nullable password_hash column to users table for secure password storage

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NULL;
