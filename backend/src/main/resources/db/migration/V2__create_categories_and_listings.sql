CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES categories(id),
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS listings (
    id BIGSERIAL PRIMARY KEY,
    seller_id BIGINT NOT NULL REFERENCES users(id),
    category_id INT NOT NULL REFERENCES categories(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price BIGINT NOT NULL CHECK (price > 0),
    retail_price BIGINT CHECK (retail_price > 0),
    allow_offers BOOLEAN NOT NULL DEFAULT TRUE,
    min_accept_price BIGINT CHECK (min_accept_price > 0),
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('NEW_99', 'VERY_GOOD', 'GOOD', 'FAIR')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'RESERVED', 'SOLD', 'HIDDEN')),
    version INT NOT NULL DEFAULT 0,
    province VARCHAR(100),
    district VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    view_count INT NOT NULL DEFAULT 0,
    bumped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (min_accept_price IS NULL OR min_accept_price <= price)
);

CREATE TABLE IF NOT EXISTS listing_images (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    phash BIGINT,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_listings_title_trgm
    ON listings USING gin (unaccent(title) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_listings_status_cat ON listings (status, category_id);
CREATE INDEX IF NOT EXISTS idx_listings_bumped ON listings (bumped_at DESC) WHERE status = 'ACTIVE';
