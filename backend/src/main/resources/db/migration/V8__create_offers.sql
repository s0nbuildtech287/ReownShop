CREATE TABLE IF NOT EXISTS offers (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings(id),
    buyer_id BIGINT NOT NULL REFERENCES users(id),
    amount BIGINT NOT NULL CHECK (amount > 0),
    message VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'EXPIRED')),
    made_by VARCHAR(10) NOT NULL DEFAULT 'BUYER'
        CHECK (made_by IN ('BUYER', 'SELLER')),
    parent_id BIGINT REFERENCES offers(id),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_offers_listing ON offers (listing_id, status);
CREATE INDEX IF NOT EXISTS idx_offers_buyer ON offers (buyer_id, status);
