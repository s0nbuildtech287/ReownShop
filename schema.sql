-- ============================================================
-- SCHEMA REOWNSHOP - CHỢ ĐỒ 2HAND CÓ ESCROW (PostgreSQL)
-- Phiên bản 2: đã cập nhật cho khớp với 20 màn hình giao diện
-- Quy ước:
--   * Tiền lưu bằng BIGINT (đơn vị: đồng VND), KHÔNG dùng float
--   * Thời gian dùng TIMESTAMPTZ
--   * Tên trạng thái PHẢI giống hệt bên frontend (mocks/)
-- ============================================================

-- Cho phép tìm kiếm tiếng Việt không dấu và so khớp gần đúng
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- 1. NGƯỜI DÙNG, XÁC MINH, ĐỊA CHỈ, CÀI ĐẶT
-- ============================================================
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,                  -- khóa chính tự tăng
    email           VARCHAR(255) NOT NULL UNIQUE,           -- email đăng nhập, không trùng
    password_hash   VARCHAR(255),                           -- chỉ lưu hash; NULL nếu đăng nhập bằng Google
    google_id       VARCHAR(64) UNIQUE,                     -- id tài khoản Google (nếu có)
    full_name       VARCHAR(120) NOT NULL,                  -- tên hiển thị
    avatar_url      TEXT,                                   -- ảnh đại diện
    phone           VARCHAR(20),                            -- số điện thoại (tùy chọn)
    role            VARCHAR(10)  NOT NULL DEFAULT 'USER'
                    CHECK (role IN ('USER', 'ADMIN')),      -- phân quyền
    verification    VARCHAR(12)  NOT NULL DEFAULT 'UNVERIFIED'
                    CHECK (verification IN ('UNVERIFIED', 'PENDING', 'VERIFIED')), -- huy hiệu "đã xác minh"
    trust_score     NUMERIC(3,2) NOT NULL DEFAULT 0,        -- điểm uy tín, tính lại định kỳ từ reviews
    completed_orders INT         NOT NULL DEFAULT 0,        -- số đơn bán thành công (hiện ở hồ sơ người bán)
    response_rate   NUMERIC(5,2),                           -- tỉ lệ phản hồi (%), job tính định kỳ
    avg_response_minutes INT,                               -- thời gian phản hồi trung bình (phút)
    status          VARCHAR(10)  NOT NULL DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'BANNED')), -- trạng thái tài khoản
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()     -- "ngày tham gia"
);

-- Xác minh nhiều bước. CHỈ lưu trạng thái, KHÔNG lưu số CCCD/giấy tờ trong DB
CREATE TABLE user_verifications (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    step         VARCHAR(20) NOT NULL
                 CHECK (step IN ('EMAIL', 'PHONE', 'ID_DOCUMENT')),  -- từng bước xác minh
    status       VARCHAR(10) NOT NULL DEFAULT 'PENDING'
                 CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    verified_at  TIMESTAMPTZ,
    UNIQUE (user_id, step)                                  -- mỗi bước chỉ có 1 bản ghi / người
);

-- Nhiều địa chỉ nhận hàng, có địa chỉ mặc định
CREATE TABLE addresses (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient    VARCHAR(120) NOT NULL,                     -- họ tên người nhận
    phone        VARCHAR(20)  NOT NULL,
    province     VARCHAR(100) NOT NULL,                     -- tỉnh/thành
    district     VARCHAR(100) NOT NULL,                     -- quận/huyện
    ward         VARCHAR(100) NOT NULL,                     -- phường/xã
    detail       VARCHAR(255) NOT NULL,                     -- số nhà, tên đường
    is_default   BOOLEAN NOT NULL DEFAULT FALSE
);
-- Mỗi người chỉ được có đúng 1 địa chỉ mặc định
CREATE UNIQUE INDEX uq_one_default_address ON addresses (user_id) WHERE is_default;

