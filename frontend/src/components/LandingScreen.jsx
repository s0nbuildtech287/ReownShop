import React, { useRef } from 'react';
import { ArrowRight, Check, ChevronRight, Play, PlusCircle, ShieldCheck, Sparkles, Store } from 'lucide-react';
import { MOCK_PRODUCTS } from '../mocks/products';
import { formatVND } from '../utils/formatters';

export default function LandingScreen({ onExplore, onSell, onLogin }) {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 3);
  const visualRef = useRef(null);

  const handleVisualMove = (event) => {
    const visual = visualRef.current;
    if (!visual) return;
    const rect = visual.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    visual.style.setProperty('--scene-x', `${x.toFixed(3)}`);
    visual.style.setProperty('--scene-y', `${y.toFixed(3)}`);
  };

  const resetVisual = () => {
    visualRef.current?.style.setProperty('--scene-x', '0');
    visualRef.current?.style.setProperty('--scene-y', '0');
  };

  return (
    <section className="landing-screen">
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />
      <div className="landing-aurora landing-aurora-one" />
      <div className="landing-aurora landing-aurora-two" />
      <div className="landing-aurora landing-aurora-three" />
      <div className="landing-noise" />
      <header className="landing-header">
        <button type="button" className="landing-brand" onClick={onExplore}>
          <span className="landing-brand-icon"><ShieldCheck size={22} /></span>
          <span><strong>ReownShop</strong><small>Chợ 2hand bảo chứng Escrow</small></span>
        </button>
        <div className="landing-header-actions">
          <button type="button" className="landing-login-link" onClick={onLogin}>Đăng nhập</button>
          <button type="button" className="landing-header-cta" onClick={onSell}><PlusCircle size={16} /> Đăng bán</button>
        </div>
      </header>

      <div className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow"><Sparkles size={15} /> Mua bán đồ đã qua sử dụng an tâm hơn</div>
          <h1>Món đồ có câu chuyện.<br /><span>Giao dịch có bảo chứng.</span></h1>
          <p className="landing-hero-description">Tìm món đồ secondhand chất lượng, trả giá minh bạch và chỉ giải ngân khi bạn thật sự hài lòng.</p>
          <div className="landing-hero-actions">
            <button type="button" className="landing-primary-cta" onClick={onExplore}>Khám phá sản phẩm <ArrowRight size={18} /></button>
            <button type="button" className="landing-secondary-cta" onClick={onLogin}><Play size={16} fill="currentColor" /> Xem cách Escrow hoạt động</button>
          </div>
          <div className="landing-proof-row">
            <div className="landing-proof-avatars"><span>TN</span><span>MA</span><span>HS</span><b>+2k</b></div>
            <div><strong>2.000+ giao dịch an tâm</strong><small>Được cộng đồng Reown tin chọn</small></div>
          </div>
        </div>

        <div ref={visualRef} className="landing-visual" onMouseMove={handleVisualMove} onMouseLeave={resetVisual} aria-label="Món đồ nổi bật trên ReownShop">
          <div className="landing-glow-ring" />
          <div className="landing-scene-grid" />
          <div className="landing-scene-particle landing-scene-particle-one" />
          <div className="landing-scene-particle landing-scene-particle-two" />
          <div className="landing-scene-particle landing-scene-particle-three" />
          <div className="landing-float-chip landing-float-chip-top"><ShieldCheck size={16} /><span>Escrow protected</span></div>
          <div className="landing-product-card landing-product-card-main">
            <div className="landing-product-image-wrap"><img src={featuredProducts[0]?.images?.[0]} alt={featuredProducts[0]?.title} /></div>
            <div className="landing-product-card-body"><span className="landing-product-tag">Được kiểm chứng</span><h3>{featuredProducts[0]?.title}</h3><strong>{formatVND(featuredProducts[0]?.price)}</strong><small>Hoàng Nam Tech · 1,4 km</small></div>
          </div>
          <div className="landing-product-card landing-product-card-back landing-product-card-back-one"><img src={featuredProducts[1]?.images?.[0]} alt={featuredProducts[1]?.title} /></div>
          <div className="landing-product-card landing-product-card-back landing-product-card-back-two"><img src={featuredProducts[2]?.images?.[0]} alt={featuredProducts[2]?.title} /></div>
          <div className="landing-float-chip landing-float-chip-bottom"><span className="landing-status-dot" /> Tiền chỉ được giải ngân khi bạn xác nhận</div>
        </div>
      </div>

      <div className="landing-feature-strip">
        <div><span className="landing-feature-icon"><ShieldCheck size={18} /></span><span><strong>Escrow bảo vệ</strong><small>Giữ tiền trung gian an toàn</small></span></div>
        <div><span className="landing-feature-icon"><Check size={18} /></span><span><strong>Đồ thật, mô tả thật</strong><small>Thông tin rõ ràng từ người bán</small></span></div>
        <div><span className="landing-feature-icon"><Store size={18} /></span><span><strong>Người bán đáng tin</strong><small>Hồ sơ và lịch sử minh bạch</small></span></div>
        <button type="button" className="landing-strip-link" onClick={onExplore}>Bắt đầu khám phá <ChevronRight size={16} /></button>
      </div>
    </section>
  );
}
