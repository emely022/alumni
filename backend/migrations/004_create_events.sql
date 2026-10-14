-- Migration: 004_create_events
-- Description: Create events table for reunions, seminars and workshops

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    capacity INTEGER NULL CHECK (capacity > 0),
    organizer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date ASC);