-- Cài đặt cá nhân: bật/tắt thông báo theo loại, giao diện sáng/tối
CREATE TABLE user_settings (
    user_id        BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    notify_prefs   JSONB NOT NULL DEFAULT '{"ORDER":true,"OFFER":true,"MESSAGE":true,"SYSTEM":true}',
    theme          VARCHAR(10) NOT NULL DEFAULT 'SYSTEM'
                   CHECK (theme IN ('LIGHT', 'DARK', 'SYSTEM'))
);

-- Ví nội bộ: mỗi user 1 ví, tách "khả dụng" và "đang bị giữ"
CREATE TABLE wallets (
    user_id     BIGINT PRIMARY KEY REFERENCES users(id),
    available   BIGINT NOT NULL DEFAULT 0 CHECK (available >= 0),  -- tiền dùng/rút được
    held        BIGINT NOT NULL DEFAULT 0 CHECK (held >= 0),       -- tiền đang bị giữ (escrow)
    version     INT    NOT NULL DEFAULT 0                          -- optimistic locking cho ví
);

-- ============================================================
-- 2. DANH MỤC VÀ TIN ĐĂNG
-- ============================================================
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    parent_id   INT REFERENCES categories(id),              -- danh mục cha (cây danh mục)
    name        VARCHAR(100) NOT NULL
);

CREATE TABLE listings (
    id               BIGSERIAL PRIMARY KEY,
    seller_id        BIGINT NOT NULL REFERENCES users(id),  -- người bán
    category_id      INT    NOT NULL REFERENCES categories(id),
    title            VARCHAR(200) NOT NULL,
    description      TEXT,
    price            BIGINT NOT NULL CHECK (price > 0),     -- giá niêm yết
    retail_price     BIGINT CHECK (retail_price > 0),       -- giá mua mới tham khảo (hiện gạch ngang trên thẻ)
    allow_offers     BOOLEAN NOT NULL DEFAULT TRUE,         -- cho phép trả giá
    min_accept_price BIGINT CHECK (min_accept_price > 0),   -- giá thấp nhất chấp nhận, CHỈ người bán thấy
    condition        VARCHAR(20) NOT NULL
                     CHECK (condition IN ('NEW_99', 'VERY_GOOD', 'GOOD', 'FAIR')), -- Như mới/Rất tốt/Tốt/Trầy xước
    status           VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
                     CHECK (status IN ('ACTIVE', 'RESERVED', 'SOLD', 'HIDDEN')),
    version          INT NOT NULL DEFAULT 0,                -- optimistic locking
    province         VARCHAR(100),                          -- vị trí hiển thị
    district         VARCHAR(100),
    latitude         DOUBLE PRECISION,                      -- tọa độ để tính khoảng cách
    longitude        DOUBLE PRECISION,
    view_count       INT NOT NULL DEFAULT 0,                -- lượt xem (hiện ở dashboard người bán)
    bumped_at        TIMESTAMPTZ NOT NULL DEFAULT now(),    -- "đẩy tin": sắp xếp theo cột này thay vì created_at
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (min_accept_price IS NULL OR min_accept_price <= price)  -- giá sàn không vượt giá niêm yết
);
-- Index hỗ trợ tìm kiếm tiêu đề gần đúng, không dấu
CREATE INDEX idx_listings_title_trgm ON listings USING gin (unaccent(title) gin_trgm_ops);
CREATE INDEX idx_listings_status_cat ON listings (status, category_id);
CREATE INDEX idx_listings_seller     ON listings (seller_id, status);  -- tab "Tin của tôi"
CREATE INDEX idx_listings_bumped     ON listings (bumped_at DESC) WHERE status = 'ACTIVE';

CREATE TABLE listing_images (
    id          BIGSERIAL PRIMARY KEY,
    listing_id  BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    phash       BIGINT,                                     -- perceptual hash để phát hiện ảnh trùng
    sort_order  INT NOT NULL DEFAULT 0                      -- ảnh có sort_order nhỏ nhất là ảnh bìa
);

