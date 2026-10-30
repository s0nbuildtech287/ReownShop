# ReownShop — Việc còn thiếu

## 1. Việc cần làm ngoài máy

- [ ] Mở PowerShell bằng quyền Administrator.
- [ ] Bật Windows Virtual Machine Platform:
  `Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -All`
- [ ] Restart Windows.
- [ ] Mở Docker Desktop và kiểm tra Docker Engine ở trạng thái Running.
- [ ] Chạy `docker compose up -d` tại thư mục repo.
- [ ] Kiểm tra PostgreSQL `5432` và Redis `6379`.
- [ ] Cài Maven hoặc thêm Maven Wrapper cho backend.

## 2. Backend cần verify

- [ ] Compile và chạy Spring Boot.
- [ ] Kiểm tra Flyway chạy sạch migration `V1` đến `V13`.
- [ ] Kiểm tra `ddl-auto=validate` khớp entity với PostgreSQL.
- [ ] Test đăng ký, đăng nhập, JWT và tài khoản bị khóa.
- [ ] Test tìm kiếm không dấu, lọc, phân trang và listing detail.
- [ ] Test concurrency: nhiều người mua cùng một listing chỉ có một order thành công.
- [ ] Test `Idempotency-Key` không tạo order trùng.
- [ ] Test payment sandbox và webhook lặp.
- [ ] Test state machine: giữ tiền → gửi hàng → giao hàng → hoàn tất → giải ngân.
- [ ] Test ledger không ghi `HOLD`/`RELEASE` trùng.
- [ ] Test offer, review, dispute, favorites, notifications và chat.
- [ ] Bổ sung unit test và integration test.

## 3. Frontend cần nối API thật

- [ ] Tạo API client dùng `VITE_API_BASE_URL`.
- [ ] Lưu JWT sau login và gửi `Authorization: Bearer <token>`.
- [ ] Thay `MOCK_PRODUCTS` bằng `GET /api/v1/listings`.
- [ ] Thay mock categories bằng `GET /api/v1/categories`.
- [ ] Nối auth với `/api/v1/auth/register`, `/login`, `/me`.
- [ ] Nối tạo listing với `POST /api/v1/listings`.
- [ ] Nối checkout, payment sandbox và order tracking.
- [ ] Nối offer, favorites, notifications, reviews và disputes.
- [ ] Nối chat REST và STOMP WebSocket `/ws`.
- [ ] Thêm loading, empty state, lỗi API và xử lý token hết hạn.
- [ ] Đảm bảo mọi entry point mua/đăng bán đều yêu cầu đăng nhập.

## 4. Bảo mật và dịch vụ thật

- [ ] Đổi `JWT_SECRET` mặc định bằng secret ngẫu nhiên.
- [ ] Đổi `PAYMENT_WEBHOOK_SECRET` mặc định.
- [ ] Không commit `.env` hoặc credential thanh toán.
- [ ] Cấu hình CORS theo domain production.
- [ ] Thêm rate limit cho login, order, webhook và chat.
- [ ] Tích hợp chữ ký webhook PayOS/VNPay/MoMo sandbox.
- [ ] Thêm storage ảnh thật: MinIO, Cloudflare R2 hoặc S3.
- [ ] Kiểm tra dung lượng, định dạng và tên file upload.

## 5. Production

- [ ] Thêm backend service vào `docker-compose.yml`.
- [ ] Thêm healthcheck cho backend, PostgreSQL và Redis.
- [ ] Thêm CI chạy build, test, lint và migration.
- [ ] Chạy load test bằng k6/JMeter.
- [ ] Chạy `EXPLAIN ANALYZE` cho tìm kiếm và order.
- [ ] Chạy Lighthouse trên landing/Home.
- [ ] Thêm logging, audit và monitoring.
- [ ] Viết README API, ADR và hướng dẫn chạy.
- [ ] Deploy demo và tạo tài khoản demo.

## Trạng thái hiện tại

- Backend đã có các module nền: Auth, Listing, Order, Payment/Escrow sandbox, Offer, Review, Dispute, Favorites, Notifications, Account và Chat.
- Frontend đã có landing page, animation/3D background và mock-data experience.
- Chưa compile/integration test backend vì Docker Engine và Maven chưa sẵn sàng.
