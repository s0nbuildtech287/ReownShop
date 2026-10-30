import React, { useState } from 'react';
import { Home, ShoppingBag, MessageSquare, User, ShieldCheck } from 'lucide-react';
import Header from './components/Header';
import HomeScreen from './pages/HomeScreen';
import MessagesScreen from './pages/MessagesScreen';
import ProfileScreen from './pages/ProfileScreen';
import CheckoutScreen from './pages/CheckoutScreen';
import CreateListingScreen from './pages/CreateListingScreen';
import OrdersTrackingScreen from './pages/OrdersTrackingScreen';
import SellerDashboardScreen from './pages/SellerDashboardScreen';
import WalletScreen from './pages/WalletScreen';
import PublicSellerProfileScreen from './pages/PublicSellerProfileScreen';
import { PUBLIC_SELLER_PROFILE } from './mocks/publicSellerProfile';
import MakeOfferScreen from './pages/MakeOfferScreen';
import AuthScreen from './pages/AuthScreen';
import DisputeScreen from './pages/DisputeScreen';
import ReviewScreen from './pages/ReviewScreen';
import NotificationsScreen from './pages/NotificationsScreen';
import FavoritesScreen from './pages/FavoritesScreen';
import AccountSettingsScreen from './pages/AccountSettingsScreen';
import ProductDetailModal from './components/ProductDetailModal';
import LandingScreen from './components/LandingScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [offerProductTarget, setOfferProductTarget] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [disputeOrderTarget, setDisputeOrderTarget] = useState(null);
  const [reviewOrderTarget, setReviewOrderTarget] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState(null);
  const [isCreatingListing, setIsCreatingListing] = useState(false);
  const [isSellerDashboard, setIsSellerDashboard] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [selectedPublicSeller, setSelectedPublicSeller] = useState(null);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [isLanding, setIsLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState(null);

  const showToast = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 3200);
  };

  const handleSelectProduct = (product) => {
    setSelectedProductForDetail(product);
  };

  const openCheckout = (product) => {
    setSelectedProductForDetail(null);
    setCheckoutProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCheckout = (product) => {
    if (!isAuthenticated) {
      setPendingAuthAction(() => () => openCheckout(product));
      setIsLanding(false);
      setIsAuthOpen(true);
      return;
    }
    openCheckout(product);
  };

  const openOffer = (product) => {
    setSelectedProductForDetail(null);
    setOfferProductTarget(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMakeOffer = (product) => {
    if (!isAuthenticated) {
      setPendingAuthAction(() => () => openOffer(product));
      setIsLanding(false);
      setIsAuthOpen(true);
      return;
    }
    openOffer(product);
  };

  const handleChatWithSeller = (product) => {
    setSelectedProductForDetail(null);
    setActiveTab('messages');
    showToast(`Đã mở khung chat với người bán ${product.seller?.name || ''}`);
  };

  const handleViewOrder = (orderId) => {
    setCheckoutProduct(null);
    setOfferProductTarget(null);
    setIsAuthOpen(false);
    setDisputeOrderTarget(null);
    setReviewOrderTarget(null);
    setIsNotificationsOpen(false);
    setIsFavoritesOpen(false);
    setIsAccountSettingsOpen(false);
    setIsCreatingListing(false);
    setIsSellerDashboard(false);
    setIsWalletOpen(false);
    setSelectedPublicSeller(null);
    setSelectedTrackingOrderId(orderId || null);
    setActiveTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    setCheckoutProduct(null);
    setOfferProductTarget(null);
    setIsAuthOpen(false);
    setDisputeOrderTarget(null);
    setReviewOrderTarget(null);
    setIsNotificationsOpen(false);
    setIsFavoritesOpen(false);
    setIsAccountSettingsOpen(false);
    setIsCreatingListing(false);
    setIsSellerDashboard(false);
    setIsWalletOpen(false);
    setSelectedPublicSeller(null);
    setActiveTab(tab);
    setIsLanding(false);
  };

  const handleAuthSuccess = (user) => {
    setIsAuthenticated(true);
    setIsAuthOpen(false);
    setIsLanding(false);
    const action = pendingAuthAction;
    setPendingAuthAction(null);
    if (action) {
      action();
      return;
    }
    showToast(`Chào mừng ${user.name}! Đã đăng nhập thành công.`);
  };

  const handleRequireAuthForListing = () => {
    if (!isAuthenticated) {
      setPendingAuthAction(() => () => setIsCreatingListing(true));
      setIsLanding(false);
      setIsAuthOpen(true);
      return;
    }
    setIsLanding(false);
    setIsCreatingListing(true);
  };

  const handleRequireAuthForSellerDashboard = () => {
    if (!isAuthenticated) {
      setPendingAuthAction(() => () => setIsSellerDashboard(true));
      setIsLanding(false);
      setIsAuthOpen(true);
      return;
    }
    setIsLanding(false);
    setIsSellerDashboard(true);
  };

  return (
    <div className={`app-container ${isLanding ? 'landing-mode' : ''}`}>
      {isLanding && (
        <LandingScreen
          onExplore={() => { setIsLanding(false); setActiveTab('home'); }}
          onSell={handleRequireAuthForListing}
          onLogin={() => { setIsLanding(false); setIsAuthOpen(true); }}
        />
      )}
      {/* Universal Responsive Header */}
      <Header
        activeTab={
          checkoutProduct || offerProductTarget || isAuthOpen || isCreatingListing || selectedPublicSeller ||
          disputeOrderTarget || reviewOrderTarget || isNotificationsOpen || isFavoritesOpen || isAccountSettingsOpen
            ? ''
            : isSellerDashboard
            ? 'seller-dashboard'
            : activeTab
        }
        onTabChange={handleTabChange}
        onLogoClick={() => {
          setCheckoutProduct(null);
          setOfferProductTarget(null);
          setIsAuthOpen(false);
          setDisputeOrderTarget(null);
          setReviewOrderTarget(null);
          setIsNotificationsOpen(false);
          setIsFavoritesOpen(false);
          setIsAccountSettingsOpen(false);
          setIsCreatingListing(false);
          setIsSellerDashboard(false);
          setIsWalletOpen(false);
          setSelectedPublicSeller(null);
          setActiveTab('home');
        }}
        onNotificationClick={() => {
          handleTabChange('');
          setIsNotificationsOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNotifications={() => {
          handleTabChange('');
          setIsNotificationsOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenFavorites={() => {
          handleTabChange('');
          setIsFavoritesOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEscrowInfo={() => setShowEscrowModal(true)}
        onOpenAuth={() => {
          handleTabChange('');
          setIsAuthOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPostListing={() => {
          handleTabChange('');
          handleRequireAuthForListing();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSellerDashboard={() => {
          handleTabChange('');
          handleRequireAuthForSellerDashboard();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
          {disputeOrderTarget ? (
            <DisputeScreen
              order={disputeOrderTarget}
              onBack={() => setDisputeOrderTarget(null)}
              onViewOrder={() => {
                setDisputeOrderTarget(null);
                setActiveTab('orders');
              }}
              onGoToChatWithSeller={() => {
                setDisputeOrderTarget(null);
                setActiveTab('messages');
              }}
            />
          ) : reviewOrderTarget ? (
            <ReviewScreen
              order={reviewOrderTarget}
              onBack={() => setReviewOrderTarget(null)}
              onBackHome={() => {
                setReviewOrderTarget(null);
                setActiveTab('home');
              }}
              onSubmitSuccess={(data) => {
                showToast(`Đã ghi nhận đánh giá cho đơn hàng ${data.orderCode}!`);
              }}
            />
          ) : isNotificationsOpen ? (
            <NotificationsScreen
              onBack={() => setIsNotificationsOpen(false)}
              onViewOrder={(code) => {
                setIsNotificationsOpen(false);
                handleViewOrder(code);
              }}
              onViewWallet={() => {
                setIsNotificationsOpen(false);
                setIsWalletOpen(true);
              }}
              onViewSellerDashboard={() => {
                setIsNotificationsOpen(false);
                setIsSellerDashboard(true);
              }}
              onSelectProduct={(prod) => {
                setIsNotificationsOpen(false);
                setSelectedProductForDetail(prod);
              }}
            />
          ) : isFavoritesOpen ? (
            <FavoritesScreen
              onBack={() => setIsFavoritesOpen(false)}
              onBackHome={() => {
                setIsFavoritesOpen(false);
                setActiveTab('home');
              }}
              onSelectProduct={(prod) => {
                setIsFavoritesOpen(false);
                setSelectedProductForDetail(prod);
              }}
              onBuyNow={(prod) => {
                setIsFavoritesOpen(false);
                handleStartCheckout(prod);
              }}
              onMakeOffer={(prod) => {
                setIsFavoritesOpen(false);
                handleMakeOffer(prod);
              }}
            />
          ) : isAccountSettingsOpen ? (
            <AccountSettingsScreen
              onBack={() => setIsAccountSettingsOpen(false)}
              onSaveSuccess={() => {
                showToast('Đã lưu thông tin tài khoản thành công!');
              }}
            />
          ) : offerProductTarget ? (
            <MakeOfferScreen
              product={offerProductTarget}
              onBack={() => setOfferProductTarget(null)}
              onOfferSubmitted={(data) => {
                showToast(`Đã gửi đề xuất ${data.offerPrice.toLocaleString()}đ thành công! Đang chờ người bán phản hồi.`);
              }}
              onGoToChat={() => {
                setOfferProductTarget(null);
                setActiveTab('messages');
              }}
            />
          ) : isAuthOpen ? (
            <AuthScreen
              onBack={() => setIsAuthOpen(false)}
              onAuthSuccess={handleAuthSuccess}
            />
          ) : isCreatingListing ? (
            <CreateListingScreen
              onClose={() => setIsCreatingListing(false)}
              onPublishSuccess={(newListing) => {
                showToast(`Đã đăng tin "${newListing.title}" thành công!`);
              }}
              onViewPublishedProduct={(item) => {
                setIsCreatingListing(false);
                setSelectedProductForDetail(item);
              }}
            />
          ) : checkoutProduct ? (
            <CheckoutScreen
              product={checkoutProduct}
              onBack={() => setCheckoutProduct(null)}
              onBackHome={() => {
                setCheckoutProduct(null);
                setActiveTab('home');
              }}
              onViewOrderTracking={(orderCode) => {
                setCheckoutProduct(null);
                setActiveTab('orders');
                showToast(`Đang mở theo dõi đơn hàng ${orderCode}`);
              }}
            />
          ) : isSellerDashboard ? (
            <SellerDashboardScreen
              onBack={() => setIsSellerDashboard(false)}
              onNavigateCreateListing={() => {
                setIsSellerDashboard(false);
                setIsCreatingListing(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewProduct={(item) => setSelectedProductForDetail(item)}
              onOpenChatWithBuyer={(buyer) => {
                setIsSellerDashboard(false);
                setActiveTab('messages');
                showToast(`Đã mở khung chat với người mua ${buyer.name}`);
              }}
              onViewPublicProfile={() => {
                setIsSellerDashboard(false);
                setSelectedPublicSeller(PUBLIC_SELLER_PROFILE);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : isWalletOpen ? (
            <WalletScreen
              onBack={() => setIsWalletOpen(false)}
              onViewOrderTracking={(orderCode) => handleViewOrder(orderCode)}
            />
          ) : selectedPublicSeller ? (
            <PublicSellerProfileScreen
              seller={selectedPublicSeller}
              onBack={() => setSelectedPublicSeller(null)}
              onViewProduct={(prod) => {
                setSelectedPublicSeller(null);
                setSelectedProductForDetail(prod);
              }}
              onChatWithSeller={(seller) => {
                setSelectedPublicSeller(null);
                setActiveTab('messages');
                showToast(`Đã mở khung chat với người bán ${seller.name}`);
              }}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  onSelectProduct={handleSelectProduct}
                  onViewOrder={handleViewOrder}
                  onViewMessages={() => setActiveTab('messages')}
                  onOpenAboutEscrow={() => setShowEscrowModal(true)}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersTrackingScreen
                  initialOrderId={selectedTrackingOrderId}
                  onBackHome={() => setActiveTab('home')}
                  onViewProduct={(prod) => setSelectedProductForDetail(prod)}
                  onChatWithSeller={(seller) => {
                    setActiveTab('messages');
                    showToast(`Đã mở khung chat với ${seller.name}`);
                  }}
                  onOpenDispute={(order) => {
                    setDisputeOrderTarget(order);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenReview={(order) => {
                    setReviewOrderTarget(order);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {activeTab === 'messages' && (
                <MessagesScreen
                  onSelectChat={(chat) => showToast(`Mở hộp thoại với ${chat.sellerName}`)}
                  onBackHome={() => setActiveTab('home')}
                  onViewProduct={(prod) => setSelectedProductForDetail(prod)}
                  onStartCheckout={(prod) => handleStartCheckout(prod)}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen
                  onViewOrders={() => setActiveTab('orders')}
                  onShowEscrowHelp={() => setShowEscrowModal(true)}
                  onOpenSellerDashboard={() => {
                    handleRequireAuthForSellerDashboard();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenWallet={() => {
                    setIsWalletOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onViewPublicProfile={() => {
                    setSelectedPublicSeller(PUBLIC_SELLER_PROFILE);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenAuth={() => {
                    setIsAuthOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenFavorites={() => {
                    setIsFavoritesOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenNotifications={() => {
                    setIsNotificationsOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenAccountSettings={() => {
                    setIsAccountSettingsOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={Boolean(selectedProductForDetail)}
        onClose={() => setSelectedProductForDetail(null)}
        onBuyNow={handleStartCheckout}
        onMakeOffer={handleMakeOffer}
        onChatWithSeller={handleChatWithSeller}
        onViewSellerProfile={(seller) => {
          setSelectedProductForDetail(null);
          setSelectedPublicSeller(seller || PUBLIC_SELLER_PROFILE);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

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
