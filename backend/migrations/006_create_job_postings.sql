-- Migration: 006_create_job_postings
-- Description: Create job_postings table for career and internship opportunities

CREATE TABLE IF NOT EXISTS job_postings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(150) NULL,
    employment_type VARCHAR(50) NOT NULL DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'internship', 'contract', 'remote')),
    description TEXT NOT NULL,
    requirements TEXT NULL,
    contact_email VARCHAR(255) NULL,
    application_url VARCHAR(500) NULL,
    salary_range VARCHAR(100) NULL,
    deadline DATE NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    posted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_job_postings_active ON job_postings(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_postings_department ON job_postings(department_id);
