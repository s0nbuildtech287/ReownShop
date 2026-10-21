import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  MessageSquare,
  UserPlus,
  UserCheck,
  Share2,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  ShoppingBag,
  TrendingUp,
  Eye,
  Heart,
  AlertTriangle,
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';
import { PUBLIC_SELLER_PROFILE } from '../mocks/publicSellerProfile';
import { formatVND } from '../utils/formatters';

export default function PublicSellerProfileScreen({
  seller = PUBLIC_SELLER_PROFILE,
  onBack,
  onViewProduct,
  onChatWithSeller
}) {
  // Navigation tabs: 'listings' | 'sold' | 'reviews'
  const [activeTab, setActiveTab] = useState('listings');

  // Follow State
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(seller.metrics.followersCount);

  // Review Star Filter: 0 (All) | 5 | 4 | 3
  const [reviewStarFilter, setReviewStarFilter] = useState(0);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
      showToast(`Đã bỏ theo dõi ${seller.name}`);
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
      showToast(`Đã theo dõi ${seller.name}! Bạn sẽ nhận được thông báo khi có đồ mới.`);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết trang hồ sơ người bán!');
    } else {
      showToast('Đã chia sẻ liên kết người bán!');
    }
  };

  // Filtered reviews
  const filteredReviews = seller.reviews.filter((r) => {
    if (reviewStarFilter === 0) return true;
    return r.stars === reviewStarFilter;
  });

  return (
    <div className="public-seller-profile-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="seller-dashboard-toast">
          <CheckCircle2 size={16} color="#0D9488" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="profile-top-nav-bar">
        <button type="button" className="btn-back-profile" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Quay lại</span>
        </button>

        <div className="profile-top-actions">
          <button type="button" className="btn-profile-top-action" onClick={handleShare} title="Chia sẻ hồ sơ">
            <Share2 size={16} />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* HERO COVER & PROFILE CARD */}
      <div className="seller-profile-hero-card">
        {/* Cover Photo */}
        <div className="seller-cover-wrapper">
          <img src={seller.coverPhoto} alt="Cover" className="seller-cover-img" />
          <div className="seller-cover-overlay" />
          <div className="escrow-certified-banner">
            <ShieldCheck size={16} color="#0D9488" />
            <span>Hồ Sơ Được Reown Escrow Bảo Chứng Uy Tín</span>
          </div>
        </div>

        {/* Profile Info Main Row */}
        <div className="seller-profile-info-body">
          <div className="seller-avatar-block">
            <div className="seller-avatar-frame">
              <img src={seller.avatar} alt={seller.name} className="seller-main-avatar" />
              {seller.isVerifiedCCCD && (
                <div className="avatar-verified-tick" title="Đã xác thực CCCD chính chủ">
                  <ShieldCheck size={16} color="white" />
                </div>
              )}
            </div>

            <div className="seller-names-wrap">
              <div className="seller-title-row">
                <h1 className="seller-name-heading">{seller.name}</h1>
                {seller.isTopRatedSeller && (
                  <span className="top-rated-seller-badge">
                    <Award size={13} />
                    <span>Người bán Top đầu</span>
                  </span>
                )}
              </div>
              <div className="seller-sub-meta">
                <span className="seller-handle">{seller.username}</span>
                <span>&bull;</span>
                <span className="seller-meta-item">
                  <MapPin size={13} />
                  <span>{seller.location}</span>
                </span>
                <span>&bull;</span>
                <span className="seller-meta-item">
                  <Clock size={13} />
                  <span>{seller.joinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons (Follow & Chat) */}
          <div className="seller-hero-action-buttons">
            <button
              type="button"
              className={`btn-hero-follow ${isFollowing ? 'following' : ''}`}
              onClick={handleToggleFollow}
            >
              {isFollowing ? (
                <>
                  <UserCheck size={16} />
                  <span>Đang theo dõi ({followersCount})</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Theo dõi ({followersCount})</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-hero-chat"
              onClick={() => onChatWithSeller && onChatWithSeller(seller)}
            >
              <MessageSquare size={16} />
              <span>Nhắn tin</span>
            </button>
          </div>
        </div>

        {/* Bio Text */}
        <p className="seller-bio-text">
          {seller.bio}
        </p>

        {/* 4 THẺ CHỈ SỐ UY TÍN & PHẢN HỒI (REPUTATION TILES) */}
        <div className="seller-metrics-grid">
          {/* Tile 1: Điểm uy tín Escrow */}
          <div className="metric-tile highlight-green">
            <div className="metric-tile-icon">
              <ShieldCheck size={20} color="#0D9488" />
            </div>
            <div>
              <span className="metric-tile-label">Điểm uy tín Escrow</span>
              <div className="metric-tile-val-row">
                <strong className="metric-tile-val text-teal">{seller.metrics.trustScore}</strong>
                <span className="metric-tile-max">/100</span>
              </div>
              <span className="metric-tile-desc">Xác thực CCCD & Không nợ cước</span>
            </div>
          </div>

          {/* Tile 2: Đánh giá sao */}
          <div className="metric-tile">
            <div className="metric-tile-icon">
              <Star size={20} color="#F59E0B" fill="#F59E0B" />
            </div>
            <div>
              <span className="metric-tile-label">Đánh giá trung bình</span>
              <div className="metric-tile-val-row">
                <strong className="metric-tile-val">{seller.metrics.ratingAverage}</strong>
                <span className="metric-tile-max">/5.0 ({seller.metrics.totalReviews})</span>
              </div>
              <span className="metric-tile-desc">100% từ giao dịch thật qua sàn</span>
            </div>
          </div>

          {/* Tile 3: Tỷ lệ phản hồi */}
          <div className="metric-tile">
            <div className="metric-tile-icon">
              <MessageSquare size={20} color="#3B82F6" />
            </div>
            <div>
              <span className="metric-tile-label">Tỷ lệ phản hồi chat</span>
              <div className="metric-tile-val-row">
                <strong className="metric-tile-val">{seller.metrics.responseRate}%</strong>
              </div>
              <span className="metric-tile-desc">Thường trả lời: {seller.metrics.responseTimeText}</span>
            </div>
          </div>

          {/* Tile 4: Đơn hàng thành công qua Escrow */}
          <div className="metric-tile">
            <div className="metric-tile-icon">
              <Package size={20} color="#0F766E" />
            </div>
            <div>
              <span className="metric-tile-label">Đơn bán thành công</span>
              <div className="metric-tile-val-row">
                <strong className="metric-tile-val">{seller.metrics.successOrdersCount}</strong>
                <span className="metric-tile-max">đơn</span>
              </div>
              <span className="metric-tile-desc">Tỷ lệ khiếu nại chỉ {seller.metrics.disputeRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION BAR: Đang bán | Đã bán | Đánh giá & Số sao */}
      <div className="seller-tabs-container">
        <div className="seller-tabs-nav-bar">
          <button
            type="button"
            className={`seller-tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <Package size={16} />
            <span>Đang bán ({seller.activeListings.length})</span>
          </button>

          <button
            type="button"
            className={`seller-tab-btn ${activeTab === 'sold' ? 'active' : ''}`}
            onClick={() => setActiveTab('sold')}
          >
            <CheckCircle2 size={16} />
            <span>Đã bán ({seller.soldListings.length})</span>
          </button>

          <button
            type="button"
            className={`seller-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={16} />
            <span>Đánh giá & Phân bố số sao ({seller.reviews.length})</span>
          </button>
        </div>

        {/* TAB 1: SẢN PHẨM ĐANG BÁN (ACTIVE LISTINGS) */}
        {activeTab === 'listings' && (
          <div className="seller-tab-pane">
            <div className="listings-grid-layout">
              {seller.activeListings.map((item) => (
                <div 
                  key={item.id} 
                  className="profile-product-card"
                  onClick={() => onViewProduct && onViewProduct(item)}
                >
                  <div className="product-card-thumb-wrap">
                    <img src={item.image} alt={item.title} className="product-card-img" />
                    <span className="product-cond-badge">{item.condition}</span>
                  </div>

                  <div className="product-card-body">
                    <span className="product-card-cat">{item.category} &bull; {item.location}</span>
                    <h3 className="product-card-title">{item.title}</h3>

                    <div className="product-price-row">
                      <strong className="product-current-price">{formatVND(item.price)}</strong>
                      {item.originalPrice && (
                        <span className="product-old-price">{formatVND(item.originalPrice)}</span>
                      )}
                    </div>

                    <div className="product-card-footer">
                      <div className="card-stat">
                        <Eye size={12} color="#94A3B8" />
                        <span>{item.views}</span>
                      </div>
                      <div className="card-stat">
                        <Heart size={12} color="#EF4444" />
                        <span>{item.likes}</span>
                      </div>
                      <span className="card-posted-date">{item.postedDaysAgo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SẢN PHẨM ĐÃ BÁN (SOLD LISTINGS) */}
        {activeTab === 'sold' && (
          <div className="seller-tab-pane">
            <div className="sold-listings-list">
              {seller.soldListings.map((item) => (
                <div key={item.id} className="sold-item-row">
                  <img src={item.image} alt={item.title} className="sold-item-thumb" />
                  <div className="sold-item-info">
                    <h4 className="sold-item-title">{item.title}</h4>
                    <div className="sold-item-meta">
                      <span>Đã bán: <strong>{formatVND(item.soldPrice)}</strong></span>
                      <span>&bull;</span>
                      <span>Người mua: {item.buyerName}</span>
                      <span>&bull;</span>
                      <span>Ngày giao dịch: {item.soldDate}</span>
                    </div>
                  </div>
                  <span className="sold-escrow-badge">
                    <ShieldCheck size={14} color="#0D9488" />
                    <span>Hoàn tất qua Escrow</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ĐÁNH GIÁ & PHÂN BỐ SỐ SAO (REVIEWS & STAR DISTRIBUTION) */}
        {activeTab === 'reviews' && (
          <div className="seller-tab-pane">
            {/* HỘP TỔNG HỢP & BIỂU ĐỒ PHÂN BỐ SAO */}
            <div className="rating-overview-card">
              {/* Cột trái: Điểm trung bình */}
              <div className="rating-score-left-col">
                <strong className="rating-big-number">{seller.metrics.ratingAverage}</strong>
                <div className="rating-stars-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </div>
                <span className="rating-total-count">Dựa trên {seller.metrics.totalReviews} đánh giá thực tế</span>
              </div>

              {/* Cột phải: Thanh ngang phân bố số sao */}
              <div className="rating-distribution-right-col">
                {seller.ratingDistribution.map((dist) => (
                  <div 
                    key={dist.stars} 
                    className={`distribution-row ${reviewStarFilter === dist.stars ? 'selected' : ''}`}
                    onClick={() => setReviewStarFilter(reviewStarFilter === dist.stars ? 0 : dist.stars)}
                  >
                    <span className="dist-stars-label">{dist.stars} sao</span>
                    <div className="dist-progress-track">
                      <div className="dist-progress-fill" style={{ width: `${dist.percent}%` }} />
                    </div>
                    <span className="dist-count-text">{dist.count} ({dist.percent}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="reviews-sub-filter-row">
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Lọc đánh giá:</span>
              {[
                { star: 0, label: 'Tất cả' },
                { star: 5, label: '5 sao (130)' },
                { star: 4, label: '4 sao (14)' },
                { star: 3, label: '3 sao (4)' }
              ].map((f) => (
                <button
                  key={f.star}
                  type="button"
                  className={`btn-review-filter-pill ${reviewStarFilter === f.star ? 'active' : ''}`}
                  onClick={() => setReviewStarFilter(f.star)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Danh sách các bài đánh giá */}
            <div className="reviews-feed-list">
              {filteredReviews.map((rev) => (
                <div key={rev.id} className="review-item-card">
                  <div className="review-header-row">
                    <div className="review-buyer-profile">
                      <img src={rev.buyer.avatar} alt={rev.buyer.name} className="review-buyer-avatar" />
                      <div>
                        <strong className="review-buyer-name">{rev.buyer.name}</strong>
                        <div className="review-stars-row">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              size={13} 
                              color={s <= rev.stars ? "#F59E0B" : "#CBD5E1"} 
                              fill={s <= rev.stars ? "#F59E0B" : "none"} 
                            />
                          ))}
                          <span className="review-time">{rev.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {rev.isEscrowVerified && (
                      <span className="review-escrow-badge">
                        <ShieldCheck size={13} color="#0D9488" />
                        <span>Đã mua qua Escrow</span>
                      </span>
                    )}
                  </div>

                  {rev.productBought && (
                    <div className="review-bought-product-tag">
                      Sản phẩm đã mua: <strong>{rev.productBought}</strong>
                    </div>
                  )}

                  <p className="review-comment-body">
                    "{rev.comment}"
                  </p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="review-photos-grid">
                      {rev.images.map((img, idx) => (
                        <img key={idx} src={img} alt="Review attachment" className="review-photo-thumb" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