-- Bản nháp tin đăng: lưu cả form dạng JSON nên không cần ép đủ các cột bắt buộc
CREATE TABLE listing_drafts (
    id          BIGSERIAL PRIMARY KEY,
    seller_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payload     JSONB NOT NULL,                             -- toàn bộ dữ liệu form đăng tin
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()          -- "Đã lưu nháp lúc ..."
);

-- Yêu thích (thả tim)
CREATE TABLE favorites (
    user_id        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id     BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    price_at_save  BIGINT NOT NULL,                         -- giá lúc thả tim, để hiện nhãn "Giảm giá"
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, listing_id)                       -- mỗi người thả tim 1 lần / tin
);

-- Lưu tìm kiếm (bộ lọc người dùng muốn giữ lại)
CREATE TABLE saved_searches (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    keyword     VARCHAR(200),
    filters     JSONB NOT NULL DEFAULT '{}',                -- danh mục, khoảng giá, tình trạng, khoảng cách
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. TRẢ GIÁ
-- ============================================================
CREATE TABLE offers (
    id          BIGSERIAL PRIMARY KEY,
    listing_id  BIGINT NOT NULL REFERENCES listings(id),
    buyer_id    BIGINT NOT NULL REFERENCES users(id),
    amount      BIGINT NOT NULL CHECK (amount > 0),         -- giá đang đề nghị
    message     VARCHAR(500),                               -- lời nhắn cho người bán
    status      VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'EXPIRED')),
    made_by     VARCHAR(10) NOT NULL DEFAULT 'BUYER'
                CHECK (made_by IN ('BUYER', 'SELLER')),     -- ai đưa ra mức giá này (trả giá lại là SELLER)
    parent_id   BIGINT REFERENCES offers(id),               -- trỏ tới offer trước đó khi trả giá qua lại
    expires_at  TIMESTAMPTZ NOT NULL,                       -- hết hạn thì job tự chuyển EXPIRED
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_offers_listing ON offers (listing_id, status);
CREATE INDEX idx_offers_buyer   ON offers (buyer_id, status);   -- trang "Đề nghị của tôi"

-- ============================================================
-- 4. ĐƠN HÀNG (state machine) VÀ GIAO HÀNG
-- ============================================================
CREATE TABLE orders (
    id                BIGSERIAL PRIMARY KEY,
    listing_id        BIGINT NOT NULL REFERENCES listings(id),
    buyer_id          BIGINT NOT NULL REFERENCES users(id),
    seller_id         BIGINT NOT NULL REFERENCES users(id),
    offer_id          BIGINT REFERENCES offers(id),         -- offer được chấp nhận (nếu đơn đến từ trả giá)
    price             BIGINT NOT NULL CHECK (price > 0),    -- giá chốt cuối cùng (sau trả giá)
    shipping_fee      BIGINT NOT NULL DEFAULT 0,            -- phí vận chuyển
    platform_fee      BIGINT NOT NULL DEFAULT 0,            -- phí bảo vệ Escrow / phí sàn
    total_amount      BIGINT NOT NULL,                      -- tổng người mua phải trả = price + shipping_fee + platform_fee
    status            VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT'
                      CHECK (status IN ('PENDING_PAYMENT', 'PAID_HELD', 'SHIPPED', 'DELIVERED',
                                        'COMPLETED', 'DISPUTED', 'REFUNDED', 'CANCELLED')),
        -- PENDING_PAYMENT -> PAID_HELD -> SHIPPED -> DELIVERED
        -- -> COMPLETED (giải ngân) | DISPUTED | REFUNDED | CANCELLED
    delivery_method   VARCHAR(10) NOT NULL DEFAULT 'SHIPPING'
                      CHECK (delivery_method IN ('SHIPPING', 'MEETUP')), -- giao qua vận chuyển / hẹn gặp trực tiếp
    shipping_address  JSONB,                                -- ảnh chụp (snapshot) địa chỉ lúc đặt, sửa địa chỉ sau không ảnh hưởng đơn cũ
    buyer_note        VARCHAR(500),                         -- ghi chú của người mua
    carrier           VARCHAR(50),                          -- đơn vị vận chuyển
    tracking_code     VARCHAR(100),                         -- mã vận đơn (người bán nhập khi bấm "Đã gửi hàng")
    reserved_until    TIMESTAMPTZ NOT NULL,                 -- hết hạn giữ hàng nếu chưa thanh toán
    auto_release_at   TIMESTAMPTZ,                          -- tự giải ngân nếu người mua im lặng
    paid_at           TIMESTAMPTZ,
    shipped_at        TIMESTAMPTZ,
    delivered_at      TIMESTAMPTZ,
    completed_at      TIMESTAMPTZ,
    idempotency_key   VARCHAR(64) NOT NULL UNIQUE,          -- chống tạo trùng đơn khi bấm nhiều lần
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (total_amount = price + shipping_fee + platform_fee)   -- chặn sai lệch số tiền ngay ở DB
);
CREATE INDEX idx_orders_buyer  ON orders (buyer_id, status);    -- trang "Đơn mua"
CREATE INDEX idx_orders_seller ON orders (seller_id, status);   -- tab "Đơn bán"
CREATE INDEX idx_orders_expiry ON orders (reserved_until) WHERE status = 'PENDING_PAYMENT'; -- job hủy đơn quá hạn
-- QUAN TRỌNG: mỗi tin chỉ có TỐI ĐA 1 đơn đang hoạt động => chống 2 người mua cùng lúc
CREATE UNIQUE INDEX uq_one_active_order_per_listing
    ON orders (listing_id)
    WHERE status IN ('PENDING_PAYMENT', 'PAID_HELD', 'SHIPPED', 'DELIVERED', 'DISPUTED');

