import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  TrendingDown,
  ShoppingBag,
  Tag,
  ShieldCheck,
  MapPin,
  Trash2,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MOCK_FAVORITES } from '../mocks/favoritesData';
import { formatVND, getConditionStyle } from '../utils/formatters';

export default function FavoritesScreen({
  onBack,
  onSelectProduct,
  onBuyNow,
  onMakeOffer,
  onBackHome
}) {
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'DROPPED' | 'AVAILABLE'

  const handleRemoveFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  const filteredItems = favorites.filter((item) => {
    if (filterMode === 'DROPPED') return item.priceDropped > 0;
    if (filterMode === 'AVAILABLE') return item.isAvailable;
    return true;
  });

  return (
    <div className="favorites-screen-container">
      {/* HEADER */}
      <div className="fav-header-panel">
        <div className="fav-header-left">
          <button type="button" className="btn-back-clean" onClick={onBack}>
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </button>
          <div className="fav-title-group">
            <h1 className="fav-main-title">Món Đồ Đã Lưu (Yêu Thích)</h1>
            <span className="fav-count-pill">{favorites.length} sản phẩm</span>
          </div>
        </div>

        {/* Quick filter pills */}
        <div className="fav-filter-pills">
          <button
            type="button"
            className={`filter-pill-btn ${filterMode === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterMode('ALL')}
          >
            Tất cả ({favorites.length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filterMode === 'DROPPED' ? 'active' : ''}`}
            onClick={() => setFilterMode('DROPPED')}
          >
            <TrendingDown size={14} />
            <span>Đang hạ giá</span>
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filterMode === 'AVAILABLE' ? 'active' : ''}`}
            onClick={() => setFilterMode('AVAILABLE')}
          >
            Còn hàng
          </button>
        </div>
      </div>

      {/* LIST OR GRID */}
      {filteredItems.length === 0 ? (
        <div className="fav-empty-state">
          <Heart size={44} color="#CBD5E1" />
          <h3>Chưa có sản phẩm yêu thích nào</h3>
          <p>Hãy bấm vào biểu tượng trái tim ở các tin đăng bạn quan tâm để theo dõi biến động giá.</p>
          <button type="button" className="btn-explore-now" onClick={onBackHome || onBack}>
            Khám phá chợ đồ cũ ngay
          </button>
        </div>
      ) : (
        <div className="fav-grid-list">
          {filteredItems.map((item) => {
            const cond = getConditionStyle(item.condition);
            return (
              <div
                key={item.id}
                className="fav-product-card"
                onClick={() => onSelectProduct && onSelectProduct(item)}
              >
                {/* Thumb */}
                <div className="fav-card-image-wrap">
                  <img src={item.image} alt={item.title} />
                  <span
                    className="fav-cond-badge"
                    style={{ background: cond.bg, color: cond.color }}
                  >
                    {item.condition}
                  </span>

                  {item.priceDropped > 0 && (
                    <span className="fav-discount-tag">
                      <TrendingDown size={12} />
                      <span>Giảm {formatVND(item.priceDropped)}</span>
                    </span>
                  )}

                  <button
                    type="button"
                    className="fav-remove-icon-btn"
                    title="Bỏ thích"
                    onClick={(e) => handleRemoveFavorite(item.id, e)}
                  >
                    <Heart size={16} fill="#EF4444" color="#EF4444" />
                  </button>
                </div>

                {/* Content */}
                <div className="fav-card-body">
                  <h3 className="fav-product-name">{item.title}</h3>

                  <div className="fav-price-row">
                    <span className="fav-current-price">{formatVND(item.price)}</span>
                    {item.originalPrice > item.price && (
                      <span className="fav-old-price">{formatVND(item.originalPrice)}</span>
                    )}
                  </div>

                  <div className="fav-seller-row">
                    <div className="fav-seller-meta">
                      <ShieldCheck size={13} color="#0D9488" />
                      <span>{item.seller.name} &bull; ⭐ {item.seller.rating}</span>
                    </div>
                    <div className="fav-location-meta">
                      <MapPin size={12} color="#64748B" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="fav-card-actions">
                    <button
                      type="button"
                      className="btn-fav-offer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMakeOffer && onMakeOffer(item);
                      }}
                    >
                      <Tag size={14} />
                      <span>Trả giá</span>
                    </button>

                    <button
                      type="button"
                      className="btn-fav-buy"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyNow && onBuyNow(item);
                      }}
                    >
                      <ShoppingBag size={14} />
                      <span>Mua ngay</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
