import React from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Sparkles, 
  Home, 
  ShoppingBag, 
  MessageSquare, 
  User, 
  PlusCircle, 
  Wallet,
  Store,
  Heart
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  onTabChange, 
  onLogoClick, 
  onNotificationClick,
  onOpenNotifications,
  onOpenFavorites,
  onOpenEscrowInfo,
  onOpenAuth,
  onPostListing,
  onOpenSellerDashboard
}) {
  return (
    <header className="top-header">
      <div className="top-header-inner">
        {/* Brand Logo & Slogan */}
        <div className="brand-badge" onClick={onLogoClick || (() => onTabChange && onTabChange('home'))}>
          <div className="brand-logo-icon">
            <ShieldCheck size={22} strokeWidth={2.4} />
          </div>
          <div className="brand-info">
            <div className="brand-title">ReownShop</div>
            <div className="brand-subtitle">
              <Sparkles size={11} />
              <span>Chợ 2hand Bảo Chứng Escrow</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links (Visible on screens >= 768px) */}
        <nav className="desktop-nav">
          <button
            type="button"
            className={`desktop-nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => onTabChange && onTabChange('home')}
          >
            <Home size={17} />
            <span>Khám phá</span>
          </button>

          <button
            type="button"
            className={`desktop-nav-link ${activeTab === 'seller-dashboard' ? 'active' : ''}`}
            onClick={onOpenSellerDashboard}
            style={{ fontWeight: 700, color: activeTab === 'seller-dashboard' ? 'var(--primary)' : '#0F766E' }}
            title="Dashboard Người Bán: Quản lý tin đăng, duyệt trả giá, đơn bán Escrow"
          >
            <Store size={17} />
            <span>Kênh người bán</span>
            <span className="nav-pill-count" style={{ background: '#0D9488', color: 'white' }}>1</span>
          </button>

          <button
            type="button"
            className={`desktop-nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => onTabChange && onTabChange('orders')}
          >
            <ShoppingBag size={17} />
            <span>Đơn mua</span>
            <span className="nav-badge-dot" />
          </button>

          <button
            type="button"
            className={`desktop-nav-link ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => onTabChange && onTabChange('messages')}
          >
            <MessageSquare size={17} />
            <span>Tin nhắn</span>
            <span className="nav-pill-count">1</span>
          </button>

          <button
            type="button"
            className={`desktop-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => onTabChange && onTabChange('profile')}
          >
            <User size={17} />
            <span>Tài khoản & Ví</span>
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Quick Auth Button */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="btn-header-auth"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 13px',
              borderRadius: '9999px',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Đăng nhập / Đăng ký tài khoản"
          >
            <User size={15} color="#0D9488" />
            <span className="auth-btn-label">Đăng nhập</span>
          </button>

          {/* Desktop Post New Listing Button */}
          <button
            type="button"
            className="btn-post-listing"
            onClick={onPostListing || (() => alert('Đăng tin'))}
          >
            <PlusCircle size={16} />
            <span>Đăng tin</span>
          </button>

          {/* Wishlist Heart Icon */}
          <button
            type="button"
            className="icon-button"
            aria-label="Yêu thích"
            onClick={onOpenFavorites}
            title="Món đồ đã lưu (Yêu thích)"
          >
            <Heart size={19} color="#0D9488" />
          </button>

          {/* Notification Bell */}
          <button 
            type="button"
            className="icon-button" 
            aria-label="Thông báo" 
            onClick={onOpenNotifications || onNotificationClick}
            title="Trung tâm thông báo Escrow"
          >
            <Bell size={19} />
            <span className="notification-badge" />
          </button>

          {/* User Mini Avatar on Desktop */}
          <div 
            className="desktop-user-avatar-btn"
            onClick={() => onTabChange && onTabChange('profile')}
            title="Nguyễn Xuân Sơn"
          >
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
              alt="Avatar" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
