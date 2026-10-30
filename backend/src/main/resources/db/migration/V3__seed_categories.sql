INSERT INTO categories (id, name) VALUES
    (1, 'Điện thoại'),
    (2, 'Laptop & Mac'),
    (3, 'Tai nghe & Loa'),
    (4, 'Máy ảnh & Lens'),
    (5, 'Đồng hồ'),
    (6, 'Máy tính bảng'),
    (7, 'Console & Game'),
    (8, 'Phụ kiện')
ON CONFLICT (id) DO NOTHING;

SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories));
