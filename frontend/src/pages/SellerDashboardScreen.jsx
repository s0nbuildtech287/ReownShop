import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Tag, 
  ShoppingBag, 
  TrendingUp, 
  ArrowLeft, 
  Eye, 
  Heart, 
  Edit3, 
  EyeOff, 
  ArrowDown, 
  Zap, 
  Check, 
  X, 
  RotateCcw, 
  Truck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  SELLER_METRICS, 
  SELLER_LISTINGS, 
  SELLER_OFFERS, 
  SELLER_SALES_ORDERS 
} from '../mocks/sellerDashboard';
import { formatVND } from '../utils/formatters';

export default function SellerDashboardScreen({
  onBack,
  onNavigateCreateListing,
  onViewProduct,
  onOpenChatWithBuyer,
  onViewPublicProfile
}) {
  // Navigation active tab: 'overview' | 'listings' | 'offers' | 'orders'
  const [activeTab, setActiveTab] = useState('overview');

  // Chart timeframe: 'days' (7 ngày) | 'weeks' (4 tuần)
  const [chartTimeframe, setChartTimeframe] = useState('days');

  // Listings State
  const [listings, setListings] = useState(SELLER_LISTINGS);
  const [listingFilter, setListingFilter] = useState('ALL');

  // Offers State
  const [offers, setOffers] = useState(SELLER_OFFERS);

  // Orders State
  const [orders, setOrders] = useState(SELLER_SALES_ORDERS);
  const [orderFilter, setOrderFilter] = useState('ALL');

  // Modal: Enter tracking code when shipping an order
  const [shippingOrderTarget, setShippingOrderTarget] = useState(null);
  const [inputCarrier, setInputCarrier] = useState('Giao Hàng Tiết Kiệm (GHTK)');
  const [inputTrackingCode, setInputTrackingCode] = useState('GHTK-882910-VN');

  // Modal: Counter offer to buyer
  const [counterOfferTarget, setCounterOfferTarget] = useState(null);
  const [counterPriceInput, setCounterPriceInput] = useState(0);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Actions for Listings
  const handleToggleHideListing = (id) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isCurrentlyHidden = item.status === 'HIDDEN';
          const newStatus = isCurrentlyHidden ? 'AVAILABLE' : 'HIDDEN';
          showToast(isCurrentlyHidden ? `Đã hiển thị lại tin "${item.title}"` : `Đã ẩn tin "${item.title}"`);
          return { ...item, status: newStatus, statusText: isCurrentlyHidden ? 'Đang bán' : 'Đang ẩn' };
        }
        return item;
      })
    );
  };

  const handleQuickDiscount = (id, percent) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newPrice = Math.round(item.price * (1 - percent / 100));
          showToast(`Đã hạ giá tin "${item.title}" còn ${formatVND(newPrice)} (-${percent}%)`);
          return { ...item, price: newPrice };
        }
        return item;
      })
    );
  };

  const handleBumpListing = (id) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          showToast(`Đã đẩy tin "${item.title}" lên đầu trang tìm kiếm thành công!`);
          return { ...item, views: item.views + 12, isBumped: true };
        }
        return item;
      })
    );
  };

  // Actions for Offers
  const handleAcceptOffer = (offer) => {
    setOffers((prev) => prev.filter((o) => o.id !== offer.id));
    showToast(`Đã chấp nhận mức giá ${formatVND(offer.offerAmount)} từ ${offer.buyer.name}!`);
  };

  const handleRejectOffer = (offer) => {
    setOffers((prev) => prev.filter((o) => o.id !== offer.id));
    showToast(`Đã từ chối đề nghị từ ${offer.buyer.name}.`);
  };

  const handleSubmitCounterOffer = () => {
    if (!counterOfferTarget) return;
    setOffers((prev) => prev.filter((o) => o.id !== counterOfferTarget.id));
    showToast(`Đã gửi giá phản hồi ${formatVND(counterPriceInput)} cho ${counterOfferTarget.buyer.name}!`);
    setCounterOfferTarget(null);
  };

  // Actions for Orders: Mark as Shipped
  const handleConfirmShipOrder = () => {
    if (!shippingOrderTarget) return;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === shippingOrderTarget.id) {
          return {
            ...ord,
            status: 'SHIPPED',
            statusText: `Đã gửi qua ${inputCarrier} (Mã: ${inputTrackingCode})`,
            trackingCode: inputTrackingCode,
            carrier: inputCarrier
          };
        }
        return ord;
      })
    );
    showToast(`Đơn ${shippingOrderTarget.id} đã chuyển trạng thái sang "Đang giao hàng"!`);
    setShippingOrderTarget(null);
  };

  // Filtered Listings
  const filteredListings = listings.filter((l) => {
    if (listingFilter === 'ALL') return true;
    return l.status === listingFilter;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  // Chart data calculations
  const chartData = chartTimeframe === 'days' 
    ? SELLER_METRICS.revenueChartDays 
    : SELLER_METRICS.revenueChartWeeks;
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  return (
    <div className="seller-dashboard-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="seller-dashboard-toast">
          <CheckCircle2 size={16} color="#0D9488" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="seller-header-bar">
        <div className="seller-header-left">
          <button type="button" className="btn-back-profile" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Tài khoản & Ví</span>
          </button>
          <div>
            <h1 className="seller-main-title">Kênh Người Bán & Quản Lý Đơn</h1>
            <p className="seller-main-sub">
              Bảo chứng dòng tiền Escrow & đàm phán trả giá tự động
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            type="button" 
            className="btn-profile-top-action"
            onClick={onViewPublicProfile}
            title="Xem hồ sơ bán hàng công khai người mua nhìn thấy"
          >
            <ExternalLink size={15} />
            <span>Hồ sơ công khai</span>
          </button>

          <button 
            type="button" 
            className="btn-create-new-listing"
            onClick={onNavigateCreateListing}
          >
            <PlusCircle size={16} />
            <span>Đăng tin thanh lý mới</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Tabs Navigation */}
      <div className="seller-mobile-nav-tabs hide-scrollbar">
        <button
          type="button"
          className={`seller-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={15} />
          <span>Tổng quan & KPI</span>
        </button>
        <button
          type="button"
          className={`seller-nav-tab ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          <Package size={15} />
          <span>Tin của tôi ({listings.length})</span>
        </button>
        <button
          type="button"
          className={`seller-nav-tab ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          <Tag size={15} />
          <span>Đề nghị giá ({offers.length})</span>
        </button>
        <button
          type="button"
          className={`seller-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={15} />
          <span>Đơn bán ({orders.length})</span>
        </button>
      </div>

      {/* Main Dashboard Layout (Desktop Sidebar + Right Content Pane) */}
      <div className="seller-layout-grid">
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="seller-desktop-sidebar">
          <div className="seller-sidebar-menu">
            <button
              type="button"
              className={`seller-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 size={17} />
              <span>Tổng quan & Doanh thu</span>
            </button>

            <button
              type="button"
              className={`seller-menu-item ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              <Package size={17} />
              <div style={{ flex: 1, textAlign: 'left' }}>Tin của tôi</div>
              <span className="sidebar-pill-badge">{listings.length}</span>
            </button>

            <button
              type="button"
              className={`seller-menu-item ${activeTab === 'offers' ? 'active' : ''}`}
              onClick={() => setActiveTab('offers')}
            >
              <Tag size={17} />
              <div style={{ flex: 1, textAlign: 'left' }}>Đề nghị giá</div>
              {offers.length > 0 && (
                <span className="sidebar-pill-badge warning">{offers.length}</span>
              )}
            </button>

            <button
              type="button"
              className={`seller-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={17} />
              <div style={{ flex: 1, textAlign: 'left' }}>Đơn bán hàng</div>
              <span className="sidebar-pill-badge">{orders.length}</span>
            </button>
          </div>

          {/* Escrow Seller Guarantee Badge */}
          <div className="seller-escrow-badge-card">
            <ShieldCheck size={20} color="#0D9488" />
            <div>
              <strong>Bảo vệ người bán 100%</strong>
              <p>Khách đã thanh toán vào ví Escrow thì bạn mới giao hàng. Không lo bom hàng hay lừa đảo.</p>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT PANE */}
        <main className="seller-content-pane">
          {/* ================= 1. TAB TỔNG QUAN & KPI ================= */}
          {activeTab === 'overview' && (
            <div className="seller-overview-tab-pane">
              {/* 4 Thẻ chỉ số KPI đầu trang */}
              <div className="kpi-cards-grid">
                {/* KPI 1: Doanh thu tháng này */}
                <div className="kpi-card highlight-teal">
                  <span className="kpi-label">Doanh thu tháng này</span>
                  <div className="kpi-value-row">
                    <strong className="kpi-main-number">{formatVND(SELLER_METRICS.monthlyRevenue)}</strong>
                  </div>
                  <div className="kpi-trend-pill positive">
                    <TrendingUp size={12} />
                    <span>+{SELLER_METRICS.monthlyRevenueGrowth}% so với tháng trước</span>
                  </div>
                </div>

                {/* KPI 2: Tin đang bán */}
                <div className="kpi-card">
                  <span className="kpi-label">Số tin đang bán</span>
                  <div className="kpi-value-row">
                    <strong className="kpi-main-number">{SELLER_METRICS.activeListingsCount}</strong>
                    <span className="kpi-unit">sản phẩm</span>
                  </div>
                  <span className="kpi-sub-text">Đang hiển thị trên sàn</span>
                </div>

                {/* KPI 3: Đề nghị giá chờ xử lý */}
                <div className="kpi-card">
                  <span className="kpi-label">Đề nghị giá chờ xử lý</span>
                  <div className="kpi-value-row">
                    <strong className="kpi-main-number text-orange">{offers.length}</strong>
                    <span className="kpi-unit">yêu cầu</span>
                  </div>
                  <button 
                    type="button" 
                    className="kpi-action-link"
                    onClick={() => setActiveTab('offers')}
                  >
                    Xem và phản hồi &rarr;
                  </button>
                </div>

                {/* KPI 4: Đơn cần gửi hàng */}
                <div className="kpi-card">
                  <span className="kpi-label">Đơn cần gửi hàng</span>
                  <div className="kpi-value-row">
                    <strong className="kpi-main-number text-teal">
                      {orders.filter((o) => o.status === 'PAID_HELD').length}
                    </strong>
                    <span className="kpi-unit">đơn hàng</span>
                  </div>
                  <span className="kpi-sub-text">Tiền đã khóa tại Escrow</span>
                </div>
              </div>

              {/* Biểu đồ doanh thu trực quan */}
              <div className="revenue-chart-card">
                <div className="chart-card-header">
                  <div>
                    <h3 className="chart-title">Biểu đồ doanh thu bán hàng</h3>
                    <p className="chart-sub">Thống kê doanh số thực nhận qua bảo chứng Escrow</p>
                  </div>

                  <div className="chart-timeframe-toggle">
                    <button
                      type="button"
                      className={`btn-timeframe ${chartTimeframe === 'days' ? 'active' : ''}`}
                      onClick={() => setChartTimeframe('days')}
                    >
                      7 ngày qua
                    </button>
                    <button
                      type="button"
                      className={`btn-timeframe ${chartTimeframe === 'weeks' ? 'active' : ''}`}
                      onClick={() => setChartTimeframe('weeks')}
                    >
                      4 tuần qua
                    </button>
                  </div>
                </div>

                {/* Biểu đồ cột CSS / SVG */}
                <div className="chart-bars-container">
                  {chartData.map((item, idx) => {
                    const heightPercent = Math.max(Math.round((item.revenue / maxRevenue) * 100), 4);
                    return (
                      <div key={idx} className="chart-bar-column">
                        <div className="bar-tooltip-popover">
                          <strong>{formatVND(item.revenue)}</strong>
                          <span>{item.orders} đơn hàng</span>
                        </div>
                        <div className="chart-bar-track">
                          <div 
                            className="chart-bar-fill" 
                            style={{ height: `${heightPercent}%` }} 
                          />
                        </div>
                        <span className="chart-bar-label">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick links shortcut strip */}
              <div className="overview-quick-tasks-grid">
                <div className="quick-task-card" onClick={() => setActiveTab('orders')}>
                  <ShoppingBag size={20} color="#0D9488" />
                  <div>
                    <strong>Có {orders.filter(o => o.status === 'PAID_HELD').length} đơn hàng đang chờ bạn gửi</strong>
                    <p>Bấm để nhập mã vận đơn và cập nhật hành trình cho người mua.</p>
                  </div>
                  <ChevronRight size={18} color="#94A3B8" />
                </div>

                <div className="quick-task-card" onClick={() => setActiveTab('offers')}>
                  <Tag size={20} color="#F59E0B" />
                  <div>
                    <strong>Có {offers.length} người mua đang đợi bạn chốt giá</strong>
                    <p>Phản hồi sớm để tránh người mua tìm món đồ của người khác.</p>
                  </div>
                  <ChevronRight size={18} color="#94A3B8" />
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. TAB TIN CỦA TÔI ================= */}
          {activeTab === 'listings' && (
            <div className="seller-listings-tab-pane">
              {/* Header & Sub-filters */}
              <div className="listings-tab-toolbar">
                <div className="listings-sub-filters">
                  {[
                    { key: 'ALL', label: `Tất cả (${listings.length})` },
                    { key: 'AVAILABLE', label: `Đang bán (${listings.filter(l => l.status === 'AVAILABLE').length})` },
                    { key: 'HELD', label: `Đang giữ (${listings.filter(l => l.status === 'HELD').length})` },
                    { key: 'SOLD', label: `Đã bán (${listings.filter(l => l.status === 'SOLD').length})` },
                    { key: 'HIDDEN', label: `Đang ẩn (${listings.filter(l => l.status === 'HIDDEN').length})` }
                  ].map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      className={`btn-sub-filter ${listingFilter === f.key ? 'active' : ''}`}
                      onClick={() => setListingFilter(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <button 
                  type="button" 
                  className="btn-create-new-listing sm"
                  onClick={onNavigateCreateListing}
                >
                  <PlusCircle size={15} />
                  <span>Đăng tin mới</span>
                </button>
              </div>

              {/* Danh sách tin đăng */}
              <div className="seller-listings-table-container">
                {filteredListings.length > 0 ? (
                  <div className="seller-listings-list">
                    {filteredListings.map((item) => (
                      <div key={item.id} className="seller-listing-item-card">
                        <img src={item.image} alt={item.title} className="seller-listing-thumb" />

                        <div className="seller-listing-info">
                          <div className="listing-status-row">
                            <span className={`listing-status-pill ${item.status.toLowerCase()}`}>
                              {item.statusText}
                            </span>
                            <span className="listing-cat-text">{item.category}</span>
                            <span className="listing-posted-text">Đăng ngày {item.postedDate}</span>
                          </div>

                          <h3 
                            className="seller-listing-title" 
                            onClick={() => onViewProduct && onViewProduct(item)}
                            title="Bấm xem trang chi tiết"
                          >
                            {item.title}
                          </h3>

                          <div className="seller-listing-price-row">
                            <strong className="listing-price-bold">{formatVND(item.price)}</strong>
                            {item.originalPrice && (
                              <span className="listing-orig-price">{formatVND(item.originalPrice)}</span>
                            )}
                          </div>

                          <div className="listing-stats-row">
                            <div className="listing-stat-item">
                              <Eye size={13} color="#64748B" />
                              <span>{item.views} lượt xem</span>
                            </div>
                            <div className="listing-stat-item">
                              <Heart size={13} color="#EF4444" />
                              <span>{item.likes} yêu thích</span>
                            </div>
                          </div>
                        </div>

                        {/* Thao tác hành động: Sửa, Ẩn/Hiện, Hạ giá nhanh, Đẩy tin */}
                        <div className="seller-listing-actions">
                          {/* Đẩy tin */}
                          <button
                            type="button"
                            className="btn-listing-action bump"
                            onClick={() => handleBumpListing(item.id)}
                            title="Đẩy tin lên đầu trang tìm kiếm"
                          >
                            <Zap size={14} />
                            <span>Đẩy tin</span>
                          </button>

                          {/* Hạ giá nhanh -5% hoặc -10% */}
                          <div className="quick-discount-dropdown-wrap">
                            <button
                              type="button"
                              className="btn-listing-action discount"
                              onClick={() => handleQuickDiscount(item.id, 5)}
                              title="Hạ giá nhanh 5% để thu hút người mua"
                            >
                              <ArrowDown size={14} />
                              <span>Hạ 5%</span>
                            </button>
                            <button
                              type="button"
                              className="btn-listing-action discount"
                              onClick={() => handleQuickDiscount(item.id, 10)}
                              title="Hạ giá nhanh 10%"
                            >
                              <span>Hạ 10%</span>
                            </button>
                          </div>

                          {/* Ẩn / Hiện tin */}
                          <button
                            type="button"
                            className="btn-listing-action"
                            onClick={() => handleToggleHideListing(item.id)}
                            title={item.status === 'HIDDEN' ? 'Hiển thị lại tin này' : 'Tạm ẩn tin này'}
                          >
                            {item.status === 'HIDDEN' ? <Eye size={14} /> : <EyeOff size={14} />}
                            <span>{item.status === 'HIDDEN' ? 'Hiện tin' : 'Ẩn tin'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="seller-empty-block">
                    <Package size={36} color="#94A3B8" />
                    <p>Không tìm thấy tin đăng nào trong mục này.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 3. TAB ĐỀ NGHỊ GIÁ (OFFERS) ================= */}
          {activeTab === 'offers' && (
            <div className="seller-offers-tab-pane">
              <div className="offers-pane-header">
                <div>
                  <h3 className="section-heading">Đề nghị giá từ người mua ({offers.length})</h3>
                  <p className="section-sub">
                    Chấp nhận giá để tạo đơn hàng Escrow bảo chứng tức thì cho người mua
                  </p>
                </div>
              </div>

              {offers.length > 0 ? (
                <div className="seller-offers-list">
                  {offers.map((offer) => (
                    <div key={offer.id} className="seller-offer-card">
                      <div className="offer-card-top-row">
                        <div className="offer-product-wrap">
                          <img src={offer.productImage} alt={offer.productTitle} className="offer-prod-thumb" />
                          <div>
                            <h4 className="offer-prod-title">{offer.productTitle}</h4>
                            <div className="offer-orig-price">Giá niêm yết: {formatVND(offer.originalPrice)}</div>
                          </div>
                        </div>

                        <div className="offer-countdown-tag">
                          <Clock size={13} />
                          <span>{offer.expiresIn}</span>
                        </div>
                      </div>

                      {/* Buyer row & proposed price */}
                      <div className="offer-body-highlight">
                        <div className="offer-buyer-profile">
                          <img src={offer.buyer.avatar} alt={offer.buyer.name} className="buyer-avatar" />
                          <div>
                            <strong className="buyer-name">{offer.buyer.name}</strong>
                            <div className="buyer-rating">⭐ {offer.buyer.rating} uy tín</div>
                          </div>
                        </div>

                        <div className="offer-proposed-price-box">
                          <span className="proposed-lbl">Giá đề xuất:</span>
                          <strong className="proposed-amount">{formatVND(offer.offerAmount)}</strong>
                          <span className="proposed-discount">(-{offer.discountPercent}%)</span>
                        </div>
                      </div>

                      {offer.message && (
                        <p className="offer-buyer-note">
                          "{offer.message}"
                        </p>
                      )}

                      {/* Action buttons: Accept / Reject / Counter */}
                      <div className="offer-buttons-footer">
                        <button
                          type="button"
                          className="btn-accept-offer"
                          onClick={() => handleAcceptOffer(offer)}
                        >
                          <Check size={16} />
                          <span>Chấp nhận giá này</span>
                        </button>

                        <button
                          type="button"
                          className="btn-counter-offer"
                          onClick={() => {
                            setCounterOfferTarget(offer);
                            setCounterPriceInput(offer.offerAmount + 200000);
                          }}
                        >
                          <RotateCcw size={15} />
                          <span>Trả giá lại</span>
                        </button>

                        <button
                          type="button"
                          className="btn-reject-offer"
                          onClick={() => handleRejectOffer(offer)}
                        >
                          <X size={15} />
                          <span>Từ chối</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="seller-empty-block">
                  <Tag size={36} color="#94A3B8" />
                  <p>Hiện không có đề nghị giá nào đang chờ bạn xử lý.</p>
                </div>
              )}
            </div>
          )}

          {/* ================= 4. TAB ĐƠN BÁN (SALES ORDERS) ================= */}
          {activeTab === 'orders' && (
            <div className="seller-orders-tab-pane">
              {/* Header & Sub-filters */}
              <div className="orders-tab-toolbar">
                <div className="orders-sub-filters">
                  {[
                    { key: 'ALL', label: `Tất cả (${orders.length})` },
                    { key: 'PAID_HELD', label: `Chờ gửi hàng (${orders.filter(o => o.status === 'PAID_HELD').length})` },
                    { key: 'SHIPPED', label: `Đang giao (${orders.filter(o => o.status === 'SHIPPED').length})` },
                    { key: 'DISPUTED', label: `Khiếu nại (${orders.filter(o => o.status === 'DISPUTED').length})` },
                    { key: 'COMPLETED', label: `Đã hoàn tất (${orders.filter(o => o.status === 'COMPLETED').length})` }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      className={`btn-sub-filter ${orderFilter === tab.key ? 'active' : ''}`}
                      onClick={() => setOrderFilter(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Danh sách đơn bán */}
              <div className="seller-orders-list">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((ord) => (
                    <div key={ord.id} className="seller-order-card">
                      <div className="seller-order-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="seller-order-code">{ord.id}</span>
                          <span className="seller-order-paid-time">Thanh toán lúc {ord.paidAt}</span>
                        </div>

                        <span className={`seller-order-status-badge ${ord.status.toLowerCase()}`}>
                          {ord.statusText}
                        </span>
                      </div>

                      {/* Disputed Alert banner if order has dispute */}
                      {ord.status === 'DISPUTED' && (
                        <div className="seller-order-dispute-alert">
                          <AlertTriangle size={17} color="#DC2626" />
                          <div>
                            <strong>Đơn hàng đang có khiếu nại từ người mua:</strong>
                            <p>{ord.disputeReason}</p>
                          </div>
                        </div>
                      )}

                      <div className="seller-order-body-grid">
                        <img src={ord.productImage} alt={ord.productTitle} className="seller-order-thumb" />

                        <div className="seller-order-details">
                          <h4 className="seller-order-item-title">{ord.productTitle}</h4>
                          <div className="seller-order-financials">
                            <span>Thu hộ Escrow: <strong>{formatVND(ord.totalPrice)}</strong></span>
                            <span>&bull;</span>
                            <span className="text-teal">Thực nhận về ví: <strong>{formatVND(ord.netPayout)}</strong></span>
                          </div>

                          <div className="seller-order-buyer-info">
                            <strong>Người nhận:</strong> {ord.buyer.name} ({ord.buyer.phone}) &bull; {ord.buyer.address}
                          </div>
                        </div>
                      </div>

                      <div className="seller-order-card-footer">
                        {ord.mustShipBefore && ord.status === 'PAID_HELD' && (
                          <div className="ship-deadline-alert">
                            <Clock size={14} color="#D97706" />
                            <span>Hạn bàn giao bưu cục: <strong>{ord.mustShipBefore}</strong></span>
                          </div>
                        )}

                        <div className="seller-order-actions-row">
                          {/* Button "Đã gửi hàng" for PAID_HELD orders */}
                          {ord.status === 'PAID_HELD' && (
                            <button
                              type="button"
                              className="btn-mark-shipped"
                              onClick={() => setShippingOrderTarget(ord)}
                            >
                              <Truck size={15} />
                              <span>Xác nhận đã gửi hàng</span>
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn-order-chat"
                            onClick={() => onOpenChatWithBuyer && onOpenChatWithBuyer(ord.buyer)}
                          >
                            <span>Chat với người mua</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="seller-empty-block">
                    <ShoppingBag size={36} color="#94A3B8" />
                    <p>Không có đơn bán nào trong danh mục này.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* POPUP: XÁC NHẬN ĐÃ GỬI HÀNG (NHẬP MÃ VẬN ĐƠN) */}
      {shippingOrderTarget && (
        <div className="modal-backdrop-overlay" onClick={() => setShippingOrderTarget(null)}>
          <div className="modal-dialog-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0D9488' }}>
                <Truck size={20} />
                <h3 className="modal-dialog-title">Xác nhận gửi hàng (Mã: {shippingOrderTarget.id})</h3>
              </div>
              <button 
                type="button" 
                className="modal-dialog-close" 
                onClick={() => setShippingOrderTarget(null)}
              >
                <X size={18} />
              </button>
            </div>

            <p className="modal-dialog-body-text">
              Nhập mã vận đơn của đơn vị vận chuyển để hệ thống Escrow cập nhật hành trình cho người mua.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Đơn vị vận chuyển:
                </label>
                <input
                  type="text"
                  value={inputCarrier}
                  onChange={(e) => setInputCarrier(e.target.value)}
                  className="listing-input-text"
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Mã vận đơn / Tracking code:
                </label>
                <input
                  type="text"
                  value={inputTrackingCode}
                  onChange={(e) => setInputTrackingCode(e.target.value)}
                  placeholder="Ví dụ: GHTK-882910-VN..."
                  className="listing-input-text"
                />
              </div>
            </div>

            <div className="modal-dialog-footer-actions" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn-dialog-secondary"
                onClick={() => setShippingOrderTarget(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn-dialog-primary"
                onClick={handleConfirmShipOrder}
              >
                Xác nhận đã giao cho shipper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: TRẢ GIÁ LẠI CHO NGƯỜI MUA */}
      {counterOfferTarget && (
        <div className="modal-backdrop-overlay" onClick={() => setCounterOfferTarget(null)}>
          <div className="modal-dialog-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} color="#0D9488" />
                <h3 className="modal-dialog-title">Trả giá lại cho người mua</h3>
              </div>
              <button 
                type="button" 
                className="modal-dialog-close" 
                onClick={() => setCounterOfferTarget(null)}
              >
                <X size={18} />
              </button>
            </div>

            <p className="modal-dialog-body-text">
              Khách hàng <strong>{counterOfferTarget.buyer.name}</strong> đề xuất mua <strong>{counterOfferTarget.productTitle}</strong> với giá <strong>{formatVND(counterOfferTarget.offerAmount)}</strong> (giá niêm yết: {formatVND(counterOfferTarget.originalPrice)}).
            </p>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Mức giá bạn muốn phản hồi lại (VNĐ):
              </label>
              <div className="price-input-wrapper">
                <input
                  type="number"
                  step={50000}
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(Number(e.target.value))}
                  className="listing-input-price small"
                />
                <span className="price-currency-tag">₫</span>
              </div>
            </div>

            <div className="modal-dialog-footer-actions" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn-dialog-secondary"
                onClick={() => setCounterOfferTarget(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn-dialog-primary"
                onClick={handleSubmitCounterOffer}
              >
                Gửi giá phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
