CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings(id),
    buyer_id BIGINT NOT NULL REFERENCES users(id),
    seller_id BIGINT NOT NULL REFERENCES users(id),
    price BIGINT NOT NULL CHECK (price > 0),
    shipping_fee BIGINT NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
    platform_fee BIGINT NOT NULL DEFAULT 0 CHECK (platform_fee >= 0),
    total_amount BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT'
        CHECK (status IN ('PENDING_PAYMENT', 'PAID_HELD', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'REFUNDED', 'CANCELLED')),
    delivery_method VARCHAR(10) NOT NULL DEFAULT 'SHIPPING'
        CHECK (delivery_method IN ('SHIPPING', 'MEETUP')),
    shipping_address JSONB,
    buyer_note VARCHAR(500),
    reserved_until TIMESTAMPTZ NOT NULL,
    auto_release_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    idempotency_key VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (total_amount = price + shipping_fee + platform_fee)
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders (buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders (seller_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_expiry ON orders (reserved_until) WHERE status = 'PENDING_PAYMENT';
CREATE UNIQUE INDEX IF NOT EXISTS uq_one_active_order_per_listing
    ON orders (listing_id)
    WHERE status IN ('PENDING_PAYMENT', 'PAID_HELD', 'SHIPPED', 'DELIVERED', 'DISPUTED');

CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    actor_id BIGINT REFERENCES users(id),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
