import React from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  Lock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Headphones, 
  ChevronRight, 
  LogOut,
  Sparkles,
  BarChart3,
  Store,
  TrendingUp,
  Heart,
  Bell,
  Settings
} from 'lucide-react';
import { formatVND } from '../utils/formatters';

export default function ProfileScreen({
  onViewOrders,
  onShowEscrowHelp,
  onOpenSellerDashboard,
  onOpenWallet,
  onViewPublicProfile,
  onOpenAuth,
  onOpenFavorites,
  onOpenNotifications,
  onOpenAccountSettings
}) {
  // Mock User data with Escrow wallet balances
  const user = {
    name: 'Nguyễn Xuân Sơn',
    phone: '0988 888 287',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    availableBalance: 8450000,
    heldInEscrowBalance: 17835000, // Đang giữ cho đơn hàng iPhone 14 Pro Max
    isVerified: true,
    ordersCount: {
      pending: 0,
      held: 1,
      shipping: 0,
      completed: 12
    }
  };

  return (
    <div className="profile-layout-container">
      {/* CỘT TRÁI (DESKTOP) / ĐỈNH (MOBILE): THẺ CÁ NHÂN & VÍ ESCROW */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
          padding: '24px 20px',
          color: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(13, 148, 136, 0.25)'
        }}>
          {/* Avatar & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(255, 255, 255, 0.85)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px' }}>
                  {user.name}
                </h2>
                {user.isVerified && (
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--radius-full)',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <ShieldCheck size={12} color="#A7F3D0" />
                    <span>Đã xác thực CCCD</span>
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12.5px', color: '#CCFBF1', marginTop: '2px' }}>
                SĐT: {user.phone}
              </div>
            </div>
          </div>

          {/* Escrow Wallet Card */}
          <div style={{
            marginTop: '20px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 700 }}>
                <Wallet size={16} />
                <span>Ví Escrow Reown</span>
              </div>
              <span style={{
                fontSize: '11px',
                background: '#047857',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 600
              }}>
                Bảo mật đa lớp
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '14px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11.5px', color: '#CCFBF1' }}>Số dư khả dụng</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>
                  {formatVND(user.availableBalance)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', color: '#FEF08A', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Lock size={11} />
                  <span>Đang giữ Escrow</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FEF08A' }}>
                  {formatVND(user.heldInEscrowBalance)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'white',
                  color: '#0F766E',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
                onClick={onOpenWallet}
              >
                <ArrowDownLeft size={15} />
                <span>Nạp tiền</span>
              </button>

              <button
                type="button"
                style={{
                  flex: 1,
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
                onClick={onOpenWallet}
              >
                <ArrowUpRight size={15} />
                <span>Rút tiền</span>
              </button>
            </div>
          </div>
        </div>

        {/* THẺ KÊNH NGƯỜI BÁN (SELLER DASHBOARD QUICK ACCESS) */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#F0FDFA',
                color: '#0D9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Store size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  Kênh người bán
                </h3>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Seller Hub & Escrow</span>
              </div>
            </div>

            <span style={{
              background: '#DCFCE7',
              color: '#16A34A',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <TrendingUp size={11} />
              <span>+18.2%</span>
            </span>
          </div>

          <div style={{
            background: 'var(--surface-alt)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '14px'
          }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Doanh thu tháng này</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
              {formatVND(48500000)}
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span><strong>5</strong> tin đang bán</span>
              <span>&bull;</span>
              <span style={{ color: '#D97706' }}><strong>2</strong> trả giá chờ duyệt</span>
              <span>&bull;</span>
              <span style={{ color: '#0D9488' }}><strong>1</strong> đơn cần gửi</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSellerDashboard}
            style={{
              width: '100%',
              height: '40px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
            }}
          >
            <BarChart3 size={16} />
            <span>Vào Dashboard Người Bán</span>
          </button>

          <button
            type="button"
            onClick={onViewPublicProfile}
            style={{
              width: '100%',
              height: '36px',
              background: '#F0FDFA',
              color: '#0F766E',
              border: '1px solid #CCFBF1',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Xem hồ sơ công khai &rarr;</span>
          </button>
        </div>
      </div>

      {/* CỘT PHẢI (DESKTOP) / THÂN (MOBILE): QUẢN LÝ ĐƠN HÀNG & TIỆN ÍCH */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Orders Management Section */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Đơn hàng của tôi
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Theo dõi và bảo đảm quyền lợi với Escrow
              </p>
            </div>
            <button
              type="button"
              onClick={onViewOrders}
              style={{
                background: 'var(--primary-light)',
                border: '1px solid #CCFBF1',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                color: 'var(--primary)',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <span>Xem tất cả</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div 
              style={{ cursor: 'pointer', padding: '10px 4px', borderRadius: '12px', transition: 'background 0.15s ease' }}
              onClick={onViewOrders}
            >
              <div style={{
                width: '44px',
                height: '44px',
                background: 'var(--surface-alt)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto',
                color: 'var(--text-muted)'
              }}>
                <Clock size={20} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Chờ thanh toán</div>
            </div>

            <div 
              style={{ cursor: 'pointer', padding: '10px 4px', borderRadius: '12px', background: '#F0FDFA' }}
              onClick={onViewOrders}
            >
              <div style={{
                width: '44px',
                height: '44px',
                background: '#CCFBF1',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto',
                color: 'var(--primary)',
                position: 'relative'
              }}>
                <Lock size={20} />
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--accent)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {user.ordersCount.held}
                </span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>Đang giữ tiền</div>
            </div>

            <div 
              style={{ cursor: 'pointer', padding: '10px 4px', borderRadius: '12px' }}
              onClick={onViewOrders}
            >
              <div style={{
                width: '44px',
                height: '44px',
                background: 'var(--surface-alt)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto',
                color: 'var(--text-muted)'
              }}>
                <Truck size={20} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Đang gửi hàng</div>
            </div>

            <div 
              style={{ cursor: 'pointer', padding: '10px 4px', borderRadius: '12px' }}
              onClick={onViewOrders}
            >
              <div style={{
                width: '44px',
                height: '44px',
                background: 'var(--surface-alt)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto',
                color: 'var(--text-muted)'
              }}>
                <CheckCircle2 size={20} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Đã hoàn tất ({user.ordersCount.completed})</div>
            </div>
          </div>
        </div>

        {/* Menu Settings & Utilities */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div 
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
              background: '#F0FDFA'
            }}
            onClick={onOpenSellerDashboard}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Store size={19} color="#0D9488" />
              <div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>Kênh người bán & Đơn hàng đã bán</span>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Quản lý tin đăng, duyệt trả giá và xuất kho Escrow</div>
              </div>
            </div>
            <ChevronRight size={17} color="#0D9488" />
          </div>
          <div 
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer'
            }}
            onClick={onOpenWallet}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Package size={19} color="#0D9488" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Lịch sử giao dịch sổ cái (Ledger)</span>
            </div>
            <ChevronRight size={17} color="#94A3B8" />
          </div>

          <div 
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer'
            }}
            onClick={onOpenFavorites}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Heart size={19} color="#0D9488" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Món đồ yêu thích đã lưu (Wishlist)</span>
            </div>
            <ChevronRight size={17} color="#94A3B8" />
          </div>

          <div 
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer'
            }}
            onClick={onOpenNotifications}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={19} color="#0D9488" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Trung tâm thông báo & Biến động</span>
            </div>
            <ChevronRight size={17} color="#94A3B8" />
          </div>

          <div 
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer'
            }}
            onClick={onOpenAccountSettings}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Settings size={19} color="#0D9488" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Cài đặt tài khoản & Ngân hàng rút ví</span>
            </div>
            <ChevronRight size={17} color="#94A3B8" />
          </div>

          <div 
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer'
            }}
            onClick={onOpenAccountSettings || (() => alert('Địa chỉ nhận hàng: Landmark 81, TP. Hồ Chí Minh'))}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={19} color="#0D9488" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Sổ địa chỉ nhận hàng</span>
            </div>
            <ChevronRight size={17} color="#94A3B8" />
          </div>

          <div 
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer'
            }}
            onClick={onShowEscrowHelp}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={19} color="#0D9488" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Quy trình giải quyết khiếu nại Escrow</span>
            </div>
            <ChevronRight size={17} color="#94A3B8" />
          </div>

          <div 
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => alert('Tổng đài hỗ trợ 24/7: 1900 8888')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Headphones size={19} color="#0D9488" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Trung tâm hỗ trợ khách hàng</span>
            </div>
            <ChevronRight size={17} color="#94A3B8" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onOpenAuth || (() => alert('Đăng xuất thành công!'))}
          style={{
            width: '100%',
            height: '46px',
            background: 'var(--surface)',
            border: '1px solid #FCA5A5',
            color: '#DC2626',
            borderRadius: 'var(--radius-lg)',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <LogOut size={16} />
          <span>Đăng xuất / Chuyển tài khoản</span>
        </button>
      </div>
    </div>
  );
}
