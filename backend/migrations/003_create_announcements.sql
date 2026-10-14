-- Migration: 003_create_announcements
-- Description: Create announcements table for university and alumni notices

CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Genel',
    author VARCHAR(100) NOT NULL DEFAULT 'Yönetim',
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_announcements_date ON announcements(date DESC);
