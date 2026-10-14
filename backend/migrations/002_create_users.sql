-- Migration: 002_create_users
-- Description: Create users table for alumni and members

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    department VARCHAR(100) NULL,
    graduation_year INTEGER NOT NULL CHECK (graduation_year BETWEEN 1950 AND 2100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
