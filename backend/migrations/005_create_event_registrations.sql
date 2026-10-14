-- Migration: 005_create_event_registrations
-- Description: Create event_registrations junction table for event attendance

CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registration_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
    CONSTRAINT uq_event_user UNIQUE (event_id, user_id)
);
