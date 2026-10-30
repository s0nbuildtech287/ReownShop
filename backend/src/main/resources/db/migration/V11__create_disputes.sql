CREATE TABLE IF NOT EXISTS disputes (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE REFERENCES orders(id),
    opened_by BIGINT NOT NULL REFERENCES users(id),
    reason VARCHAR(30) NOT NULL CHECK (reason IN ('NOT_AS_DESCRIBED', 'DEFECTIVE', 'NOT_RECEIVED', 'COUNTERFEIT', 'OTHER')),
    description TEXT NOT NULL,
    desired_resolution VARCHAR(20) NOT NULL CHECK (desired_resolution IN ('REFUND_FULL', 'REFUND_PARTIAL', 'RETURN')),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'REVIEWING', 'WAITING_SELLER', 'RESOLVED')),
    resolution VARCHAR(20),
    refund_amount BIGINT CHECK (refund_amount >= 0),
    resolved_by BIGINT REFERENCES users(id),
    due_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS dispute_messages (
    id BIGSERIAL PRIMARY KEY,
    dispute_id BIGINT NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
