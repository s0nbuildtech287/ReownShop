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
  Wallet 
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  onTabChange, 
  onLogoClick, 
  onNotificationClick,
  onOpenEscrowInfo 
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
          {/* Desktop Post New Listing Button */}
          <button
            type="button"
            className="btn-post-listing"
            onClick={() => alert('Chức năng: Đăng tin bán đồ cũ (Chụp ảnh -> AI gợi ý tiêu đề & giá -> Đăng tin bảo vệ Escrow)')}
          >
            <PlusCircle size={16} />
            <span>Đăng tin</span>
          </button>

          {/* Notification Bell */}
          <button 
            className="icon-button" 
            aria-label="Thông báo" 
            onClick={onNotificationClick}
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
