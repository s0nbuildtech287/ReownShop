import React from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Heart, 
  Clock, 
  ChevronRight, 
  ExternalLink, 
  ShieldCheck, 
  PackageOpen 
} from 'lucide-react';
import { MOCK_ACTIVE_ORDERS, MOCK_PENDING_OFFERS, MOCK_SAVED_ITEMS } from '../mocks/products';
import { formatVND } from '../utils/formatters';

export default function DesktopRightSidebar({ 
  onViewOrders, 
  onViewMessages, 
  onSelectProduct 
}) {
  return (
    <aside className="desktop-right-sidebar hide-scrollbar">
      {/* KHỐI 1: ĐƠN ĐANG XỬ LÝ (Tối đa 2 đơn) */}
      <div className="right-sidebar-card">
        <div className="right-sidebar-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <ShoppingBag size={15} color="#0D9488" />
            <h3 className="right-sidebar-title">Đơn đang xử lý</h3>
          </div>
          <button 
            type="button" 
            className="right-sidebar-link-btn" 
            onClick={onViewOrders}
          >
            <span>Xem tất cả</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="right-sidebar-card-body">
          {MOCK_ACTIVE_ORDERS && MOCK_ACTIVE_ORDERS.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MOCK_ACTIVE_ORDERS.slice(0, 2).map((order) => (
                <div key={order.id} className="tracking-order-item" onClick={onViewOrders}>
                  <img src={order.image} alt={order.title} className="tracking-thumb" />
                  <div className="tracking-info">
                    <h4 className="tracking-item-title">{order.title}</h4>
                    <div className="tracking-item-price">{formatVND(order.price)}</div>
                    <div className="tracking-status-badge">
                      <span className="tracking-status-dot" />
                      <span>{order.statusText}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="tracking-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrders();
                    }}
                  >
                    Xem đơn
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="right-sidebar-empty">
              <PackageOpen size={20} color="#94A3B8" />
              <span>Chưa có đơn hàng nào đang xử lý.</span>
            </div>
          )}
        </div>
      </div>

      {/* KHỐI 2: ĐỀ NGHỊ GIÁ ĐANG CHỜ (Tối đa 2 mục) */}
      <div className="right-sidebar-card">
        <div className="right-sidebar-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Tag size={15} color="#F97316" />
            <h3 className="right-sidebar-title">Đề nghị giá đang chờ</h3>
          </div>
          <button 
            type="button" 
            className="right-sidebar-link-btn" 
            onClick={onViewMessages}
          >
            <span>Xem tất cả</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="right-sidebar-card-body">
          {MOCK_PENDING_OFFERS && MOCK_PENDING_OFFERS.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MOCK_PENDING_OFFERS.slice(0, 2).map((offer) => (
                <div key={offer.id} className="tracking-offer-item" onClick={onViewMessages}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <img src={offer.image} alt={offer.productTitle} className="tracking-thumb-sm" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="tracking-item-title">{offer.productTitle}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span className="tracking-offer-price">{formatVND(offer.offerPrice)}</span>
                        <span className="tracking-original-price">{formatVND(offer.originalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="tracking-offer-footer">
                    <span className="tracking-offer-status">{offer.status}</span>
                    <span className="tracking-offer-time">
                      <Clock size={11} />
                      <span>{offer.expiresIn}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="right-sidebar-empty">
              <Tag size={20} color="#94A3B8" />
              <span>Chưa có đề nghị giá nào đang chờ.</span>
            </div>
          )}
        </div>
      </div>

      {/* KHỐI 3: ĐÃ LƯU GẦN ĐÂY (Lưới 2x2) */}
      <div className="right-sidebar-card">
        <div className="right-sidebar-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Heart size={15} color="#EF4444" fill="#EF4444" />
            <h3 className="right-sidebar-title">Đã lưu gần đây</h3>
          </div>
          <button 
            type="button" 
            className="right-sidebar-link-btn"
            onClick={() => alert('Xem toàn bộ danh sách sản phẩm đã thả tim')}
          >
            <span>Xem tất cả</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="right-sidebar-card-body">
          {MOCK_SAVED_ITEMS && MOCK_SAVED_ITEMS.length > 0 ? (
            <div className="tracking-saved-grid">
              {MOCK_SAVED_ITEMS.slice(0, 4).map((item) => (
                <div 
                  key={item.id} 
                  className="tracking-saved-item"
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                  title={item.title}
                >
                  <img src={item.image} alt={item.title} />
                  <div className="tracking-saved-overlay">
                    <div className="tracking-saved-title">{item.title}</div>
                    <div className="tracking-saved-price">{formatVND(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="right-sidebar-empty">
              <Heart size={20} color="#94A3B8" />
              <span>Chưa lưu món đồ nào.</span>
            </div>
          )}
        </div>
      </div>

      {/* Escrow Guarantee Trust Widget */}
      <div className="right-sidebar-trust-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <ShieldCheck size={16} color="#0D9488" />
          <strong style={{ fontSize: '12.5px', color: '#0F766E' }}>Bảo chứng Escrow 100%</strong>
        </div>
        <p style={{ fontSize: '11.5px', color: '#64748B', lineHeight: '1.4' }}>
          Mọi khoản tiền chỉ được giải ngân cho người bán sau khi bạn kiểm tra và xác nhận hài lòng.
        </p>
      </div>
    </aside>
  );
}
