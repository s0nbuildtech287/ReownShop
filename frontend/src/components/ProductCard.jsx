import React, { useState } from 'react';
import { Heart, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { formatVND, formatDistance, getConditionStyle } from '../utils/formatters';

export default function ProductCard({ product, onClick, isListView = false }) {
  const [isLiked, setIsLiked] = useState(false);
  const conditionStyle = getConditionStyle(product.condition);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  if (isListView) {
    return (
      <article className="product-card-list-mode" onClick={() => onClick(product)}>
        <div className="product-list-image-box">
          <img
            src={product.images[0]}
            alt={product.title}
            className="product-image"
            loading="lazy"
          />

          {product.escrowProtected && (
            <div className="escrow-pill-tag">
              <ShieldCheck size={11} strokeWidth={2.5} />
              <span>Escrow</span>
            </div>
          )}

          <button
            type="button"
            className={`product-fav-btn ${isLiked ? 'active' : ''}`}
            onClick={handleHeartClick}
            aria-label="Yêu thích"
          >
            <Heart size={15} fill={isLiked ? '#EF4444' : 'none'} />
          </button>
        </div>

        <div className="product-list-info-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              className="product-condition-tag"
              style={{ color: conditionStyle.color, backgroundColor: conditionStyle.bg }}
            >
              {conditionStyle.label}
            </span>
            <div className="product-distance">
              <MapPin size={12} />
              <span>{formatDistance(product.distanceKm)}</span>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-light)', marginLeft: 'auto' }}>
              {product.postedAt}
            </span>
          </div>

          <h3 className="product-list-title" title={product.title}>
            {product.title}
          </h3>

          <p className="product-list-desc">
            {product.description || product.conditionDetails}
          </p>

          <div className="product-list-footer">
            <div className="product-price-box">
              <div className="product-price-bold">
                {formatVND(product.price)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="product-original-price">
                  {formatVND(product.originalPrice)}
                </div>
              )}
            </div>

            <button type="button" className="product-list-view-btn">
              <span>Xem chi tiết</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="product-card" onClick={() => onClick(product)}>
      <div className="product-image-box">
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />

        {product.escrowProtected && (
          <div className="escrow-pill-tag">
            <ShieldCheck size={11} strokeWidth={2.5} />
            <span>Escrow</span>
          </div>
        )}

        <button
          type="button"
          className={`product-fav-btn ${isLiked ? 'active' : ''}`}
          onClick={handleHeartClick}
          aria-label="Yêu thích"
        >
          <Heart size={15} fill={isLiked ? '#EF4444' : 'none'} />
        </button>
      </div>

      <div className="product-info-body">
        <span
          className="product-condition-tag"
          style={{ color: conditionStyle.color, backgroundColor: conditionStyle.bg }}
        >
          {conditionStyle.label}
        </span>

        <h3 className="product-title" title={product.title}>
          {product.title}
        </h3>

        <div className="product-price-box">
          <div className="product-price-bold">
            {formatVND(product.price)}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="product-original-price">
              {formatVND(product.originalPrice)}
            </div>
          )}
        </div>

        <div className="product-meta-footer">
          <div className="product-distance">
            <MapPin size={12} />
            <span>{formatDistance(product.distanceKm)}</span>
          </div>
          <span>{product.postedAt}</span>
        </div>
      </div>
    </article>
  );
}
