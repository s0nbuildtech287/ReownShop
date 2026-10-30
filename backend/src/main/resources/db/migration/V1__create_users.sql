CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    google_id VARCHAR(64) UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    role VARCHAR(10) NOT NULL DEFAULT 'USER'
        CHECK (role IN ('USER', 'ADMIN')),
    verification VARCHAR(12) NOT NULL DEFAULT 'UNVERIFIED'
        CHECK (verification IN ('UNVERIFIED', 'PENDING', 'VERIFIED')),
    trust_score NUMERIC(3,2) NOT NULL DEFAULT 0,
    completed_orders INT NOT NULL DEFAULT 0,
    response_rate NUMERIC(5,2),
    avg_response_minutes INT,
    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'BANNED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
