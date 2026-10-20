import React, { useState } from 'react';
import { Home, ShoppingBag, MessageSquare, User, ShieldCheck } from 'lucide-react';
import Header from './components/Header';
import HomeScreen from './pages/HomeScreen';
import MessagesScreen from './pages/MessagesScreen';
import ProfileScreen from './pages/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  const showToast = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 3200);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    showToast(`Đã chọn "${product.title}" — Sẵn sàng cho Màn 2 (Chi tiết sản phẩm)!`);
  };

  const handleViewOrder = () => {
    setActiveTab('orders');
    showToast('Chuyển hướng đến Màn 3: Theo dõi đơn hàng & Escrow');
  };

  return (
    <div className="app-container">
      {/* Universal Responsive Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogoClick={() => setActiveTab('home')}
        onNotificationClick={() => showToast('Thông báo: Reown Escrow đang bảo chứng các giao dịch của bạn.')}
        onOpenEscrowInfo={() => setShowEscrowModal(true)}
      />

      {/* Toast Notification */}
      {notificationMsg && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.94)',
          color: 'white',
          padding: '10px 18px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: '500',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '90%',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <ShieldCheck size={16} color="#0D9488" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content-area">
        <div className="page-content-wrapper">
          {activeTab === 'home' && (
          <HomeScreen
            onSelectProduct={handleSelectProduct}
            onViewOrder={handleViewOrder}
            onViewMessages={() => setActiveTab('messages')}
            onOpenAboutEscrow={() => setShowEscrowModal(true)}
          />
        )}

        {activeTab === 'orders' && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#F0FDFA',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#0D9488'
            }}>
              <ShoppingBag size={32} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Màn 3: Theo dõi đơn hàng
            </h2>
            <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '20px' }}>
              Timeline 5 trạng thái Escrow, đồng hồ đếm ngược giữ hàng và nút xác nhận/khiếu nại.
            </p>
            <button
              type="button"
              className="btn-primary"
              style={{ display: 'inline-flex', padding: '0 24px' }}
              onClick={() => setActiveTab('home')}
            >
              Về trang tìm kiếm
            </button>
          </div>
        )}

        {activeTab === 'messages' && (
          <MessagesScreen
            onSelectChat={(chat) => showToast(`Mở hộp thoại với ${chat.sellerName}`)}
            onBackHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            onViewOrders={() => setActiveTab('orders')}
            onShowEscrowHelp={() => setShowEscrowModal(true)}
          />
        )}
        </div>
      </main>

      {/* Escrow Explained Modal */}
      {showEscrowModal && (
        <div className="bottomsheet-overlay" onClick={() => setShowEscrowModal(false)}>
          <div className="bottomsheet-panel" onClick={(e) => e.stopPropagation()}>
            <div className="bottomsheet-drag-handle" />
            <div className="bottomsheet-header">
              <h2 className="bottomsheet-title">Cơ chế Bảo chứng Escrow Reown</h2>
              <button 
                type="button" 
                className="bottomsheet-close-btn" 
                onClick={() => setShowEscrowModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="bottomsheet-body">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#F0FDFA',
                  color: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Người mua thanh toán tiền
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Khoản tiền không chuyển ngay cho người bán mà được giữ trong ví trung gian bảo đảm của Reown Escrow.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#F0FDFA',
                  color: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Người bán gửi hàng
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Người bán an tâm giao hàng vì tiền của khách đã được giữ đảm bảo tại hệ thống.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#F0FDFA',
                  color: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Kiểm tra và Giải ngân
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Người mua nhận hàng và có 48h kiểm tra. Khi bấm "Xác nhận", tiền mới được giải ngân cho người bán. Nếu có gian lận, Reown hoàn 100% tiền.
                  </p>
                </div>
              </div>
            </div>
            <div className="bottomsheet-footer">
              <button 
                type="button" 
                className="btn-primary" 
                style={{ width: '100%' }}
                onClick={() => setShowEscrowModal(false)}
              >
                Đã hiểu cơ chế Escrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button
          type="button"
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <div className="nav-item-icon-wrapper">
            <Home size={21} strokeWidth={activeTab === 'home' ? 2.5 : 1.8} />
          </div>
          <span>Khám phá</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <div className="nav-item-icon-wrapper">
            <ShoppingBag size={21} strokeWidth={activeTab === 'orders' ? 2.5 : 1.8} />
          </div>
          <span>Đơn mua</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <div className="nav-item-icon-wrapper">
            <MessageSquare size={21} strokeWidth={activeTab === 'messages' ? 2.5 : 1.8} />
          </div>
          <span>Tin nhắn</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <div className="nav-item-icon-wrapper">
            <User size={21} strokeWidth={activeTab === 'profile' ? 2.5 : 1.8} />
          </div>
          <span>Tài khoản</span>
        </button>
      </nav>
    </div>
  );
}
