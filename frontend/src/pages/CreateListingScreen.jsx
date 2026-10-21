import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  Camera, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  Sun, 
  Maximize, 
  Lock, 
  Tag, 
  MapPin, 
  Eye, 
  Save, 
  X,
  FileCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { CATEGORIES } from '../mocks/categories';
import { 
  CONDITION_DETAILS_GUIDE, 
  PHOTO_TIPS, 
  MOCK_AI_SUGGESTIONS, 
  INITIAL_DRAFT_STATE 
} from '../mocks/createListing';
import { formatVND, getConditionStyle } from '../utils/formatters';

export default function CreateListingScreen({
  onClose,
  onPublishSuccess,
  onViewPublishedProduct
}) {
  // Wizard steps: 1: Photos -> 2: Info -> 3: Pricing -> 4: Review
  const [currentStep, setCurrentStep] = useState(1);

  // Listing Data State
  const [images, setImages] = useState(INITIAL_DRAFT_STATE.images);
  const [title, setTitle] = useState(INITIAL_DRAFT_STATE.title);
  const [category, setCategory] = useState(INITIAL_DRAFT_STATE.category);
  const [condition, setCondition] = useState(INITIAL_DRAFT_STATE.condition);
  const [description, setDescription] = useState(INITIAL_DRAFT_STATE.description);
  const [location, setLocation] = useState(INITIAL_DRAFT_STATE.location);
  const [price, setPrice] = useState(INITIAL_DRAFT_STATE.price);
  const [allowOffer, setAllowOffer] = useState(INITIAL_DRAFT_STATE.allowOffer);
  const [minAcceptPrice, setMinAcceptPrice] = useState(INITIAL_DRAFT_STATE.minAcceptPrice);

  // UI / Interactive States
  const [lastSavedTime, setLastSavedTime] = useState('vừa xong');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAppliedToast, setAiAppliedToast] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedData, setPublishedData] = useState(null);
  const [activePreviewImageIdx, setActivePreviewImageIdx] = useState(0);

  const fileInputRef = useRef(null);

  // Auto-save draft effect to localStorage
  useEffect(() => {
    const draftPayload = {
      images,
      title,
      category,
      condition,
      description,
      location,
      price,
      allowOffer,
      minAcceptPrice,
      timestamp: Date.now()
    };
    try {
      localStorage.setItem('reown_listing_draft', JSON.stringify(draftPayload));
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLastSavedTime(timeStr);
    } catch (e) {
      console.warn('LocalStorage error on draft auto-save:', e);
    }
  }, [images, title, category, condition, description, location, price, allowOffer, minAcceptPrice]);

  // Handle uploading photos
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImageUrls = files.slice(0, 10 - images.length).map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImageUrls]);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Move photo left/right to rearrange cover
  const handleMoveImage = (idx, direction) => {
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const updated = [...images];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setImages(updated);
  };

  // Remove photo
  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Apply AI Suggestion
  const handleApplyAiSuggestion = (suggestion) => {
    setIsAiLoading(true);
    setTimeout(() => {
      setTitle(suggestion.suggestedTitle);
      setCategory(suggestion.suggestedCategory);
      setCondition(suggestion.suggestedCondition);
      setDescription(suggestion.suggestedDescription);
      setPrice(suggestion.suggestedPrice);
      if (suggestion.priceBenchmark) {
        setMinAcceptPrice(suggestion.priceBenchmark.min);
      }
      setIsAiLoading(false);
      setAiAppliedToast(true);
      setTimeout(() => setAiAppliedToast(false), 3000);
    }, 600);
  };

  // Publish Listing
  const handlePublishListing = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      const newListing = {
        id: `prod_${Date.now()}`,
        code: `POST-${Math.floor(1000 + Math.random() * 9000)}-VN`,
        title,
        price,
        originalPrice: Math.round(price * 1.3),
        category,
        condition,
        description,
        location,
        images,
        allowOffer,
        minAcceptPrice,
        escrowProtected: true,
        postedAt: 'Vừa xong',
        seller: {
          name: 'Nguyễn Xuân Sơn',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isVerified: true
        }
      };
      setPublishedData(newListing);
      if (onPublishSuccess) onPublishSuccess(newListing);
    }, 1000);
  };

  // Price benchmark calculated based on category & price
  const benchmarkMin = Math.round(price * 0.92);
  const benchmarkMax = Math.round(price * 1.08);

  // RENDER: PUBLISH SUCCESS STATE
  if (publishedData) {
    return (
      <div className="publish-success-screen">
        <div className="publish-success-card">
          <div className="publish-success-icon-wrap">
            <CheckCircle2 size={44} color="#0D9488" />
          </div>

          <span className="escrow-secured-pill-large">
            <ShieldCheck size={14} />
            <span>Đã kích hoạt bảo vệ Escrow 100%</span>
          </span>

          <h2 className="publish-success-title">Tin đăng của bạn đã lên sàn thành công!</h2>
          <p className="publish-success-desc">
            Mã tin đăng: <strong>{publishedData.code}</strong>. Món đồ của bạn đã hiển thị công khai tới hàng nghìn người mua gần khu vực <strong>{location}</strong>.
          </p>

          <div className="publish-summary-box">
            <img src={publishedData.images[0]} alt={publishedData.title} className="publish-summary-thumb" />
            <div className="publish-summary-details">
              <h4 className="publish-summary-item-title">{publishedData.title}</h4>
              <div className="publish-summary-price">{formatVND(publishedData.price)}</div>
              <div className="publish-summary-meta">
                <span>Danh mục: {CATEGORIES.find(c => c.id === publishedData.category)?.name || 'Khác'}</span>
                <span>&bull;</span>
                <span>Cho phép trả giá: {publishedData.allowOffer ? 'Có' : 'Không'}</span>
              </div>
            </div>
          </div>

          <div className="publish-success-actions">
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', padding: '13px 20px' }}
              onClick={() => {
                if (onViewPublishedProduct) onViewPublishedProduct(publishedData);
                else onClose();
              }}
            >
              <Eye size={17} />
              <span>Xem tin đăng trên sàn</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', padding: '12px 20px', marginTop: '10px' }}
              onClick={onClose}
            >
              Về trang khám phá
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-listing-page-container">
      {/* Top Floating Notification for AI Application */}
      {aiAppliedToast && (
        <div className="ai-toast-notification">
          <Sparkles size={16} color="#0D9488" />
          <span>Đã điền tự động dữ liệu tối ưu từ AI Reown!</span>
        </div>
      )}

      {/* Header bar with Back button & Auto-save status */}
      <div className="create-listing-nav-header">
        <button
          type="button"
          className="create-listing-back-btn"
          onClick={() => setShowExitConfirm(true)}
        >
          <ArrowLeft size={18} />
          <span>Thoát</span>
        </button>

        <div className="create-listing-header-center">
          <h1 className="create-listing-main-heading">Đăng tin thanh lý đồ 2hand</h1>
          <div className="create-listing-draft-badge">
            <Save size={13} />
            <span>Đã lưu nháp lúc {lastSavedTime}</span>
          </div>
        </div>

        <button
          type="button"
          className="create-listing-close-btn"
          onClick={() => setShowExitConfirm(true)}
        >
          <X size={20} />
        </button>
      </div>

      {/* 4-Step Progress Bar */}
      <div className="listing-stepper-container">
        <div className="stepper-track-bar">
          <div 
            className="stepper-progress-fill" 
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }} 
          />
        </div>

        <div className="stepper-steps-wrapper">
          {[
            { step: 1, label: 'Ảnh sản phẩm' },
            { step: 2, label: 'Thông tin' },
            { step: 3, label: 'Định giá' },
            { step: 4, label: 'Xem lại & Đăng' }
          ].map((item) => (
            <div 
              key={item.step} 
              className={`stepper-step-item ${currentStep === item.step ? 'active' : ''} ${currentStep > item.step ? 'completed' : ''}`}
              onClick={() => setCurrentStep(item.step)}
            >
              <div className="step-circle">
                {currentStep > item.step ? <Check size={14} strokeWidth={3} /> : item.step}
              </div>
              <span className="step-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Content Body */}
      <div className="create-listing-body-grid">
        {/* ================= STEP 1: UPLOAD PHOTOS ================= */}
        {currentStep === 1 && (
          <div className="listing-step-pane">
            <div className="step-pane-header">
              <h2 className="step-pane-title">1. Tải ảnh món đồ (Tối đa 10 ảnh)</h2>
              <p className="step-pane-desc">
                Ảnh bìa đầu tiên quyết định 80% lượt click của người mua. Kéo thả hoặc bấm mũi tên để đổi ảnh bìa.
              </p>
            </div>

            {/* AI Image Scan & Suggestions Block */}
            <div className="ai-suggestion-card">
              <div className="ai-suggestion-header">
                <div className="ai-badge-chip">
                  <Sparkles size={14} />
                  <span>Gợi ý thông minh bởi AI</span>
                </div>
                <span className="ai-subtitle">Tự động nhận diện thiết bị & đề xuất thông tin</span>
              </div>

              <div className="ai-suggestion-body">
                <p className="ai-recognition-text">
                  Hệ thống AI vừa phân tích ảnh của bạn và nhận diện: <strong>iPhone 14 Pro Max (Tím Deep Purple)</strong>.
                </p>
                <div className="ai-suggestion-preview-chips">
                  <span className="ai-chip">Danh mục: Điện thoại</span>
                  <span className="ai-chip">Tình trạng: Rất tốt (95%)</span>
                  <span className="ai-chip">Giá đề xuất: 17.500.000 ₫</span>
                </div>
              </div>

              <div className="ai-suggestion-footer">
                <button
                  type="button"
                  className="btn-use-ai-suggestion"
                  onClick={() => handleApplyAiSuggestion(MOCK_AI_SUGGESTIONS[0])}
                  disabled={isAiLoading}
                >
                  <Sparkles size={15} />
                  <span>{isAiLoading ? 'Đang chuẩn hoá dữ liệu...' : 'Dùng gợi ý bởi AI này'}</span>
                </button>
              </div>
            </div>

            {/* Photo Grid & Upload Area */}
            <div className="photos-management-grid">
              {/* Drag/Drop Box */}
              {images.length < 10 && (
                <div 
                  className="photo-upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                  <div className="upload-icon-circle">
                    <UploadCloud size={24} color="#0D9488" />
                  </div>
                  <strong className="upload-main-text">Tải thêm ảnh ({images.length}/10)</strong>
                  <span className="upload-sub-text">Hỗ trợ JPG, PNG, WEBP</span>
                </div>
              )}

              {/* Uploaded Images List */}
              {images.map((img, idx) => (
                <div key={idx} className={`photo-preview-card ${idx === 0 ? 'is-cover' : ''}`}>
                  <img src={img} alt={`Ảnh ${idx + 1}`} className="photo-preview-img" />

                  {idx === 0 && (
                    <div className="cover-photo-tag">
                      <StarBadge />
                      <span>Ảnh bìa</span>
                    </div>
                  )}

                  {/* Actions overlay */}
                  <div className="photo-actions-overlay">
                    <div className="photo-action-buttons">
                      {idx > 0 && (
                        <button
                          type="button"
                          className="photo-btn-move"
                          onClick={() => handleMoveImage(idx, 'left')}
                          title="Chuyển sang trái làm ảnh bìa"
                        >
                          <ChevronLeft size={16} />
                        </button>
                      )}

                      {idx < images.length - 1 && (
                        <button
                          type="button"
                          className="photo-btn-move"
                          onClick={() => handleMoveImage(idx, 'right')}
                          title="Chuyển sang phải"
                        >
                          <ChevronRight size={16} />
                        </button>
                      )}

                      <button
                        type="button"
                        className="photo-btn-remove"
                        onClick={() => handleRemoveImage(idx)}
                        title="Xoá ảnh này"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Photography Guide Card */}
            <div className="photo-tips-section">
              <h3 className="photo-tips-title">
                <Info size={16} color="#0D9488" />
                <span>Hướng dẫn chụp ảnh chuẩn để bán nhanh & bảo vệ quyền lợi Escrow</span>
              </h3>

              <div className="photo-tips-grid">
                {PHOTO_TIPS.map((tip, idx) => (
                  <div key={idx} className="tip-box-card">
                    <div className="tip-box-icon">
                      {idx === 0 && <Sun size={18} color="#0D9488" />}
                      {idx === 1 && <Maximize size={18} color="#0D9488" />}
                      {idx === 2 && <AlertTriangle size={18} color="#D97706" />}
                      {idx === 3 && <ShieldCheck size={18} color="#0D9488" />}
                    </div>
                    <div>
                      <strong className="tip-box-header">{tip.title}</strong>
                      <p className="tip-box-desc">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: DETAILS & CONDITION ================= */}
        {currentStep === 2 && (
          <div className="listing-step-pane">
            <div className="step-pane-header">
              <h2 className="step-pane-title">2. Thông tin chi tiết món đồ</h2>
              <p className="step-pane-desc">
                Cung cấp đầy đủ thông tin chuẩn xác giúp tin đăng xếp hạng cao trên thanh tìm kiếm.
              </p>
            </div>

            <div className="listing-form-container">
              {/* Tiêu đề */}
              <div className="form-input-group">
                <div className="label-with-counter">
                  <label>Tiêu đề tin đăng <span className="req-star">*</span></label>
                  <span className="char-counter">{title.length}/100</span>
                </div>
                <input
                  type="text"
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: iPhone 14 Pro Max 128GB Tím Deep Purple VN/A..."
                  className="listing-input-text"
                />
                <span className="input-hint-text">
                  Gợi ý: Bao gồm [Tên máy] + [Phiên bản / Dung lượng] + [Màu sắc] + [Tình trạng].
                </span>
              </div>

              {/* Danh mục */}
              <div className="form-input-group">
                <label>Danh mục sản phẩm <span className="req-star">*</span></label>
                <div className="category-select-grid">
                  {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-select-card ${category === cat.id ? 'selected' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      <span className="cat-name">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tình trạng chi tiết */}
              <div className="form-input-group">
                <div className="label-with-counter">
                  <label>Tình trạng thực tế <span className="req-star">*</span></label>
                  <span className="label-sub-note">Quy chuẩn thẩm định Escrow Reown</span>
                </div>

                <div className="condition-options-list">
                  {CONDITION_DETAILS_GUIDE.map((cond) => {
                    const isSelected = condition === cond.id;
                    return (
                      <label
                        key={cond.id}
                        className={`condition-radio-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setCondition(cond.id)}
                      >
                        <input
                          type="radio"
                          name="conditionRadio"
                          checked={isSelected}
                          onChange={() => setCondition(cond.id)}
                        />
                        <div className="condition-card-content">
                          <div className="condition-card-header">
                            <span 
                              className="condition-pill-badge"
                              style={{ color: cond.color, backgroundColor: cond.bg }}
                            >
                              {cond.title}
                            </span>
                          </div>
                          <p className="condition-card-desc">{cond.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Mô tả chi tiết */}
              <div className="form-input-group">
                <div className="label-with-counter">
                  <label>Mô tả chi tiết từ người bán <span className="req-star">*</span></label>
                  <span className="char-counter">{description.length}/1000</span>
                </div>
                <textarea
                  rows={5}
                  maxLength={1000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả nguồn gốc máy, tình trạng pin, phụ kiện đi kèm, các vết trầy xước nếu có..."
                  className="listing-textarea"
                />
              </div>

              {/* Vị trí giao dịch */}
              <div className="form-input-group">
                <label>Vị trí giao dịch / Xem hàng <span className="req-star">*</span></label>
                <div className="location-input-wrapper">
                  <MapPin size={18} color="#0D9488" className="location-icon" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Quận/Huyện, Tỉnh/Thành Phố..."
                    className="listing-input-text with-icon"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PRICING & OFFERS ================= */}
        {currentStep === 3 && (
          <div className="listing-step-pane">
            <div className="step-pane-header">
              <h2 className="step-pane-title">3. Định giá & Cài đặt Trả giá</h2>
              <p className="step-pane-desc">
                Định giá hợp lý dựa theo thị trường giúp sản phẩm thanh lý thành công trong 48 giờ.
              </p>
            </div>

            <div className="listing-form-container">
              {/* Market Reference Benchmark Card */}
              <div className="price-benchmark-card">
                <div className="benchmark-header">
                  <Tag size={18} color="#0D9488" />
                  <div>
                    <strong className="benchmark-title">Giá tham khảo từ các tin tương tự trên Reown</strong>
                    <p className="benchmark-sub">Dữ liệu từ 32 giao dịch đã chốt trong 14 ngày qua</p>
                  </div>
                </div>

                <div className="benchmark-price-range-row">
                  <div className="benchmark-price-col">
                    <span className="benchmark-lbl">Giá thấp nhất</span>
                    <strong className="benchmark-val">{formatVND(benchmarkMin)}</strong>
                  </div>
                  <div className="benchmark-divider">&rarr;</div>
                  <div className="benchmark-price-col">
                    <span className="benchmark-lbl">Khoảng giá tối ưu</span>
                    <strong className="benchmark-val highlight">{formatVND(price)}</strong>
                  </div>
                  <div className="benchmark-divider">&rarr;</div>
                  <div className="benchmark-price-col">
                    <span className="benchmark-lbl">Giá cao nhất</span>
                    <strong className="benchmark-val">{formatVND(benchmarkMax)}</strong>
                  </div>
                </div>
              </div>

              {/* Input Giá bán */}
              <div className="form-input-group">
                <label>Giá bán mong muốn (VNĐ) <span className="req-star">*</span></label>
                <div className="price-input-wrapper">
                  <input
                    type="number"
                    step={50000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="listing-input-price"
                  />
                  <span className="price-currency-tag">₫</span>
                </div>
                <div className="price-readable-text">
                  Bằng chữ: <strong>{formatVND(price)}</strong>
                </div>
              </div>

              {/* Tùy chọn cho phép trả giá */}
              <div className="offer-settings-card">
                <div className="offer-toggle-header">
                  <div>
                    <strong className="offer-toggle-title">Cho phép người mua trả giá (Make Offer)</strong>
                    <p className="offer-toggle-desc">
                      Tăng 40% cơ hội chốt đơn. Người mua có thể gửi đề nghị giá cho bạn xem xét.
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <label className="switch-toggle-label">
                    <input
                      type="checkbox"
                      checked={allowOffer}
                      onChange={(e) => setAllowOffer(e.target.checked)}
                    />
                    <span className="switch-slider" />
                  </label>
                </div>

                {/* Floor price input if allow offer is ON */}
                {allowOffer && (
                  <div className="min-price-box">
                    <div className="min-price-label-row">
                      <label>Giá thấp nhất chấp nhận tự động (Floor Price)</label>
                      <span className="privacy-badge">
                        <Lock size={12} />
                        <span>Chỉ mình bạn thấy</span>
                      </span>
                    </div>

                    <div className="price-input-wrapper">
                      <input
                        type="number"
                        step={50000}
                        value={minAcceptPrice}
                        onChange={(e) => setMinAcceptPrice(Number(e.target.value))}
                        className="listing-input-price small"
                      />
                      <span className="price-currency-tag">₫</span>
                    </div>

                    <span className="input-hint-text">
                      Hệ thống sẽ tự động từ chối ngay các đề nghị dưới <strong>{formatVND(minAcceptPrice)}</strong> để tránh bạn bị spam giá thấp vô lý.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: REVIEW & PUBLISH ================= */}
        {currentStep === 4 && (
          <div className="listing-step-pane">
            <div className="step-pane-header">
              <h2 className="step-pane-title">4. Xem lại trước khi đăng tin</h2>
              <p className="step-pane-desc">
                Dưới đây là giao diện thực tế mà người mua trên toàn sàn sẽ nhìn thấy tin đăng của bạn.
              </p>
            </div>

            {/* Live Product Card Preview Container */}
            <div className="listing-preview-container">
              <div className="preview-top-badge">
                <Eye size={15} />
                <span>Xem trước trực tiếp (Live Buyer Preview)</span>
              </div>

              <div className="preview-product-layout">
                {/* Images column */}
                <div className="preview-images-column">
                  <div className="preview-main-image-wrap">
                    <img 
                      src={images[activePreviewImageIdx] || images[0]} 
                      alt={title} 
                      className="preview-main-img" 
                    />
                    <div className="escrow-pill-tag">
                      <ShieldCheck size={12} strokeWidth={2.5} />
                      <span>Bảo chứng Escrow</span>
                    </div>
                  </div>

                  {images.length > 1 && (
                    <div className="preview-thumbs-row">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`preview-thumb-btn ${activePreviewImageIdx === idx ? 'active' : ''}`}
                          onClick={() => setActivePreviewImageIdx(idx)}
                        >
                          <img src={img} alt={`Thumb ${idx}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details column */}
                <div className="preview-info-column">
                  <div className="preview-tags-row">
                    {(() => {
                      const condStyle = getConditionStyle(condition);
                      return (
                        <span 
                          className="product-condition-tag"
                          style={{ color: condStyle.color, backgroundColor: condStyle.bg }}
                        >
                          {condStyle.label}
                        </span>
                      );
                    })()}
                    <span className="preview-category-tag">
                      {CATEGORIES.find(c => c.id === category)?.name || 'Đồ công nghệ'}
                    </span>
                  </div>

                  <h3 className="preview-item-title">{title}</h3>

                  <div className="preview-price-box">
                    <span className="preview-price-bold">{formatVND(price)}</span>
                    {allowOffer && (
                      <span className="preview-allow-offer-tag">
                        <Tag size={12} />
                        <span>Có thể trả giá</span>
                      </span>
                    )}
                  </div>

                  <div className="preview-location-line">
                    <MapPin size={14} color="#0D9488" />
                    <span>{location}</span>
                  </div>

                  {/* Escrow Guarantee Highlight */}
                  <div className="preview-escrow-box">
                    <ShieldCheck size={18} color="#0D9488" />
                    <div>
                      <strong>Giao dịch qua Reown Escrow</strong>
                      <p>Tiền giữ an toàn 48 giờ. Người mua kiểm hàng ưng ý mới giải ngân về ví của bạn.</p>
                    </div>
                  </div>

                  <div className="preview-desc-section">
                    <strong className="preview-desc-header">Mô tả sản phẩm:</strong>
                    <p className="preview-desc-body">{description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= BOTTOM ACTION BAR ================= */}
        <div className="create-listing-footer-bar">
          <div className="footer-left-status">
            <Save size={14} color="#64748B" />
            <span>Tự động lưu nháp: {lastSavedTime}</span>
          </div>

          <div className="footer-action-buttons">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-wizard-prev"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                <ArrowLeft size={16} />
                <span>Quay lại</span>
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                className="btn-wizard-next"
                onClick={() => setCurrentStep((prev) => prev + 1)}
              >
                <span>Tiếp tục bước {currentStep + 1}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn-wizard-publish"
                onClick={handlePublishListing}
                disabled={isPublishing}
              >
                <FileCheck size={18} />
                <span>{isPublishing ? 'Đang kích hoạt tin...' : 'Xác nhận Đăng tin ngay'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="modal-backdrop-overlay" onClick={() => setShowExitConfirm(false)}>
          <div className="modal-dialog-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <h3 className="modal-dialog-title">Lưu nháp tin đăng?</h3>
              <button 
                type="button" 
                className="modal-dialog-close" 
                onClick={() => setShowExitConfirm(false)}
              >
                <X size={18} />
              </button>
            </div>

            <p className="modal-dialog-body-text">
              Bạn đang tạo dở tin đăng. Nội dung đã được tự động lưu tạm trên thiết bị này. Bạn có muốn thoát về trang chủ không?
            </p>

            <div className="modal-dialog-footer-actions">
              <button
                type="button"
                className="btn-dialog-secondary"
                onClick={() => setShowExitConfirm(false)}
              >
                Tiếp tục chỉnh sửa
              </button>

              <button
                type="button"
                className="btn-dialog-primary"
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose();
                }}
              >
                Lưu nháp và Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Small helper badge
function StarBadge() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
