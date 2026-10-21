import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Sparkles,
  Camera,
  CheckCircle2,
  Gift,
  ThumbsUp,
  Package,
  Truck,
  MessageCircle
} from 'lucide-react';
import { formatVND } from '../utils/formatters';

const QUICK_TAGS = [
  'Máy đẹp keng đúng mô tả',
  'Đóng gói 3 lớp xốp khí dày',
  'Pin chuẩn như cam kết',
  'Người bán nhiệt tình hỗ trợ',
  'Giao hàng hỏa tốc',
  'Zin all chưa bung mở ốc'
];

export default function ReviewScreen({
  order = {
    orderCode: 'REOWN-2025-8829',
    product: {
      title: 'iPhone 14 Pro Max 128GB Tím Deep Purple',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80',
      condition: 'EXCELLENT',
      price: 17800000
    },
    seller: {
      name: 'Nguyễn Văn Minh',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: 4.9
    }
  },
  onBack,
  onSubmitSuccess,
  onBackHome
}) {
  const [overallRating, setOverallRating] = useState(5);
  const [descRating, setDescRating] = useState(5);
  const [packageRating, setPackageRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);

  const [reviewComment, setReviewComment] = useState('Máy dùng rất mượt, pin đúng 89% như bạn Minh báo, đóng gói cực kỳ cẩn thận bọc chống sốc kín mít. Rất yên tâm khi giao dịch bảo chứng qua Reown Escrow!');
  const [selectedTags, setSelectedTags] = useState(['Máy đẹp keng đúng mô tả', 'Đóng gói 3 lớp xốp khí dày']);
  const [uploadedPhotos, setUploadedPhotos] = useState([
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300&auto=format&fit=crop&q=80'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSimulateAddPhoto = () => {
    setUploadedPhotos([
      ...uploadedPhotos,
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (onSubmitSuccess) {
        onSubmitSuccess({
          orderCode: order.orderCode,
          overallRating,
          comment: reviewComment
        });
      }
    }, 800);
  };

  const getStarRatingLabel = (stars) => {
    switch (stars) {
      case 5: return { label: 'Tuyệt vời & Cực kỳ uy tín', color: '#16A34A' };
      case 4: return { label: 'Hài lòng, máy tốt', color: '#0F766E' };
      case 3: return { label: 'Bình thường, tạm ổn', color: '#D97706' };
      case 2: return { label: 'Chưa hài lòng lắm', color: '#EA580C' };
      default: return { label: 'Rất tệ, không đúng cam kết', color: '#DC2626' };
    }
  };

  const starMeta = getStarRatingLabel(overallRating);

  return (
    <div className="review-screen-container">
      {/* HEADER */}
      <div className="review-header-bar">
        <button type="button" className="btn-back-clean" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Quay lại đơn hàng</span>
        </button>
        <div className="review-header-title-box">
          <h1 className="review-main-title">Đánh Giá Người Bán & Xác Thực Giao Dịch</h1>
          <p className="review-sub">Góp phần xây dựng chợ đồ cũ 2hand minh bạch và an toàn</p>
        </div>
      </div>

      {isSubmitted ? (
        /* KHI GỬI ĐÁNH GIÁ THÀNH CÔNG */
        <div className="review-success-card">
          <div className="success-badge-top">
            <CheckCircle2 size={42} color="#0D9488" />
          </div>
          <h2>Cảm ơn bạn đã gửi đánh giá!</h2>
          <p className="success-subtext">
            Đánh giá của bạn đã được ghi nhận vào hồ sơ người bán <strong>{order.seller?.name}</strong>.
          </p>

          <div className="reward-congrats-box">
            <div className="reward-icon"><Gift size={24} color="#D97706" /></div>
            <div>
              <strong>+500 Điểm Tích Lũy Escrow</strong>
              <p>Đã cộng vào ví Reown Rewards của bạn để trừ phí vận chuyển các đơn sau.</p>
            </div>
          </div>

          <div className="success-action-buttons">
            <button type="button" className="btn-primary-action" onClick={onBack}>
              <span>Về trang đơn hàng của tôi</span>
            </button>
            <button type="button" className="btn-outline-action" onClick={onBackHome}>
              <span>Tiếp tục khám phá chợ</span>
            </button>
          </div>
        </div>
      ) : (
        /* FORM ĐÁNH GIÁ */
        <div className="review-form-layout">
          {/* Card sản phẩm được đánh giá */}
          <div className="review-product-banner">
            <img
              src={order.product?.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80'}
              alt={order.product?.title}
              className="product-thumb-sm"
            />
            <div className="product-info-col">
              <h3 className="product-title">{order.product?.title}</h3>
              <div className="product-price">{formatVND(order.product?.price || 17800000)}</div>
              <div className="seller-badge">
                <ShieldCheck size={14} color="#0D9488" />
                <span>Người bán: <strong>{order.seller?.name || 'Nguyễn Văn Minh'}</strong></span>
              </div>
            </div>
          </div>

          <form className="review-main-form" onSubmit={handleSubmit}>
            {/* 1. Đánh giá tổng quan (Stars lớn) */}
            <div className="review-section-box rating-overall-box">
              <label className="section-label">Chất lượng tổng thể giao dịch:</label>
              <div className="stars-row-interactive">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= overallRating ? 'filled' : ''}`}
                    onClick={() => setOverallRating(star)}
                  >
                    <Star
                      size={36}
                      fill={star <= overallRating ? '#F59E0B' : 'transparent'}
                      color={star <= overallRating ? '#F59E0B' : '#CBD5E1'}
                    />
                  </button>
                ))}
              </div>
              <div className="rating-status-text" style={{ color: starMeta.color }}>
                {starMeta.label}
              </div>
            </div>

            {/* 2. Tiêu chí chi tiết Escrow */}
            <div className="review-section-box criteria-box">
              <label className="section-label">Đánh giá theo tiêu chí bảo chứng:</label>

              <div className="criteria-row">
                <div className="criteria-name">
                  <Package size={16} color="#0D9488" />
                  <span>1. Hàng đúng mô tả & tình trạng thực tế:</span>
                </div>
                <div className="criteria-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setDescRating(s)}>
                      <Star size={18} fill={s <= descRating ? '#F59E0B' : 'none'} color={s <= descRating ? '#F59E0B' : '#94A3B8'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="criteria-row">
                <div className="criteria-name">
                  <Truck size={16} color="#0D9488" />
                  <span>2. Đóng gói cẩn thận & an toàn:</span>
                </div>
                <div className="criteria-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setPackageRating(s)}>
                      <Star size={18} fill={s <= packageRating ? '#F59E0B' : 'none'} color={s <= packageRating ? '#F59E0B' : '#94A3B8'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="criteria-row">
                <div className="criteria-name">
                  <MessageCircle size={16} color="#0D9488" />
                  <span>3. Thái độ & tốc độ phản hồi:</span>
                </div>
                <div className="criteria-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setServiceRating(s)}>
                      <Star size={18} fill={s <= serviceRating ? '#F59E0B' : 'none'} color={s <= serviceRating ? '#F59E0B' : '#94A3B8'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Thẻ nhận xét nhanh */}
            <div className="review-section-box quick-tags-box">
              <label className="section-label">Nhận xét nhanh về người bán:</label>
              <div className="quick-tags-wrap">
                {QUICK_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`quick-tag-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      <Sparkles size={12} />
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Nhận xét chi tiết */}
            <div className="review-section-box">
              <label className="section-label">Chia sẻ cảm nhận chi tiết của bạn:</label>
              <textarea
                className="review-textarea"
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Hãy chia sẻ chi tiết về trải nghiệm mua hàng để giúp người mua sau dễ dàng lựa chọn..."
              />
            </div>

            {/* 5. Tải ảnh thực tế */}
            <div className="review-section-box">
              <label className="section-label">Hình ảnh thực tế khi nhận máy:</label>
              <div className="photos-preview-grid">
                {uploadedPhotos.map((photo, i) => (
                  <div key={i} className="photo-thumb-wrap">
                    <img src={photo} alt={`Feedback ${i + 1}`} />
                  </div>
                ))}
                <button
                  type="button"
                  className="add-photo-btn"
                  onClick={handleSimulateAddPhoto}
                >
                  <Camera size={22} color="#0D9488" />
                  <span>Thêm ảnh</span>
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-submit-review-main"
            >
              {isSubmitting ? 'Đang gửi đánh giá...' : 'Gửi Đánh Giá & Nhận 500 Điểm Thưởng'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
