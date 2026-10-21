import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  ArrowLeft, 
  MapPin, 
  Truck, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  QrCode, 
  Sparkles,
  Lock,
  RefreshCw,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { formatVND, getConditionStyle } from '../utils/formatters';

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAID_HELD: 'PAID_HELD',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  DISPUTED: 'DISPUTED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED'
};

export default function CheckoutScreen({ 
  product, 
  onBack, 
  onViewOrderTracking,
  onBackHome
}) {
  // Mock fallback product if accessed directly
  const item = product || {
    id: 'prod_101',
    title: 'iPhone 14 Pro Max 128GB Tím Deep Purple',
    price: 17800000,
    originalPrice: 29990000,
    condition: 'EXCELLENT',
    conditionLabel: 'Rất tốt (95%)',
    distanceKm: 1.4,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'],
    seller: {
      name: 'Hoàng Nam Tech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    }
  };

  // 15 minutes hold countdown timer
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 59);
  const [isHoldExpired, setIsHoldExpired] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('Nguyễn Xuân Sơn');
  const [phone, setPhone] = useState('0988 888 287');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận Bình Thạnh');
  const [ward, setWard] = useState('Phường 22');
  const [streetAddress, setStreetAddress] = useState('Tòa Landmark 81, 720A Điện Biên Phủ');
  const [orderNotes, setOrderNotes] = useState('Gọi trước khi giao hàng 15 phút');

  // Shipping Method: 'delivery' (35k) | 'pickup' (0k)
  const [shippingMethod, setShippingMethod] = useState('delivery');

  // Payment Method: 'payos' | 'vnpay' | 'momo'
  const [paymentMethod, setPaymentMethod] = useState('payos');

  // Checkout flow states: 'input' | 'processing' | 'success' | 'error'
  const [checkoutStep, setCheckoutStep] = useState('input');
  const [errorType, setErrorType] = useState(null); // 'payment_failed' | 'hold_expired' | 'concurrency_sold'
  const [createdOrderCode, setCreatedOrderCode] = useState('ORD-8829-VN');

  // Timer effect
  useEffect(() => {
    if (checkoutStep !== 'input') return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsHoldExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [checkoutStep]);

  // Format seconds to MM:SS
  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fees calculation
  const shippingFee = shippingMethod === 'delivery' ? 35000 : 0;
  const escrowFee = 0; // Free promotion
  const totalAmount = item.price + shippingFee + escrowFee;
  const conditionStyle = getConditionStyle(item.condition);

  // Handle Submit Order
  const handlePayNow = (forcedError = null) => {
    if (isHoldExpired) {
      setCheckoutStep('error');
      setErrorType('hold_expired');
      return;
    }

    setCheckoutStep('processing');

    // Simulate Payment Gateway API Call
    setTimeout(() => {
      if (forcedError) {
        setCheckoutStep('error');
        setErrorType(forcedError);
      } else {
        const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}-VN`;
        setCreatedOrderCode(orderId);
        setCheckoutStep('success');
      }
    }, 1400);
  };

  // RENDER STEP 1: PROCESSING LOADING
  if (checkoutStep === 'processing') {
    return (
      <div className="checkout-loading-screen">
        <div className="checkout-loading-box">
          <div className="checkout-spinner" />
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginTop: '20px', color: 'var(--text-main)' }}>
            Đang kết nối cổng thanh toán {paymentMethod.toUpperCase()}...
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '340px' }}>
            Hệ thống đang tạo mã giữ hàng độc quyền và khóa an toàn số tiền vào ví trung gian Reown Escrow.
          </p>
          <div className="escrow-secured-pill-large">
            <ShieldCheck size={16} color="#0D9488" />
            <span>Bảo vệ quyền lợi người mua 100%</span>
          </div>
        </div>
      </div>
    );
  }

  // RENDER STEP 2: CHECKOUT SUCCESS SCREEN
  if (checkoutStep === 'success') {
    return (
      <div className="checkout-result-container">
        <div className="checkout-result-card">
          <div className="checkout-success-icon-wrap">
            <CheckCircle2 size={46} color="#16A34A" />
          </div>

          <span className="checkout-status-pill success">
            Trạng thái: {ORDER_STATUS.PAID_HELD}
          </span>

          <h2 className="checkout-result-title">
            Thanh toán & Giữ tiền Escrow thành công!
          </h2>

          <p className="checkout-result-desc">
            Tiền của bạn đã được chuyển vào ví trung gian Reown Escrow an toàn. Người bán đã nhận được thông báo để chuẩn bị gửi hàng.
          </p>

          <div className="checkout-order-summary-box">
            <div className="summary-row">
              <span className="summary-label">Mã đơn hàng:</span>
              <strong className="summary-val-badge">{createdOrderCode}</strong>
            </div>

            <div className="summary-row">
              <span className="summary-label">Sản phẩm:</span>
              <span className="summary-val-text">{item.title}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Phương thức giao hàng:</span>
              <span className="summary-val-text">
                {shippingMethod === 'delivery' ? 'Giao qua ĐVVC (GHTK)' : 'Hẹn gặp trực tiếp'}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Cổng thanh toán:</span>
              <span className="summary-val-text" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
                {paymentMethod} (Sandbox)
              </span>
            </div>

            <div className="summary-row total-highlight">
              <span className="summary-label">Số tiền Escrow đang giữ:</span>
              <strong className="summary-val-price">{formatVND(totalAmount)}</strong>
            </div>
          </div>

          {/* Escrow 3-step timeline note */}
          <div className="checkout-escrow-reminder">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F766E', fontWeight: 700, fontSize: '13px' }}>
              <ShieldCheck size={16} />
              <span>Cơ chế bảo vệ tiếp theo</span>
            </div>
            <p style={{ fontSize: '12px', color: '#0F766E', marginTop: '4px', lineHeight: '1.45' }}>
              Khi nhận kiện hàng, bạn có <strong>48 giờ</strong> kiểm tra thực tế (màn hình, cảm ứng, tính năng). Chỉ khi bạn bấm <strong>"Xác nhận đã nhận hàng"</strong> thì tiền mới được chuyển cho người bán.
            </p>
          </div>

          <div className="checkout-action-buttons">
            <button
              type="button"
              className="btn-primary"
              onClick={() => onViewOrderTracking && onViewOrderTracking(createdOrderCode)}
              style={{ width: '100%' }}
            >
              <Truck size={17} style={{ marginRight: '6px' }} />
              <span>Theo dõi đơn hàng & Timeline Escrow</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={onBackHome}
              style={{ width: '100%', marginTop: '10px' }}
            >
              <span>Về trang chủ mua sắm</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER STEP 3: CHECKOUT ERROR SCREEN
  if (checkoutStep === 'error') {
    let errorTitle = 'Thanh toán không thành công';
    let errorDesc = 'Giao dịch qua cổng thanh toán bị gián đoạn hoặc tài khoản thẻ bị từ chối.';
    let errorIcon = <XCircle size={46} color="#DC2626" />;

    if (errorType === 'hold_expired') {
      errorTitle = 'Hết thời gian giữ hàng độc quyền';
      errorDesc = 'Thời gian giữ món hàng trong 15 phút đã kết thúc. Hệ thống đã nhả món hàng về trạng thái mở để đảm bảo công bằng cho người mua khác.';
      errorIcon = <Clock size={46} color="#D97706" />;
    } else if (errorType === 'concurrency_sold') {
      errorTitle = 'Món đồ vừa có người khác chốt mua';
      errorDesc = 'Do đồ 2hand là duy nhất (số lượng = 1), một người mua khác đã hoàn tất thanh toán trước bạn 5 giây. Hệ thống đã tự động từ chối để tránh bán trùng.';
      errorIcon = <AlertCircle size={46} color="#DC2626" />;
    }

    return (
      <div className="checkout-result-container">
        <div className="checkout-result-card">
          <div className="checkout-error-icon-wrap">
            {errorIcon}
          </div>

          <span className="checkout-status-pill error">
            Lỗi giao dịch ({errorType || 'PAYMENT_FAILED'})
          </span>

          <h2 className="checkout-result-title">{errorTitle}</h2>
          <p className="checkout-result-desc">{errorDesc}</p>

          <div className="checkout-action-buttons" style={{ marginTop: '24px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setCheckoutStep('input');
                setSecondsLeft(14 * 60 + 59);
                setIsHoldExpired(false);
              }}
              style={{ width: '100%' }}
            >
              <RefreshCw size={16} style={{ marginRight: '6px' }} />
              <span>Thử thanh toán lại</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={onBackHome}
              style={{ width: '100%', marginTop: '10px' }}
            >
              <span>Quay lại trang tìm kiếm</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER STEP 4: MAIN CHECKOUT FORM (DESKTOP 2-COLUMN / MOBILE 1-COLUMN)
  return (
    <div className="checkout-page-container">
      {/* Top Hold Countdown Alert Banner */}
      <div className={`checkout-countdown-banner ${isHoldExpired ? 'expired' : ''}`}>
        <div className="countdown-banner-inner">
          <div className="countdown-left">
            <Clock size={18} className={isHoldExpired ? '' : 'pulse-timer-icon'} />
            <div>
              <strong>{isHoldExpired ? 'Hết thời hạn giữ hàng!' : 'Món đồ đang được giữ độc quyền cho bạn:'}</strong>
              <span className="countdown-digits">
                {isHoldExpired ? '00:00' : formatTimer(secondsLeft)}
              </span>
            </div>
          </div>
          <span className="countdown-hint">
            {isHoldExpired 
              ? 'Hàng đã được nhả cho người khác' 
              : 'Tránh người khác tranh mua món hàng duy nhất này'}
          </span>
        </div>
      </div>

      {/* Navigation Top Bar */}
      <div className="checkout-top-nav">
        <button type="button" className="checkout-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Quay lại</span>
        </button>
        <h1 className="checkout-page-heading">Thanh toán an toàn qua Escrow</h1>
        <div className="checkout-escrow-trust-tag">
          <ShieldCheck size={14} />
          <span>Bảo vệ 100%</span>
        </div>
      </div>

      {/* Main Layout 2 Columns on Desktop */}
      <div className="checkout-layout-grid">
        {/* CỘT TRÁI (DESKTOP) / KHỐI FORM: 3 BƯỚC LIỀN MẠCH */}
        <div className="checkout-left-form-column">
          {/* BƯỚC 1: THÔNG TIN NHẬN HÀNG */}
          <section className="checkout-card-section">
            <div className="section-title-wrap">
              <div className="step-number-badge">1</div>
              <h2 className="section-main-title">Thông tin nhận hàng</h2>
            </div>

            <div className="checkout-form-grid">
              <div className="form-group-half">
                <label>Họ và tên người nhận</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên..."
                  className="checkout-text-input"
                />
              </div>

              <div className="form-group-half">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Số điện thoại nhận hàng..."
                  className="checkout-text-input"
                />
              </div>

              <div className="form-group-third">
                <label>Tỉnh / Thành phố</label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="checkout-text-input"
                />
              </div>

              <div className="form-group-third">
                <label>Quận / Huyện</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="checkout-text-input"
                />
              </div>

              <div className="form-group-third">
                <label>Phường / Xã</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="checkout-text-input"
                />
              </div>

              <div className="form-group-full">
                <label>Địa chỉ cụ thể (Số nhà, tên đường, toà nhà)</label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Ví dụ: Tòa Landmark 81, số 720A..."
                  className="checkout-text-input"
                />
              </div>

              <div className="form-group-full">
                <label>Ghi chú cho người bán / shipper (Tùy chọn)</label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, bọc chống sốc kỹ giúp em..."
                  className="checkout-text-input"
                />
              </div>
            </div>
          </section>

          {/* BƯỚC 2: PHƯƠNG THỨC GIAO HÀNG */}
          <section className="checkout-card-section">
            <div className="section-title-wrap">
              <div className="step-number-badge">2</div>
              <h2 className="section-main-title">Phương thức giao hàng</h2>
            </div>

            <div className="shipping-options-list">
              {/* Option 1: Vận chuyển */}
              <label 
                className={`shipping-option-card ${shippingMethod === 'delivery' ? 'selected' : ''}`}
                onClick={() => setShippingMethod('delivery')}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={shippingMethod === 'delivery'}
                  onChange={() => setShippingMethod('delivery')}
                />
                <div className="shipping-icon-box">
                  <Truck size={22} color="#0D9488" />
                </div>
                <div className="shipping-text-box">
                  <div className="shipping-title-row">
                    <strong>Giao qua đơn vị vận chuyển (GHTK / Viettel Post)</strong>
                    <span className="shipping-fee-bold">35.000 ₫</span>
                  </div>
                  <p className="shipping-desc-text">
                    Thời gian dự kiến: 1 – 2 ngày. Có mã vận đơn kiểm tra trực tiếp hành trình kiện hàng.
                  </p>
                </div>
              </label>

              {/* Option 2: Gặp trực tiếp */}
              <label 
                className={`shipping-option-card ${shippingMethod === 'pickup' ? 'selected' : ''}`}
                onClick={() => setShippingMethod('pickup')}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={shippingMethod === 'pickup'}
                  onChange={() => setShippingMethod('pickup')}
                />
                <div className="shipping-icon-box">
                  <Users size={22} color="#0369A1" />
                </div>
                <div className="shipping-text-box">
                  <div className="shipping-title-row">
                    <strong>Hẹn gặp trực tiếp kiểm tra hàng</strong>
                    <span className="shipping-fee-free">Miễn phí (0 ₫)</span>
                  </div>
                  <p className="shipping-desc-text">
                    Hai bên hẹn gặp tại nơi công cộng. Bạn cầm nắm, test thử máy ok rồi mới bấm giải ngân tiền trên app.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* BƯỚC 3: PHƯƠNG THỨC THANH TOÁN (PAYOS, VNPAY, MOMO) */}
          <section className="checkout-card-section">
            <div className="section-title-wrap">
              <div className="step-number-badge">3</div>
              <h2 className="section-main-title">Phương thức thanh toán</h2>
            </div>

            <div className="payment-gateways-list">
              {/* PayOS */}
              <label 
                className={`payment-gateway-card ${paymentMethod === 'payos' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('payos')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'payos'}
                  onChange={() => setPaymentMethod('payos')}
                />
                <div className="payment-logo-badge payos">
                  <QrCode size={20} />
                  <span>VietQR / PayOS</span>
                </div>
                <div className="payment-details">
                  <div className="payment-title">Chuyển khoản VietQR tự động qua PayOS</div>
                  <div className="payment-sub">Mở app ngân hàng quét mã QR, hệ thống duyệt tiền vào Escrow sau 2 giây</div>
                </div>
                <span className="payment-tag-fast">Khuyên dùng</span>
              </label>

              {/* VNPay */}
              <label 
                className={`payment-gateway-card ${paymentMethod === 'vnpay' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('vnpay')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'vnpay'}
                  onChange={() => setPaymentMethod('vnpay')}
                />
                <div className="payment-logo-badge vnpay">
                  <CreditCard size={20} />
                  <span>VNPay-QR</span>
                </div>
                <div className="payment-details">
                  <div className="payment-title">Cổng thanh toán VNPay</div>
                  <div className="payment-sub">Hỗ trợ thẻ ATM nội địa, Visa/Mastercard và quét mã QR ngân hàng</div>
                </div>
              </label>

              {/* MoMo */}
              <label 
                className={`payment-gateway-card ${paymentMethod === 'momo' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('momo')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'momo'}
                  onChange={() => setPaymentMethod('momo')}
                />
                <div className="payment-logo-badge momo">
                  <Sparkles size={20} />
                  <span>Ví MoMo</span>
                </div>
                <div className="payment-details">
                  <div className="payment-title">Ví điện tử MoMo</div>
                  <div className="payment-sub">Thanh toán một chạm qua ứng dụng ví MoMo</div>
                </div>
              </label>
            </div>
          </section>

          {/* SIMULATOR KIỂM TRA LỖI (DÀNH CHO ĐẠI CA TEST NHANH CÁC CASE BÀI TOÁN) */}
          <div className="checkout-simulator-debug-box">
            <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
              🧪 Công cụ kiểm thử các kịch bản lỗi thanh toán / bài toán Escrow:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              <button
                type="button"
                className="btn-sim-test"
                onClick={() => handlePayNow('payment_failed')}
              >
                Test: Cổng từ chối thanh toán
              </button>
              <button
                type="button"
                className="btn-sim-test"
                onClick={() => handlePayNow('hold_expired')}
              >
                Test: Hết 15p giữ hàng (Job nhả hàng)
              </button>
              <button
                type="button"
                className="btn-sim-test"
                onClick={() => handlePayNow('concurrency_sold')}
              >
                Test: Tranh mua (Concurrency Conflict)
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (DESKTOP): THẺ TÓM TẮT ĐƠN HÀNG STICKY */}
        <div className="checkout-right-summary-column">
          <div className="sticky-order-summary-card">
            <h3 className="summary-card-title">Tóm tắt đơn hàng</h3>

            {/* Product Item Preview */}
            <div className="summary-product-item">
              <img src={item.images[0]} alt={item.title} className="summary-product-img" />
              <div className="summary-product-meta">
                <span
                  className="product-condition-tag"
                  style={{ color: conditionStyle.color, backgroundColor: conditionStyle.bg }}
                >
                  {conditionStyle.label}
                </span>
                <h4 className="summary-product-name">{item.title}</h4>
                <div className="summary-product-price-row">
                  <span className="summary-price-bold">{formatVND(item.price)}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="summary-original-price">{formatVND(item.originalPrice)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bill Lines */}
            <div className="summary-bill-lines">
              <div className="bill-line">
                <span>Tiền hàng chốt</span>
                <strong>{formatVND(item.price)}</strong>
              </div>

              <div className="bill-line">
                <span>Phí vận chuyển ({shippingMethod === 'delivery' ? 'ĐVVC' : 'Gặp trực tiếp'})</span>
                <span>{shippingFee > 0 ? formatVND(shippingFee) : '0 ₫ (Miễn phí)'}</span>
              </div>

              <div className="bill-line">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Phí bảo vệ Escrow Reown</span>
                  <HelpCircle size={13} color="#0D9488" title="Miễn phí bảo hiểm giữ tiền giao dịch an toàn" />
                </div>
                <span style={{ color: '#0D9488', fontWeight: 700 }}>0 ₫ (Được bảo hiểm)</span>
              </div>

              <div className="bill-line total-line">
                <span>Tổng thanh toán:</span>
                <strong className="total-price-large">{formatVND(totalAmount)}</strong>
              </div>
            </div>

            {/* Khối Escrow nổi bật 3 bước */}
            <div className="escrow-highlight-card">
              <div className="escrow-highlight-header">
                <div className="shield-circle-icon">
                  <ShieldCheck size={18} color="#0D9488" />
                </div>
                <div>
                  <strong>Bảo chứng Escrow Reown 100%</strong>
                  <p>Tiền của bạn luôn được bảo vệ tuyệt đối</p>
                </div>
              </div>

              <div className="escrow-steps-compact">
                <div className="escrow-mini-step">
                  <div className="mini-step-dot">1</div>
                  <span>Bạn thanh toán → tiền được giữ an toàn tại ví Escrow</span>
                </div>
                <div className="escrow-mini-step">
                  <div className="mini-step-dot">2</div>
                  <span>Người bán gửi hàng hoặc gặp mặt bàn giao</span>
                </div>
                <div className="escrow-mini-step">
                  <div className="mini-step-dot">3</div>
                  <span>Bạn kiểm tra ưng ý và xác nhận → tiền mới chuyển cho người bán</span>
                </div>
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              type="button"
              className="btn-pay-now-action"
              onClick={() => handlePayNow()}
              disabled={isHoldExpired}
            >
              <Lock size={17} />
              <span>Thanh toán {formatVND(totalAmount)} vào Escrow</span>
            </button>

            <p className="checkout-terms-note">
              Bằng việc bấm thanh toán, bạn đồng ý với Điều khoản giao dịch và Quy chế giải quyết khiếu nại của Reown Shop.
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM STICKY ACTION BAR */}
      <div className="checkout-mobile-bottom-bar">
        <div className="mobile-bar-price-info">
          <span className="mobile-bar-label">Tổng thanh toán:</span>
          <strong className="mobile-bar-total">{formatVND(totalAmount)}</strong>
        </div>
        <button
          type="button"
          className="mobile-btn-pay"
          onClick={() => handlePayNow()}
          disabled={isHoldExpired}
        >
          <Lock size={16} />
          <span>Thanh toán Escrow</span>
        </button>
      </div>
    </div>
  );
}
