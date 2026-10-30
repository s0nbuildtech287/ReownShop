INSERT INTO users (id, email, full_name, phone, role, status)
VALUES
    (101, 'seller101@reownshop.local', 'Hoàng Nam Tech', '0900000101', 'USER', 'ACTIVE'),
    (102, 'seller102@reownshop.local', 'Minh Anh Store', '0900000102', 'USER', 'ACTIVE'),
    (103, 'seller103@reownshop.local', 'Laptop House', '0900000103', 'USER', 'ACTIVE'),
    (104, 'seller104@reownshop.local', 'Gadget Corner', '0900000104', 'USER', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));

INSERT INTO listings (
    id, seller_id, category_id, title, description, price, retail_price,
    allow_offers, min_accept_price, condition, status, province, district, view_count
)
VALUES
    (101, 101, 1, 'iPhone 14 Pro Max 128GB Deep Purple',
     'Máy chính chủ, đầy đủ hộp và cáp sạc. Bao test 7 ngày qua Escrow Reown.',
     17800000, 29990000, TRUE, 17000000, 'VERY_GOOD', 'ACTIVE', 'TP. Hồ Chí Minh', 'Quận 1', 290),
    (102, 103, 2, 'MacBook Air M2 16GB / 256GB Midnight 99%',
     'Pin 100%, máy nguyên bản chưa qua sửa chữa, phù hợp làm việc và học tập.',
     21500000, 28990000, TRUE, 20500000, 'NEW_99', 'ACTIVE', 'TP. Hồ Chí Minh', 'Quận Bình Thạnh', 420),
    (103, 101, 3, 'Tai nghe Sony WH-1000XM5 chống ồn',
     'Âm thanh và chống ồn ANC hoạt động hoàn hảo, tặng kèm hộp đựng cứng.',
     5200000, 8490000, TRUE, 4800000, 'GOOD', 'ACTIVE', 'TP. Hồ Chí Minh', 'Quận 3', 175),
    (104, 103, 4, 'Máy ảnh Sony Alpha A7 Mark III Body',
     'Cảm biến sạch, màn hình đã dán cường lực, đi kèm 2 pin và dock sạc đôi.',
     24500000, 38990000, FALSE, NULL, 'VERY_GOOD', 'ACTIVE', 'TP. Hồ Chí Minh', 'Quận Phú Nhuận', 310)
ON CONFLICT (id) DO NOTHING;

INSERT INTO listing_images (listing_id, url, sort_order)
VALUES
    (101, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', 0),
    (102, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', 0),
    (103, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80', 0),
    (104, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80', 0)
ON CONFLICT DO NOTHING;

SELECT setval('listings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM listings));
SELECT setval('listing_images_id_seq', (SELECT COALESCE(MAX(id), 1) FROM listing_images));
