import React, { useState } from 'react';
import {
  ArrowLeft,
  Tag,
  ShieldCheck,
  TrendingDown,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Send,
  Zap,
  Info
} from 'lucide-react';
import { MAKE_OFFER_BENCHMARK } from '../mocks/offerBenchmarks';
import { formatVND } from '../utils/formatters';

export default function MakeOfferScreen({
  product = MAKE_OFFER_BENCHMARK,
  onBack,
  onOfferSubmitted,
  onGoToChat
}) {
  const listingPrice = product.listingPrice || product.price || 17800000;
  
  // Offer amount state (Default -8% from listing price)
  const defaultOffer = Math.round((listingPrice * 0.92) / 50000) * 50000;
  const [offerPrice, setOfferPrice] = useState(defaultOffer);
  const [buyerNote, setBuyerNote] = useState('Mình ở gần có thể qua test máy và lấy ngay trong ngày.');
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedOfferData, setSubmittedOfferData] = useState(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Calculations
  const savedAmount = Math.max(0, listingPrice - offerPrice);
  const discountPercent = Math.round((savedAmount / listingPrice) * 100);

  // Success chance estimation
  let successChance = { label: 'Rất cao (90%)', color: '#16A34A', bg: '#DCFCE7' };
  if (discountPercent > 20) {
    successChance = { label: 'Thấp (20%)', color: '#DC2626', bg: '#FEE2E2' };
  } else if (discountPercent > 12) {
    successChance = { label: 'Cân nhắc (50%)', color: '#D97706', bg: '#FEF3C7' };
  } else if (discountPercent > 5) {
    successChance = { label: 'Khả quan (80%)', color: '#0F766E', bg: '#CCFBF1' };
  }

  const handleQuickPercent = (percent) => {
    const newPrice = Math.round((listingPrice * (1 - percent / 100)) / 50000) * 50000;
    setOfferPrice(newPrice);
  };

  const handleSubmitOffer = () => {
    if (offerPrice < listingPrice * 0.5) {
      showToast('Mức giá quá thấp, vui lòng nâng giá đề xuất để người bán xem xét.');
      return;
    }
    if (offerPrice >= listingPrice) {
      showToast('Giá đề xuất bằng hoặc cao hơn giá niêm yết. Bạn có thể bấm "Mua ngay"!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const resultData = {
        offerId: `OFFER-${Math.floor(1000 + Math.random() * 9000)}`,
        productTitle: product.title,
        listingPrice: listingPrice,
        offerPrice: offerPrice,
        savedAmount: savedAmount,
        discountPercent: discountPercent,
        buyerNote: buyerNote,
        submittedAt: 'Vừa xong',
        expiresIn: '23 giờ 59 phút',
        seller: product.seller || { name: 'Người bán', responseTime: 'trong 5 phút' }
      };
      setSubmittedOfferData(resultData);
      setIsSuccess(true);
      if (onOfferSubmitted) onOfferSubmitted(resultData);
    }, 1000);
  };

  return (
    <div className="make-offer-screen-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="seller-dashboard-toast">
          <AlertCircle size={16} color="#F59E0B" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="offer-screen-header">
        <button type="button" className="btn-back-profile" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Quay lại sản phẩm</span>
        </button>

        <div className="offer-header-title-box">
          <h1 className="offer-header-title">Đàm Phán Trả Giá Qua Escrow</h1>
          <p className="offer-header-sub">
            Cam kết giá độc quyền &bull; Người bán chấp nhận là chuyển đơn ngay
          </p>
        </div>

        <div className="offer-shield-badge">
          <ShieldCheck size={16} color="#0D9488" />
          <span>Không mất tiền cọc trước</span>
        </div>
      </div>

      {!isSuccess ? (
        <div className="offer-layout-grid">
          {/* CỘT TRÁI: THÔNG TIN SẢN PHẨM & NGƯỜI BÁN */}
          <div className="offer-product-summary-column">
            <div className="offer-product-info-card">
              <img 
                src={product.images ? product.images[0] : (product.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80')} 
                alt={product.title} 
                className="offer-product-thumb" 
              />
              
              <div className="offer-product-meta-block">
                <span className="offer-product-cat">{product.category || 'Công nghệ & Điện tử'}</span>
                <h3 className="offer-product-name">{product.title}</h3>
                
                <div className="offer-original-pricing">
                  <div className="price-item">
                    <span className="price-label">Giá niêm yết:</span>
                    <strong className="price-number">{formatVND(listingPrice)}</strong>
                  </div>
                  {product.originalPrice && (
                    <div className="price-item original">
                      <span className="price-label">Giá mua mới:</span>
                      <span className="old-number">{formatVND(product.originalPrice)}</span>
                    </div>
                  )}
                </div>

                <div className="offer-condition-tag">
                  <span>Tình trạng: <strong>{product.condition || 'Như mới 99%'}</strong></span>
                </div>
              </div>

              {/* Seller mini profile */}
              <div className="offer-seller-strip">
                <img 
                  src={product.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                  alt={product.seller?.name || 'Người bán'} 
                  className="seller-strip-avatar" 
                />
                <div style={{ flex: 1 }}>
                  <strong className="seller-strip-name">{product.seller?.name || 'Nguyễn Văn Minh'}</strong>
                  <div className="seller-strip-sub">
                    <span>⭐ {product.seller?.rating || 4.9} uy tín</span>
                    <span>&bull;</span>
                    <span>Phản hồi {product.seller?.responseTime || 'trong 5 phút'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow Mechanism Explanation Box */}
            <div className="offer-escrow-rule-card">
              <ShieldCheck size={20} color="#0D9488" style={{ flexShrink: 0 }} />
              <div>
                <strong>Cơ chế trả giá minh bạch Reown Escrow:</strong>
                <p>
                  Đề nghị giá của bạn có thời hạn <strong>24 giờ</strong>. Khi người bán bấm <strong>"Chấp nhận"</strong>, mức giá này được khóa độc quyền cho bạn trong 24h để thanh toán qua Escrow. Không sợ người khác mua mất.
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM TRẢ GIÁ & THANH TRƯỢT ĐÀM PHÁN */}
          <div className="offer-form-column">
            <div className="offer-negotiation-card">
              <div className="negotiation-card-header">
                <Tag size={19} color="#0D9488" />
                <h3 className="negotiation-card-title">Mức giá bạn muốn mua</h3>
              </div>

              {/* Price Display & Savings Display */}
              <div className="offer-display-hero">
                <div className="offer-price-number-box">
                  <span className="hero-price-label">Giá bạn đề xuất:</span>
                  <div className="hero-price-input-row">
                    <input
                      type="number"
                      step={50000}
                      min={Math.round(listingPrice * 0.5)}
                      max={listingPrice}
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="hero-price-input"
                    />
                    <span className="hero-price-currency">₫</span>
                  </div>
                </div>

                <div className="offer-savings-callout">
                  <div className="savings-badge">
                    <TrendingDown size={14} />
                    <span>Tiết kiệm {formatVND(savedAmount)} (-{discountPercent}%)</span>
                  </div>
                  <div 
                    className="chance-badge"
                    style={{ background: successChance.bg, color: successChance.color }}
                  >
                    <span>Cơ hội chốt: {successChance.label}</span>
                  </div>
                </div>
              </div>

              {/* Slider for Price Tuning */}
              <div className="offer-slider-block">
                <div className="slider-labels-row">
                  <span>Giá thấp nhất gợi ý ({formatVND(listingPrice * 0.7)})</span>
                  <span>Giá niêm yết ({formatVND(listingPrice)})</span>
                </div>
                <input
                  type="range"
                  min={Math.round((listingPrice * 0.7) / 50000) * 50000}
                  max={listingPrice}
                  step={50000}
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="offer-range-slider"
                />
              </div>

              {/* Quick Percentage Buttons */}
              <div className="quick-discounts-section">
                <span className="section-small-label">Mức giảm phổ biến:</span>
                <div className="quick-discounts-pills">
                  {MAKE_OFFER_BENCHMARK.quickDiscounts.map((item) => (
                    <button
                      key={item.percent}
                      type="button"
                      className={`btn-discount-pill ${discountPercent === item.percent ? 'active' : ''}`}
                      onClick={() => handleQuickPercent(item.percent)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / Message to Seller */}
              <div className="offer-note-section">
                <label className="section-small-label" htmlFor="offerNoteInput">
                  Lời nhắn gửi người bán (Giúp tăng tỷ lệ đồng ý):
                </label>
                <textarea
                  id="offerNoteInput"
                  rows={3}
                  value={buyerNote}
                  onChange={(e) => setBuyerNote(e.target.value)}
                  placeholder="Nhập lý do hoặc thiện chí mua..."
                  className="offer-note-textarea"
                />

                {/* Quick message chips */}
                <div className="quick-messages-chips">
                  {MAKE_OFFER_BENCHMARK.quickMessages.map((msg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn-quick-message-chip"
                      onClick={() => setBuyerNote(msg)}
                    >
                      "{msg}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="btn-submit-offer-action"
                disabled={isSubmitting}
                onClick={handleSubmitOffer}
              >
                {isSubmitting ? (
                  <span>Đang gửi đề nghị...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Gửi đề xuất giá {formatVND(offerPrice)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* MÀN HÌNH XÁC NHẬN ĐÃ GỬI ĐỀ NGHỊ GIÁ THÀNH CÔNG */
        <div className="offer-success-card">
          <div className="success-icon-badge">
            <CheckCircle2 size={44} color="#16A34A" />
          </div>

          <h2 className="success-title">Đã gửi đề nghị giá thành công!</h2>
          <p className="success-desc">
            Người bán <strong>{submittedOfferData?.seller.name}</strong> đã nhận được thông báo đề xuất mức giá <strong>{formatVND(submittedOfferData?.offerPrice)}</strong> cho sản phẩm <strong>{submittedOfferData?.productTitle}</strong>.
          </p>

          <div className="offer-receipt-details-box">
            <div className="receipt-row">
              <span>Mã đề nghị:</span>
              <strong>{submittedOfferData?.offerId}</strong>
            </div>
            <div className="receipt-row">
              <span>Giá niêm yết:</span>
              <span>{formatVND(submittedOfferData?.listingPrice)}</span>
            </div>
            <div className="receipt-row">
              <span>Giá bạn đề xuất:</span>
              <strong className="text-teal">{formatVND(submittedOfferData?.offerPrice)}</strong>
            </div>
            <div className="receipt-row">
              <span>Mức tiết kiệm:</span>
              <span className="text-emerald-600 font-bold">-{formatVND(submittedOfferData?.savedAmount)} (-{submittedOfferData?.discountPercent}%)</span>
            </div>
            <div className="receipt-row">
              <span>Thời gian chờ phản hồi:</span>
              <span className="text-amber-600 font-bold">{submittedOfferData?.expiresIn}</span>
            </div>
            {submittedOfferData?.buyerNote && (
              <div className="receipt-note-row">
                <span>Lời nhắn gửi kèm:</span>
                <p>"{submittedOfferData?.buyerNote}"</p>
              </div>
            )}
          </div>

          <div className="success-actions-row">
            <button
              type="button"
              className="btn-success-chat"
              onClick={() => onGoToChat && onGoToChat(submittedOfferData)}
            >
              <MessageSquare size={16} />
              <span>Mở hộp chat trao đổi thêm</span>
            </button>

            <button
              type="button"
              className="btn-success-back"
              onClick={onBack}
            >
              <span>Về trang sản phẩm</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
