import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  ShieldCheck,
  Wallet,
  Tag,
  Truck,
  Sparkles,
  Clock,
  Trash2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../mocks/notificationsData';

export default function NotificationsScreen({
  onBack,
  onViewOrder,
  onViewWallet,
  onViewSellerDashboard,
  onSelectProduct
}) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('ALL');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (item) => {
    // Mark as read
    setNotifications(
      notifications.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );

    // Navigate accordingly
    if (item.actionType === 'VIEW_ORDER' && onViewOrder) {
      onViewOrder(item.targetId);
    } else if (item.actionType === 'VIEW_WALLET' && onViewWallet) {
      onViewWallet();
    } else if (item.actionType === 'VIEW_SELLER_OFFERS' && onViewSellerDashboard) {
      onViewSellerDashboard();
    } else if (item.actionType === 'VIEW_PRODUCT' && onSelectProduct) {
      onSelectProduct({ id: item.targetId, title: 'MacBook Air M2 16GB', price: 19900000 });
    }
  };

  const filteredList = notifications.filter((item) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'WALLET') return item.category === 'WALLET';
    if (activeTab === 'ORDER') return item.category === 'ORDER';
    if (activeTab === 'OFFER') return item.category === 'OFFER';
    return true;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'WALLET':
        return <div className="notif-avatar-icon wallet"><Wallet size={18} /></div>;
      case 'ORDER':
        return <div className="notif-avatar-icon order"><Truck size={18} /></div>;
      case 'OFFER':
        return <div className="notif-avatar-icon offer"><Tag size={18} /></div>;
      default:
        return <div className="notif-avatar-icon promo"><Sparkles size={18} /></div>;
    }
  };

  return (
    <div className="notifications-screen-container">
      {/* HEADER */}
      <div className="notif-header-panel">
        <div className="notif-header-left">
          <button type="button" className="btn-back-clean" onClick={onBack}>
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </button>
          <div className="notif-title-group">
            <h1 className="notif-main-title">Trung Tâm Thông Báo</h1>
            {unreadCount > 0 && (
              <span className="notif-unread-pill">{unreadCount} tin mới</span>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="btn-mark-read-all"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck size={16} />
            <span>Đánh dấu đã đọc tất cả</span>
          </button>
        )}
      </div>

      {/* TABS FILTER */}
      <div className="notif-filter-tabs">
        <button
          type="button"
          className={`notif-tab-item ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          <span>Tất cả</span>
          <span className="tab-badge">{notifications.length}</span>
        </button>

        <button
          type="button"
          className={`notif-tab-item ${activeTab === 'WALLET' ? 'active' : ''}`}
          onClick={() => setActiveTab('WALLET')}
        >
          <ShieldCheck size={14} />
          <span>Ví Escrow</span>
        </button>

        <button
          type="button"
          className={`notif-tab-item ${activeTab === 'ORDER' ? 'active' : ''}`}
          onClick={() => setActiveTab('ORDER')}
        >
          <Truck size={14} />
          <span>Đơn hàng</span>
        </button>

        <button
          type="button"
          className={`notif-tab-item ${activeTab === 'OFFER' ? 'active' : ''}`}
          onClick={() => setActiveTab('OFFER')}
        >
          <Tag size={14} />
          <span>Trả giá</span>
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="notif-items-list">
        {filteredList.length === 0 ? (
          <div className="notif-empty-state">
            <Bell size={42} color="#94A3B8" />
            <h3>Chưa có thông báo nào trong mục này</h3>
            <p>Mọi cập nhật về biến động ví Escrow, đơn hàng và đề xuất giá sẽ hiển thị tại đây.</p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className={`notif-card-item ${!item.isRead ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(item)}
            >
              <div className="notif-icon-col">
                {getCategoryIcon(item.category)}
              </div>

              <div className="notif-content-col">
                <div className="notif-title-row">
                  <h4 className="item-title">{item.title}</h4>
                  {!item.isRead && <span className="unread-dot" />}
                </div>
                <p className="item-desc">{item.content}</p>
                <div className="notif-meta-row">
                  <span className="item-time">
                    <Clock size={12} />
                    <span>{item.time}</span>
                  </span>
                  <span className="action-hint">Bấm để xem chi tiết &rarr;</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-delete-notif"
                title="Xóa thông báo này"
                onClick={(e) => handleClearNotification(item.id, e)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