-- Lịch sử chuyển trạng thái, phục vụ audit và giải quyết khiếu nại
CREATE TABLE order_status_history (
    id          BIGSERIAL PRIMARY KEY,
    order_id    BIGINT NOT NULL REFERENCES orders(id),
    from_status VARCHAR(30),
    to_status   VARCHAR(30) NOT NULL,
    actor_id    BIGINT REFERENCES users(id),                -- ai thực hiện (NULL nếu hệ thống tự chạy)
    note        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. THANH TOÁN, SỔ CÁI ESCROW, RÚT TIỀN
-- ============================================================
CREATE TABLE payments (
    id            BIGSERIAL PRIMARY KEY,
    order_id      BIGINT NOT NULL REFERENCES orders(id),
    provider      VARCHAR(20) NOT NULL
                  CHECK (provider IN ('PAYOS', 'VNPAY', 'MOMO')),
    provider_ref  VARCHAR(100) UNIQUE,                      -- mã giao dịch bên cổng, chống xử lý webhook 2 lần
    amount        BIGINT NOT NULL,
    status        VARCHAR(20) NOT NULL
                  CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    raw_payload   JSONB,                                    -- lưu nguyên webhook để đối soát
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Yêu cầu rút tiền. Demo chỉ lưu số tài khoản đã che; hệ thống thật phải mã hóa/tokenize
CREATE TABLE withdrawals (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    amount          BIGINT NOT NULL CHECK (amount > 0),
    bank_code       VARCHAR(20) NOT NULL,
    account_masked  VARCHAR(30) NOT NULL,                   -- ví dụ ******1234
    account_holder  VARCHAR(120) NOT NULL,
    status          VARCHAR(12) NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sổ cái chỉ thêm, không sửa/xóa: số dư luôn truy ngược được
CREATE TABLE ledger_entries (
    id             BIGSERIAL PRIMARY KEY,
    order_id       BIGINT REFERENCES orders(id),
    withdrawal_id  BIGINT REFERENCES withdrawals(id),       -- dòng WITHDRAW trỏ về yêu cầu rút tiền
    user_id        BIGINT NOT NULL REFERENCES users(id),
    type           VARCHAR(20) NOT NULL
                   CHECK (type IN ('HOLD', 'RELEASE', 'REFUND', 'FEE', 'WITHDRAW')),
    amount         BIGINT NOT NULL,                         -- dương = cộng, âm = trừ
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ledger_user ON ledger_entries (user_id, created_at DESC);  -- lịch sử giao dịch ví
-- Chống giải ngân/giữ tiền 2 lần cho cùng một đơn
CREATE UNIQUE INDEX uq_ledger_hold_once    ON ledger_entries (order_id) WHERE type = 'HOLD';
CREATE UNIQUE INDEX uq_ledger_release_once ON ledger_entries (order_id) WHERE type = 'RELEASE';

-- ============================================================
-- 6. KHIẾU NẠI
-- ============================================================
CREATE TABLE disputes (
    id                  BIGSERIAL PRIMARY KEY,
    order_id            BIGINT NOT NULL UNIQUE REFERENCES orders(id),   -- mỗi đơn tối đa 1 khiếu nại
    opened_by           BIGINT NOT NULL REFERENCES users(id),
    reason              VARCHAR(30) NOT NULL
                        CHECK (reason IN ('NOT_AS_DESCRIBED', 'DEFECTIVE', 'NOT_RECEIVED', 'COUNTERFEIT', 'OTHER')),
    description         TEXT NOT NULL,
    desired_resolution  VARCHAR(20) NOT NULL
                        CHECK (desired_resolution IN ('REFUND_FULL', 'REFUND_PARTIAL', 'RETURN')),
    status              VARCHAR(20) NOT NULL DEFAULT 'OPEN'
                        CHECK (status IN ('OPEN', 'REVIEWING', 'WAITING_SELLER', 'RESOLVED')),
    resolution          VARCHAR(20)
                        CHECK (resolution IN ('REFUND_FULL', 'REFUND_PARTIAL', 'RELEASE_TO_SELLER', 'RETURN')),
    refund_amount       BIGINT CHECK (refund_amount >= 0),  -- số tiền hoàn nếu hoàn một phần
    resolved_by         BIGINT REFERENCES users(id),        -- admin xử lý
    due_at              TIMESTAMPTZ,                        -- hạn xử lý
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at         TIMESTAMPTZ
);

-- Trao đổi giữa hai bên (và admin) trong khiếu nại
CREATE TABLE dispute_messages (
    id          BIGSERIAL PRIMARY KEY,
    dispute_id  BIGINT NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id   BIGINT NOT NULL REFERENCES users(id),
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ảnh/video bằng chứng
CREATE TABLE dispute_evidence (
    id          BIGSERIAL PRIMARY KEY,
    dispute_id  BIGINT NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    uploader_id BIGINT NOT NULL REFERENCES users(id),
    url         TEXT NOT NULL,
    media_type  VARCHAR(10) NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO'))
);

-- ============================================================
-- 7. ĐÁNH GIÁ
-- ============================================================
CREATE TABLE reviews (
    id           BIGSERIAL PRIMARY KEY,
    order_id     BIGINT NOT NULL REFERENCES orders(id),
    reviewer_id  BIGINT NOT NULL REFERENCES users(id),
    reviewee_id  BIGINT NOT NULL REFERENCES users(id),
    rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    tags         TEXT[] NOT NULL DEFAULT '{}',              -- thẻ chọn nhanh: Đúng mô tả, Đóng gói cẩn thận...
    comment      TEXT,
    image_urls   TEXT[] NOT NULL DEFAULT '{}',              -- ảnh đính kèm
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (order_id, reviewer_id)                          -- mỗi người đánh giá 1 lần / đơn
);
CREATE INDEX idx_reviews_reviewee ON reviews (reviewee_id, created_at DESC);  -- tab "Đánh giá" ở hồ sơ

-- ============================================================
-- 8. CHAT
-- ============================================================
CREATE TABLE conversations (
    id               BIGSERIAL PRIMARY KEY,
    listing_id       BIGINT NOT NULL REFERENCES listings(id),
    buyer_id         BIGINT NOT NULL REFERENCES users(id),
    seller_id        BIGINT NOT NULL REFERENCES users(id),
    last_message_at  TIMESTAMPTZ NOT NULL DEFAULT now(),    -- sắp xếp danh sách cuộc trò chuyện
    UNIQUE (listing_id, buyer_id)                           -- 1 cuộc chat / người mua / tin
);

CREATE TABLE messages (
    id               BIGSERIAL PRIMARY KEY,
    conversation_id  BIGINT NOT NULL REFERENCES conversations(id),
    sender_id        BIGINT NOT NULL REFERENCES users(id),
    type             VARCHAR(15) NOT NULL DEFAULT 'TEXT'
                     CHECK (type IN ('TEXT', 'IMAGE', 'OFFER', 'ORDER_UPDATE', 'SYSTEM')),
    content          TEXT,                                  -- nội dung chữ (NULL nếu là ảnh)
    image_url        TEXT,                                  -- dùng cho tin nhắn ảnh
    offer_id         BIGINT REFERENCES offers(id),          -- tin nhắn dạng thẻ đề nghị giá
    order_id         BIGINT REFERENCES orders(id),          -- tin nhắn dạng cập nhật đơn
    is_flagged       BOOLEAN NOT NULL DEFAULT FALSE,        -- nghi lừa đảo (số tài khoản, kéo ra ngoài nền tảng)
    read_at          TIMESTAMPTZ,                           -- NULL = chưa đọc (chấm chưa đọc, "đã đọc")
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_conv_time ON messages (conversation_id, created_at);

-- ============================================================
-- 9. THÔNG BÁO
-- ============================================================
CREATE TABLE notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(10) NOT NULL
                CHECK (type IN ('ORDER', 'OFFER', 'MESSAGE', 'SYSTEM')),   -- nhóm hiển thị trên giao diện
    title       VARCHAR(200) NOT NULL,
    body        TEXT,
    ref_type    VARCHAR(20),                                -- bấm vào dẫn tới đâu: ORDER / OFFER / CONVERSATION / DISPUTE
    ref_id      BIGINT,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user ON notifications (user_id, is_read, created_at DESC);

-- ============================================================
-- 10. BÁO CÁO VI PHẠM (cho admin xử lý)
-- ============================================================
CREATE TABLE reports (
    id                BIGSERIAL PRIMARY KEY,
    reporter_id       BIGINT NOT NULL REFERENCES users(id),
    reported_user_id  BIGINT REFERENCES users(id),          -- "Báo cáo người dùng" ở hồ sơ người bán
    listing_id        BIGINT REFERENCES listings(id),
    reason            VARCHAR(50) NOT NULL,                 -- SCAM / FAKE / PROHIBITED ...
    details           TEXT,
    status            VARCHAR(20) NOT NULL DEFAULT 'OPEN'
                      CHECK (status IN ('OPEN', 'REVIEWING', 'RESOLVED', 'DISMISSED')),
    resolved_by       BIGINT REFERENCES users(id),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (reported_user_id IS NOT NULL OR listing_id IS NOT NULL)  -- phải báo cáo một người hoặc một tin
);

-- ============================================================
-- 11. OUTBOX (nếu sau này dùng Kafka/RabbitMQ)
-- ============================================================
CREATE TABLE outbox_events (
    id            BIGSERIAL PRIMARY KEY,
    aggregate     VARCHAR(50) NOT NULL,                     -- ví dụ 'order'
    aggregate_id  BIGINT NOT NULL,
    event_type    VARCHAR(50) NOT NULL,                     -- ví dụ 'ORDER_PAID'
    payload       JSONB NOT NULL,
    published     BOOLEAN NOT NULL DEFAULT FALSE,           -- worker đọc bản ghi chưa publish rồi gửi đi
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_outbox_unpublished ON outbox_events (id) WHERE NOT published;