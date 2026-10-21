import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  ExternalLink, 
  MessageSquare, 
  Copy, 
  Check, 
  MapPin, 
  Package, 
  RotateCcw, 
  ChevronRight,
  Sparkles,
  HelpCircle,
  Star,
  X
} from 'lucide-react';
import { MOCK_ORDERS_FULL, ORDER_STATUS_DETAILS } from '../mocks/orderTracking';
import { formatVND } from '../utils/formatters';

export default function OrdersTrackingScreen({
  initialOrderId,
  onBackHome,
  onViewProduct,
  onChatWithSeller,
  onOpenDispute,
  onOpenReview
}) {
  const [orders, setOrders] = useState(MOCK_ORDERS_FULL);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId || MOCK_ORDERS_FULL[0]?.id);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [mobileShowDetail, setMobileShowDetail] = useState(Boolean(initialOrderId));
  const [copiedCode, setCopiedCode] = useState(false);

  // Confirm Release Dialog
  const [showConfirmReleaseDialog, setShowConfirmReleaseDialog] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // 48h Countdown timer state for DELIVERED order
  const [countdownSecs, setCountdownSecs] = useState(selectedOrder?.countdownSeconds || 36 * 3600);

  useEffect(() => {
    if (selectedOrder?.countdownSeconds) {
      setCountdownSecs(selectedOrder.countdownSeconds);
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (!countdownSecs || countdownSecs <= 0) return;
    const interval = setInterval(() => {
      setCountdownSecs((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownSecs]);

  // Format countdown into HH:MM:SS
  const formatCountdown = (totalSecs) => {
    if (!totalSecs) return '00:00:00';
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Copy tracking / order code
  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return o.status === filterStatus;
  });

  // Action: Confirm Receipt & Release Escrow Funds
  const handleConfirmReceipt = () => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === selectedOrder.id) {
          return {
            ...o,
            status: 'COMPLETED',
            timeline: o.timeline.map((t) => 
              t.key === 'COMPLETED' ? { ...t, completed: true, current: true, time: 'Vừa xong' } : { ...t, current: false }
            )
          };
        }
        return o;
      })
    );
    setShowConfirmReleaseDialog(false);
    setShowReviewModal(true);
  };

  // Simulator helper: Quick toggle order status for review
  const handleSimulateStatus = (newStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === selectedOrder.id) {
          let updatedCountdown = null;
          if (newStatus === 'DELIVERED') {
            updatedCountdown = 47 * 3600 + 59 * 60; // 48 hours
          }
          return {
            ...o,
            status: newStatus,
            countdownSeconds: updatedCountdown,
            timeline: o.timeline.map((t) => {
              if (t.key === newStatus) return { ...t, completed: true, current: true, time: 'Vừa cập nhật' };
              return t;
            })
          };
        }
        return o;
      })
    );
  };

  const statusInfo = ORDER_STATUS_DETAILS[selectedOrder?.status] || ORDER_STATUS_DETAILS.PAID_HELD;

  return (
    <div className="orders-page-container">
      {/* ================= TOP HEADER BAR ================= */}
      <div className="orders-header-bar">
        <div className="orders-header-left">
          <button type="button" className="btn-back-home" onClick={onBackHome}>
            <ArrowLeft size={17} />
            <span>Trang chủ</span>
          </button>
          <div>
            <h1 className="orders-page-title">Theo dõi đơn mua & Bảo chứng Escrow</h1>
            <p className="orders-page-sub">
              Toàn bộ tiền được bảo vệ an toàn 100% tại tài khoản Escrow cho đến khi bạn nhận và kiểm tra xong.
            </p>
          </div>
        </div>

        <div className="orders-escrow-trust-pill">
          <ShieldCheck size={16} color="#0D9488" />
          <span>Bảo hiểm Escrow 48h</span>
        </div>
      </div>

      {/* ================= FILTER TABS ================= */}
      <div className="orders-filter-tabs hide-scrollbar">
        {[
          { key: 'ALL', label: 'Tất cả đơn' },
          { key: 'PAID_HELD', label: 'Tiền trong Escrow' },
          { key: 'SHIPPED', label: 'Đang vận chuyển' },
          { key: 'DELIVERED', label: 'Chờ kiểm tra (48h)' },
          { key: 'COMPLETED', label: 'Đã hoàn tất' },
          { key: 'DISPUTED', label: 'Đang khiếu nại' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`order-tab-btn ${filterStatus === tab.key ? 'active' : ''}`}
            onClick={() => setFilterStatus(tab.key)}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= MAIN 2-COLUMN LAYOUT ================= */}
      <div className="orders-layout-grid">
        {/* CỘT TRÁI: DANH SÁCH ĐƠN HÀNG */}
        <div className={`orders-list-column ${mobileShowDetail ? 'mobile-hidden' : ''}`}>
          <div className="orders-list-title-row">
            <span>Danh sách đơn hàng ({filteredOrders.length})</span>
          </div>

          <div className="orders-cards-scroll-box hide-scrollbar">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const isSelected = order.id === selectedOrder?.id;
                const itemStatus = ORDER_STATUS_DETAILS[order.status] || ORDER_STATUS_DETAILS.PAID_HELD;

                return (
                  <div
                    key={order.id}
                    className={`order-summary-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setMobileShowDetail(true);
                    }}
                  >
                    <div className="order-card-top">
                      <span className="order-card-code">{order.orderCode}</span>
                      <span 
                        className="order-card-badge"
                        style={{ color: itemStatus.color, backgroundColor: itemStatus.bg }}
                      >
                        {itemStatus.label}
                      </span>
                    </div>

                    <div className="order-card-product-row">
                      <img src={order.product.image} alt={order.product.title} className="order-card-thumb" />
                      <div className="order-card-meta">
                        <h4 className="order-card-item-title">{order.product.title}</h4>
                        <div className="order-card-seller-name">Người bán: {order.seller.name}</div>
                        <div className="order-card-price-bold">{formatVND(order.payment.totalAmount)}</div>
                      </div>
                    </div>

                    <div className="order-card-footer">
                      <span className="order-card-date">{order.createdAt}</span>
                      <span className="order-card-view-link">
                        <span>Chi tiết</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="orders-empty-state">
                <ShoppingBag size={32} color="#94A3B8" />
                <p>Không có đơn hàng nào trong mục này.</p>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT ĐƠN HÀNG & TIMELINE ESCROW */}
        <div className={`orders-detail-column ${!mobileShowDetail ? 'mobile-hidden' : ''}`}>
          {selectedOrder ? (
            <div className="order-detail-card">
              {/* Mobile Back to List Button */}
              <div className="order-detail-mobile-back-row">
                <button
                  type="button"
                  className="btn-mobile-back-to-list"
                  onClick={() => setMobileShowDetail(false)}
                >
                  <ArrowLeft size={16} />
                  <span>Quay lại danh sách đơn</span>
                </button>
              </div>

              {/* Order Header */}
              <div className="order-detail-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 className="order-detail-code">{selectedOrder.orderCode}</h2>
                    <button
                      type="button"
                      className="btn-copy-code"
                      onClick={() => handleCopy(selectedOrder.orderCode)}
                      title="Sao chép mã đơn"
                    >
                      {copiedCode ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Đã sao chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                  <span className="order-detail-created-time">Đặt ngày {selectedOrder.createdAt}</span>
                </div>

                <div 
                  className="order-detail-status-pill"
                  style={{ color: statusInfo.color, backgroundColor: statusInfo.bg }}
                >
                  <ShieldCheck size={15} />
                  <span>{statusInfo.label}</span>
                </div>
              </div>

              {/* 48H COUNTDOWN BANNER (KHI ĐÃ GIAO HÀNG / DELIVERED) */}
              {selectedOrder.status === 'DELIVERED' && (
                <div className="order-48h-countdown-banner">
                  <div className="countdown-banner-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={20} className="pulse-timer-icon" />
                      <strong>Đang trong 48 giờ đồng kiểm sản phẩm:</strong>
                    </div>
                    <span className="countdown-digits-large">
                      {formatCountdown(countdownSecs)}
                    </span>
                  </div>
                  <p className="countdown-banner-desc">
                    Bạn hãy kiểm tra kỹ ngoại quan, bật máy test camera, cảm ứng, pin và các tính năng. Tiền của bạn vẫn đang được giữ an toàn tại Escrow. Nếu có bất kỳ lỗi nào, bạn có quyền bấm <strong>"Khiếu nại / Trả hàng"</strong> để đóng băng khoản tiền.
                  </p>
                </div>
              )}

              {/* DISPUTED BANNER (KHI ĐANG KHIẾU NẠI) */}
              {selectedOrder.status === 'DISPUTED' && (
                <div className="order-disputed-alert-banner">
                  <AlertTriangle size={20} color="#DC2626" />
                  <div>
                    <strong>Đơn hàng đang có khiếu nại (Khoản tiền bị đóng băng an toàn)</strong>
                    <p>Bộ phận hỗ trợ Reown Escrow đang xem xét bằng chứng và trao đổi với người bán. Tiền sẽ không được giải ngân cho đến khi khiếu nại được giải quyết thỏa đáng.</p>
                  </div>
                </div>
              )}

              {/* PAID_HELD REMINDER BANNER */}
              {selectedOrder.status === 'PAID_HELD' && (
                <div className="order-escrow-held-banner">
                  <ShieldCheck size={20} color="#0D9488" />
                  <div>
                    <strong>Tiền đã được giữ an toàn tại ví Escrow Reown ({formatVND(selectedOrder.payment.totalAmount)})</strong>
                    <p>Người bán đã nhận được thông báo để chuẩn bị đóng gói và gửi hàng trong vòng 24 giờ. Tiền hoàn toàn chưa chuyển cho người bán.</p>
                  </div>
                </div>
              )}

              {/* 5-STEP ESCROW TIMELINE */}
              <div className="order-timeline-section">
                <h3 className="section-title">Hành trình giao dịch & Bảo chứng Escrow</h3>

                <div className="escrow-5step-timeline">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div 
                      key={step.step} 
                      className={`timeline-step-node ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                    >
                      <div className="timeline-node-circle">
                        {step.completed ? (
                          <Check size={14} strokeWidth={3} />
                        ) : (
                          <span>{step.step}</span>
                        )}
                      </div>

                      {idx < selectedOrder.timeline.length - 1 && (
                        <div className={`timeline-connector-line ${step.completed ? 'filled' : ''}`} />
                      )}

                      <div className="timeline-step-info">
                        <strong className="timeline-step-title">{step.title}</strong>
                        <span className="timeline-step-time">{step.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRODUCT SNIPPET CARD */}
              <div className="order-product-card-block">
                <img 
                  src={selectedOrder.product.image} 
                  alt={selectedOrder.product.title} 
                  className="order-product-img" 
                />
                <div className="order-product-details">
                  <span className="product-condition-tag">
                    {selectedOrder.product.conditionLabel}
                  </span>
                  <h3 className="order-product-heading">{selectedOrder.product.title}</h3>
                  <div className="order-product-prices">
                    <strong className="order-price-bold">{formatVND(selectedOrder.product.price)}</strong>
                    {selectedOrder.product.originalPrice && (
                      <span className="order-orig-price">{formatVND(selectedOrder.product.originalPrice)}</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-view-product-detail"
                  onClick={() => onViewProduct && onViewProduct(selectedOrder.product)}
                >
                  <span>Xem tin đăng</span>
                  <ExternalLink size={13} />
                </button>
              </div>

              {/* SELLER & SHIPPING INFORMATION GRID */}
              <div className="order-info-grid">
                {/* Seller Box */}
                <div className="order-info-box">
                  <span className="info-box-label">Người bán hàng</span>
                  <div className="seller-profile-row">
                    <img src={selectedOrder.seller.avatar} alt={selectedOrder.seller.name} className="seller-avatar-sm" />
                    <div>
                      <strong className="seller-name-bold">{selectedOrder.seller.name}</strong>
                      <div className="seller-rating-sub">⭐ {selectedOrder.seller.rating} uy tín</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-chat-seller-outline"
                    onClick={() => onChatWithSeller && onChatWithSeller(selectedOrder.seller)}
                  >
                    <MessageSquare size={14} />
                    <span>Nhắn tin trao đổi</span>
                  </button>
                </div>

                {/* Shipping & Delivery Box */}
                <div className="order-info-box">
                  <span className="info-box-label">Vận chuyển & Giao nhận</span>
                  <div className="shipping-carrier-row">
                    <Truck size={17} color="#0D9488" />
                    <div>
                      <strong>{selectedOrder.shipping.method}</strong>
                      {selectedOrder.shipping.trackingCode && (
                        <div className="tracking-code-line">
                          <span>Mã vận đơn: <strong>{selectedOrder.shipping.trackingCode}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="receiver-address-line">
                    <MapPin size={14} color="#64748B" />
                    <span>{selectedOrder.shipping.receiverName} ({selectedOrder.shipping.receiverPhone}) &bull; {selectedOrder.shipping.address}</span>
                  </div>
                </div>
              </div>

              {/* FINANCIAL SUMMARY BOX */}
              <div className="order-financial-summary">
                <h4 className="financial-title">Tóm tắt thanh toán Escrow</h4>

                <div className="financial-lines">
                  <div className="financial-line">
                    <span>Tiền hàng chốt</span>
                    <strong>{formatVND(selectedOrder.payment.subtotal)}</strong>
                  </div>
                  <div className="financial-line">
                    <span>Phí vận chuyển</span>
                    <span>{selectedOrder.payment.shippingFee > 0 ? formatVND(selectedOrder.payment.shippingFee) : 'Miễn phí'}</span>
                  </div>
                  <div className="financial-line">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Phí bảo chứng Reown Escrow</span>
                      <HelpCircle size={13} color="#0D9488" />
                    </div>
                    <span style={{ color: '#0D9488', fontWeight: 700 }}>0 ₫ (Miễn phí)</span>
                  </div>
                  <div className="financial-line total">
                    <span>Tổng tiền Escrow đang giữ</span>
                    <strong className="total-escrow-amount">{formatVND(selectedOrder.payment.totalAmount)}</strong>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS ACCORDING TO ORDER STATUS */}
              <div className="order-actions-footer">
                {/* When DELIVERED: Confirm Receipt & Dispute options */}
                {selectedOrder.status === 'DELIVERED' && (
                  <div className="delivered-actions-group">
                    <button
                      type="button"
                      className="btn-confirm-receipt-large"
                      onClick={() => setShowConfirmReleaseDialog(true)}
                    >
                      <CheckCircle2 size={18} />
                      <span>Xác nhận đã nhận hàng & Giải ngân tiền</span>
                    </button>

                    <button
                      type="button"
                      className="btn-raise-dispute"
                      onClick={() => onOpenDispute ? onOpenDispute(selectedOrder) : alert('Chuyển sang luồng Khiếu nại / Trả hàng Escrow')}
                    >
                      <AlertTriangle size={16} />
                      <span>Khiếu nại / Yêu cầu trả hàng</span>
                    </button>
                  </div>
                )}

                {/* When COMPLETED: Leave review or buy again */}
                {selectedOrder.status === 'COMPLETED' && (
                  <div className="completed-actions-group">
                    <button
                      type="button"
                      className="btn-review-seller"
                      onClick={() => onOpenReview ? onOpenReview(selectedOrder) : setShowReviewModal(true)}
                    >
                      <Star size={16} />
                      <span>Đánh giá người bán</span>
                    </button>

                    <button
                      type="button"
                      className="btn-buy-similar"
                      onClick={onBackHome}
                    >
                      <span>Xem các món đồ tương tự</span>
                    </button>
                  </div>
                )}

                {/* When PAID_HELD: Remind seller */}
                {selectedOrder.status === 'PAID_HELD' && (
                  <div className="paid-held-actions-group">
                    <button
                      type="button"
                      className="btn-remind-seller"
                      onClick={() => onChatWithSeller && onChatWithSeller(selectedOrder.seller)}
                    >
                      <MessageSquare size={16} />
                      <span>Nhắc người bán gửi hàng sớm</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SIMULATOR BAR (DÀNH CHO ĐẠI CA XUÂN SƠN TEST NHANH CÁC TRẠNG THÁI) */}
              <div className="order-simulator-test-strip">
                <span className="sim-label">🧪 Công cụ mô phỏng trạng thái đơn hàng:</span>
                <div className="sim-buttons-row">
                  <button 
                    type="button" 
                    className={`sim-btn ${selectedOrder.status === 'PAID_HELD' ? 'active' : ''}`}
                    onClick={() => handleSimulateStatus('PAID_HELD')}
                  >
                    1. Đã giữ tiền (PAID_HELD)
                  </button>
                  <button 
                    type="button" 
                    className={`sim-btn ${selectedOrder.status === 'SHIPPED' ? 'active' : ''}`}
                    onClick={() => handleSimulateStatus('SHIPPED')}
                  >
                    2. Đã gửi (SHIPPED)
                  </button>
                  <button 
                    type="button" 
                    className={`sim-btn ${selectedOrder.status === 'DELIVERED' ? 'active' : ''}`}
                    onClick={() => handleSimulateStatus('DELIVERED')}
                  >
                    3. Đã nhận (48h kiểm hàng)
                  </button>
                  <button 
                    type="button" 
                    className={`sim-btn ${selectedOrder.status === 'COMPLETED' ? 'active' : ''}`}
                    onClick={() => handleSimulateStatus('COMPLETED')}
                  >
                    4. Hoàn tất (COMPLETED)
                  </button>
                  <button 
                    type="button" 
                    className={`sim-btn ${selectedOrder.status === 'DISPUTED' ? 'active' : ''}`}
                    onClick={() => handleSimulateStatus('DISPUTED')}
                  >
                    5. Khiếu nại (DISPUTED)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-order-selected-box">
              <ShoppingBag size={40} color="#94A3B8" />
              <h3>Chọn một đơn hàng từ danh sách bên trái</h3>
            </div>
          )}
        </div>
      </div>

      {/* POPUP: XÁC NHẬN ĐÃ NHẬN HÀNG & GIẢI NGÂN TIỀN */}
      {showConfirmReleaseDialog && (
        <div className="modal-backdrop-overlay" onClick={() => setShowConfirmReleaseDialog(false)}>
          <div className="modal-dialog-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0D9488' }}>
                <CheckCircle2 size={20} />
                <h3 className="modal-dialog-title">Xác nhận nhận hàng & Giải ngân</h3>
              </div>
              <button 
                type="button" 
                className="modal-dialog-close" 
                onClick={() => setShowConfirmReleaseDialog(false)}
              >
                <X size={18} />
              </button>
            </div>

            <p className="modal-dialog-body-text">
              Bạn xác nhận đã kiểm tra kỹ máy, ngoại quan và các tính năng của món đồ <strong>{selectedOrder.product.title}</strong> hoạt động đúng như mô tả?
              <br /><br />
              Sau khi bấm <strong>"Xác nhận giải ngân"</strong>, số tiền <strong>{formatVND(selectedOrder.payment.totalAmount)}</strong> sẽ ngay lập tức được chuyển vào ví của người bán và giao dịch sẽ kết thúc.
            </p>

            <div className="modal-dialog-footer-actions">
              <button
                type="button"
                className="btn-dialog-secondary"
                onClick={() => setShowConfirmReleaseDialog(false)}
              >
                Xem lại thêm
              </button>
              <button
                type="button"
                className="btn-dialog-primary"
                onClick={handleConfirmReceipt}
              >
                Xác nhận giải ngân
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: ĐÁNH GIÁ NGƯỜI BÁN SAU GIAO DỊCH */}
      {showReviewModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-dialog-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <h3 className="modal-dialog-title">Đánh giá người bán</h3>
              <button 
                type="button" 
                className="modal-dialog-close" 
                onClick={() => setShowReviewModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ textAlign: 'center', margin: '14px 0' }}>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '10px' }}>
                Bạn hài lòng với giao dịch của <strong>{selectedOrder.seller.name}</strong> chứ?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingStars(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <Star
                      size={28}
                      fill={star <= ratingStars ? '#F59E0B' : 'none'}
                      color={star <= ratingStars ? '#F59E0B' : '#CBD5E1'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="Chia sẻ cảm nhận về tình trạng máy, đóng gói và thái độ người bán..."
              className="listing-textarea"
              style={{ marginTop: '10px' }}
            />

            <div className="modal-dialog-footer-actions" style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="btn-dialog-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  setShowReviewModal(false);
                  alert('Cảm ơn bạn đã gửi đánh giá! Điểm uy tín của người bán đã được cập nhật.');
                }}
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
