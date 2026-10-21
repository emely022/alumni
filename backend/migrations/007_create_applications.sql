-- Migration: 007_create_applications
-- Description: Create applications table for job posting applications

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_posting_id INTEGER NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_url VARCHAR(500) NULL,
    cover_note TEXT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interview', 'accepted', 'rejected')),
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL,
    CONSTRAINT uq_job_posting_user UNIQUE (job_posting_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_posting_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
