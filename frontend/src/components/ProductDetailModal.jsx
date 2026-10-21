import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Tag, 
  ShoppingBag, 
  Heart, 
  Share2, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  HelpCircle,
  Truck
} from 'lucide-react';
import { formatVND, formatDistance, getConditionStyle } from '../utils/formatters';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onBuyNow,
  onMakeOffer,
  onChatWithSeller,
  onViewSellerProfile
}) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!isOpen || !product) return null;

  const conditionStyle = getConditionStyle(product.condition);
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'];

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div 
        className="product-detail-modal-panel" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile drag handle */}
        <div className="bottomsheet-drag-handle" />

        {/* Header Actions */}
        <div className="product-detail-top-bar">
          <div className="detail-tag-wrapper">
            <span 
              className="product-condition-tag"
              style={{ color: conditionStyle.color, backgroundColor: conditionStyle.bg }}
            >
              {conditionStyle.label}
            </span>
            {product.escrowProtected && (
              <span className="escrow-pill-tag">
                <ShieldCheck size={12} strokeWidth={2.5} />
                <span>Bảo chứng Escrow</span>
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              type="button" 
              className={`detail-icon-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => setIsLiked(!isLiked)}
              title="Yêu thích"
            >
              <Heart size={18} fill={isLiked ? '#EF4444' : 'none'} color={isLiked ? '#EF4444' : '#64748B'} />
            </button>
            <button 
              type="button" 
              className="detail-close-btn"
              onClick={onClose}
              aria-label="Đóng chi tiết"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="product-detail-body hide-scrollbar">
          {/* Gallery & Preview */}
          <div className="detail-gallery-container">
            <div className="detail-main-image-wrap">
              <img 
                src={images[selectedImageIdx] || images[0]} 
                alt={product.title} 
                className="detail-main-img" 
              />
              {discountPercent > 0 && (
                <div className="detail-discount-badge">
                  Tiết kiệm {discountPercent}%
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="detail-thumb-row">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`detail-thumb-btn ${selectedImageIdx === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImageIdx(idx)}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Title */}
          <div className="detail-info-section">
            <div className="detail-price-row">
              <h1 className="detail-current-price">
                {formatVND(product.price)}
              </h1>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="detail-original-price">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>

            <h2 className="detail-product-title">{product.title}</h2>

            <div className="detail-meta-row">
              <div className="detail-meta-item">
                <MapPin size={14} color="#0D9488" />
                <span>{product.location || 'Hà Nội / TP.HCM'} &bull; cách bạn {formatDistance(product.distanceKm)}</span>
              </div>
              <div className="detail-meta-item">
                <Clock size={14} color="#64748B" />
                <span>Đăng {product.postedAt || 'hôm nay'}</span>
              </div>
            </div>
          </div>

          {/* Escrow Guarantee Highlight Card */}
          <div className="detail-escrow-card">
            <div className="detail-escrow-header">
              <div className="detail-escrow-icon-box">
                <ShieldCheck size={20} color="#0D9488" />
              </div>
              <div>
                <strong className="detail-escrow-title">Được bảo vệ 100% bởi Reown Escrow</strong>
                <p className="detail-escrow-sub">
                  Tiền thanh toán được giữ an toàn tại tài khoản bảo chứng. Bạn có 48h kiểm tra hàng, ưng ý mới giải ngân cho người bán.
                </p>
              </div>
            </div>
            <div className="detail-escrow-perks">
              <div className="detail-perk">
                <CheckCircle2 size={14} color="#0D9488" />
                <span>Đồng kiểm khi nhận</span>
              </div>
              <div className="detail-perk">
                <CheckCircle2 size={14} color="#0D9488" />
                <span>48h đổi trả/hoàn tiền 100%</span>
              </div>
              <div className="detail-perk">
                <CheckCircle2 size={14} color="#0D9488" />
                <span>Người bán đã xác thực CCCD</span>
              </div>
            </div>
          </div>

          {/* Description & Specs */}
          <div className="detail-section-block">
            <h3 className="detail-block-title">Mô tả chi tiết từ người bán</h3>
            <p className="detail-desc-text">
              {product.description || 'Sản phẩm chính hãng, ngoại hình đẹp, mọi chức năng hoạt động hoàn hảo. Đầy đủ phụ kiện cáp sạc, tặng kèm ốp lưng cao cấp. Người mua được test trực tiếp trước khi nhận hàng.'}
            </p>
            {product.conditionDetails && (
              <div className="detail-condition-box">
                <strong>Tình trạng ngoại quan:</strong> {product.conditionDetails}
              </div>
            )}
          </div>

          {/* Seller Profile Summary */}
          <div className="detail-seller-card">
            <img 
              src={product.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
              alt={product.seller?.name || 'Người bán'} 
              className="detail-seller-avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => onViewSellerProfile && onViewSellerProfile(product.seller)}
            />
            <div 
              className="detail-seller-info"
              style={{ cursor: 'pointer' }}
              onClick={() => onViewSellerProfile && onViewSellerProfile(product.seller)}
              title="Bấm để xem hồ sơ uy tín của người bán"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="detail-seller-name">{product.seller?.name || 'Hoàng Nam Tech'}</span>
                <span className="verified-badge-pill">
                  <ShieldCheck size={11} />
                  <span>Đã xác minh</span>
                </span>
              </div>
              <div className="detail-seller-metrics">
                <span>⭐ 4.9 (148 đánh giá)</span>
                <span>&bull;</span>
                <span style={{ color: '#0F766E', fontWeight: 600 }}>Xem hồ sơ &rarr;</span>
              </div>
            </div>
            <button 
              type="button" 
              className="detail-seller-chat-btn"
              onClick={() => onChatWithSeller(product)}
            >
              <MessageSquare size={15} />
              <span>Nhắn tin</span>
            </button>
          </div>
        </div>

        {/* Fixed Action Footer Bar */}
        <div className="product-detail-footer-bar">
          <button 
            type="button" 
            className="detail-btn-offer"
            onClick={() => onMakeOffer(product)}
          >
            <Tag size={17} />
            <span>Trả giá</span>
          </button>

          <button 
            type="button" 
            className="detail-btn-buynow"
            onClick={() => onBuyNow(product)}
          >
            <ShoppingBag size={18} />
            <span>Mua ngay ({formatVND(product.price)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
