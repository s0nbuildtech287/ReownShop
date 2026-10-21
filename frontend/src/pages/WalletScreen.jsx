import React, { useState } from 'react';
import {
  Wallet,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Building,
  RefreshCw,
  QrCode,
  Info,
  DollarSign,
  Search,
  Filter,
  Check,
  X
} from 'lucide-react';
import { 
  WALLET_OVERVIEW, 
  HELD_ESCROW_ITEMS, 
  WALLET_TRANSACTIONS 
} from '../mocks/walletData';
import { formatVND } from '../utils/formatters';

export default function WalletScreen({ onBack, onViewOrderTracking }) {
  // Balance State
  const [availableBalance, setAvailableBalance] = useState(WALLET_OVERVIEW.availableBalance);
  const [heldBalance, setHeldBalance] = useState(WALLET_OVERVIEW.heldInEscrowBalance);
  const [transactions, setTransactions] = useState(WALLET_TRANSACTIONS);
  const [heldItems, setHeldItems] = useState(HELD_ESCROW_ITEMS);

  // Active Ledger Filter Tab: 'ALL' | 'HOLD' | 'RELEASE' | 'REFUND' | 'WITHDRAW' | 'FEE' | 'TOPUP'
  const [filterType, setFilterType] = useState('ALL');

  // Search in ledger
  const [searchQuery, setSearchQuery] = useState('');

  // Modals: 'WITHDRAW' | 'TOPUP' | 'TXN_DETAIL' | null
  const [activeModal, setActiveModal] = useState(null);

  // Selected Transaction for Detail Modal
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Withdraw Form State
  const [selectedBankId, setSelectedBankId] = useState(WALLET_OVERVIEW.bankAccounts[0].id);
  const [withdrawAmount, setWithdrawAmount] = useState(2000000);
  const [withdrawStep, setWithdrawStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [withdrawOtp, setWithdrawOtp] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Topup Form State
  const [topupAmount, setTopupAmount] = useState(5000000);
  const [topupStep, setTopupStep] = useState(1); // 1: Choose amount, 2: Show QR

  // Toast feedback
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchType = filterType === 'ALL' || txn.type === filterType;
    const matchQuery = !searchQuery || 
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.typeText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.orderCode && txn.orderCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (txn.productTitle && txn.productTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchQuery;
  });

  // Handle Withdraw Execution
  const handleConfirmWithdraw = () => {
    if (withdrawAmount < 50000) {
      showToast('Số tiền rút tối thiểu là 50.000 ₫');
      return;
    }
    if (withdrawAmount > availableBalance) {
      showToast('Số dư khả dụng không đủ để rút số tiền này');
      return;
    }
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      // Create new transaction
      const bank = WALLET_OVERVIEW.bankAccounts.find(b => b.id === selectedBankId);
      const newTxn = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'WITHDRAW',
        typeText: 'Rút tiền về ngân hàng',
        direction: 'OUT',
        amount: withdrawAmount,
        fee: 0,
        netAmount: withdrawAmount,
        balanceAfter: availableBalance - withdrawAmount,
        bankInfo: `${bank.shortName} •••• ${bank.accountNumber.slice(-4)}`,
        createdAt: 'Vừa xong',
        status: 'COMPLETED',
        statusText: 'Thành công (Đã chuyển khoản)',
        refCode: `FT-${Date.now().toString().slice(-8)}`,
        description: `Rút tiền về tài khoản ${bank.bankName} (${bank.accountNumber})`
      };
      setAvailableBalance(prev => prev - withdrawAmount);
      setTransactions(prev => [newTxn, ...prev]);
      setWithdrawStep(3);
    }, 1200);
  };

  // Handle Top-up Execution (Simulated instant success)
  const handleConfirmTopupPaid = () => {
    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'TOPUP',
      typeText: 'Nạp tiền vào ví',
      direction: 'IN',
      amount: topupAmount,
      fee: 0,
      netAmount: topupAmount,
      balanceAfter: availableBalance + topupAmount,
      bankInfo: 'PayOS QR VietinBank',
      createdAt: 'Vừa xong',
      status: 'COMPLETED',
      statusText: 'Thành công',
      refCode: `PAYOS-${Date.now().toString().slice(-7)}`,
      description: 'Nạp tiền tức thì qua quét mã PayOS VietQR'
    };
    setAvailableBalance(prev => prev + topupAmount);
    setTransactions(prev => [newTxn, ...prev]);
    setActiveModal(null);
    setTopupStep(1);
    showToast(`Đã nạp thành công ${formatVND(topupAmount)} vào ví!`);
  };

  return (
    <div className="wallet-screen-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="seller-dashboard-toast">
          <CheckCircle2 size={16} color="#0D9488" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="wallet-header-bar">
        <div className="wallet-header-left">
          <button type="button" className="btn-back-profile" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </button>
          <div>
            <h1 className="wallet-main-title">Ví Bảo Chứng Escrow & Sổ Cái</h1>
            <p className="wallet-main-sub">
              Lưu ký tiền trung gian độc lập & Minh bạch mọi giao dịch nạp/rút/giữ tiền
            </p>
          </div>
        </div>

        <div className="wallet-security-chip">
          <ShieldCheck size={16} color="#0D9488" />
          <span>Bảo mật chuẩn PCI-DSS & 100% Escrow</span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="wallet-layout-grid">
        {/* ================= CỘT TRÁI: THẺ VÍ LỚN & CHI TIẾT TẠM GIỮ ================= */}
        <div className="wallet-left-column">
          {/* Hero Escrow Wallet Card */}
          <div className="wallet-hero-card">
            <div className="wallet-hero-top">
              <div className="wallet-brand-row">
                <div className="wallet-icon-circle">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="wallet-brand-name">Reown SafePay Escrow</h3>
                  <span className="wallet-status-tag">Đã xác minh KYC CCCD</span>
                </div>
              </div>
              <span className="wallet-shield-pill">
                <ShieldCheck size={13} />
                <span>Bảo chứng 100%</span>
              </span>
            </div>

            {/* Balances Display */}
            <div className="wallet-balances-grid">
              <div className="wallet-balance-box available">
                <span className="balance-box-label">Số dư khả dụng (Rút được)</span>
                <strong className="balance-box-value">{formatVND(availableBalance)}</strong>
                <span className="balance-box-sub">Có thể dùng mua sắm hoặc rút về ATM</span>
              </div>

              <div className="wallet-balance-box held">
                <span className="balance-box-label text-amber">
                  <Lock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Đang giữ tại Escrow
                </span>
                <strong className="balance-box-value text-amber">{formatVND(heldBalance)}</strong>
                <span className="balance-box-sub">Khóa bảo đảm quyền lợi giao dịch</span>
              </div>
            </div>

            {/* Action Buttons: Nạp tiền / Rút tiền */}
            <div className="wallet-hero-actions">
              <button
                type="button"
                className="btn-wallet-action topup"
                onClick={() => {
                  setTopupStep(1);
                  setActiveModal('TOPUP');
                }}
              >
                <ArrowDownLeft size={16} />
                <span>Nạp tiền vào ví</span>
              </button>

              <button
                type="button"
                className="btn-wallet-action withdraw"
                onClick={() => {
                  setWithdrawStep(1);
                  setWithdrawAmount(Math.min(2000000, availableBalance));
                  setActiveModal('WITHDRAW');
                }}
              >
                <ArrowUpRight size={16} />
                <span>Rút tiền về ngân hàng</span>
              </button>
            </div>
          </div>

          {/* Breakdown: Tiền đang tạm giữ tại Escrow */}
          <div className="held-escrow-card">
            <div className="held-escrow-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#D97706" />
                <h3 className="held-escrow-title">Chi tiết các khoản đang giữ tại Escrow ({heldItems.length})</h3>
              </div>
              <span className="held-total-badge">{formatVND(heldBalance)}</span>
            </div>

            <p className="held-escrow-desc">
              Tiền của bạn được giữ trong tài khoản trung gian của Reown, tách biệt hoàn toàn và được bảo đảm an toàn cho đến khi giao dịch hoàn tất.
            </p>

            <div className="held-items-list">
              {heldItems.map((item) => (
                <div key={item.id} className="held-item-box">
                  <div className="held-item-top">
                    <div>
                      <span className="held-item-code">{item.orderCode}</span>
                      <h4 className="held-item-prod">{item.productTitle}</h4>
                    </div>
                    <strong className="held-item-amount">{formatVND(item.amount)}</strong>
                  </div>

                  <div className="held-item-meta">
                    <span className="held-meta-status">{item.statusText}</span>
                    <span>&bull;</span>
                    <span className="held-meta-counterpart">{item.counterpart}</span>
                  </div>

                  <div className="held-item-footer">
                    <div className="held-countdown-row">
                      <Clock size={13} color="#D97706" />
                      <span>Thời gian tự động giải ngân: <strong>{item.autoReleaseIn}</strong></span>
                    </div>

                    <button
                      type="button"
                      className="btn-view-order-held"
                      onClick={() => onViewOrderTracking && onViewOrderTracking(item.orderCode)}
                    >
                      <span>Xem đơn hàng</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow Guarantee Infobox */}
          <div className="escrow-infobox-card">
            <ShieldCheck size={22} color="#0D9488" style={{ flexShrink: 0 }} />
            <div>
              <strong>Quy chuẩn bảo vệ tài chính Reown SafePay:</strong>
              <p>
                Mọi lệnh rút tiền đều được xử lý tự động qua hệ thống chuyển khoản nhanh Napas 24/7 trong vòng 60 giây. Không thu phí rút tiền.
              </p>
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI: LỊCH SỬ SỔ CÁI (TRANSACTION LEDGER) ================= */}
        <div className="wallet-right-column">
          <div className="ledger-card">
            <div className="ledger-card-header">
              <div>
                <h3 className="ledger-title">Sổ cái giao dịch (Escrow Ledger)</h3>
                <p className="ledger-sub">Toàn bộ biến động dòng tiền HOLD / RELEASE / REFUND / FEE / WITHDRAW</p>
              </div>

              {/* Search Box */}
              <div className="ledger-search-box">
                <Search size={14} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Tìm theo mã GD, đơn hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ledger-search-input"
                />
              </div>
            </div>

            {/* Filter Chips Bar */}
            <div className="ledger-filters-bar hide-scrollbar">
              {[
                { key: 'ALL', label: 'Tất cả' },
                { key: 'HOLD', label: '🔒 HOLD (Khóa tiền)' },
                { key: 'RELEASE', label: '💰 RELEASE (Giải ngân)' },
                { key: 'REFUND', label: '↩️ REFUND (Hoàn tiền)' },
                { key: 'WITHDRAW', label: '📤 WITHDRAW (Rút tiền)' },
                { key: 'FEE', label: '🏷️ FEE (Phí sàn)' },
                { key: 'TOPUP', label: '📥 TOPUP (Nạp tiền)' }
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`btn-ledger-filter ${filterType === f.key ? 'active' : ''}`}
                  onClick={() => setFilterType(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Transactions List */}
            <div className="ledger-list-wrapper">
              {filteredTransactions.length > 0 ? (
                <div className="ledger-list">
                  {filteredTransactions.map((txn) => {
                    const isPositive = txn.direction === 'IN';
                    const isHold = txn.direction === 'HOLD';
                    const isFee = txn.type === 'FEE';

                    return (
                      <div 
                        key={txn.id} 
                        className="ledger-item-row"
                        onClick={() => {
                          setSelectedTxn(txn);
                          setActiveModal('TXN_DETAIL');
                        }}
                      >
                        {/* Type Icon Badge */}
                        <div className={`ledger-type-badge ${txn.type.toLowerCase()}`}>
                          {txn.type === 'WITHDRAW' && <ArrowUpRight size={17} />}
                          {txn.type === 'TOPUP' && <ArrowDownLeft size={17} />}
                          {txn.type === 'RELEASE' && <DollarSign size={17} />}
                          {txn.type === 'HOLD' && <Lock size={16} />}
                          {txn.type === 'REFUND' && <RefreshCw size={16} />}
                          {txn.type === 'FEE' && <Info size={16} />}
                        </div>

                        {/* Title & Meta Info */}
                        <div className="ledger-item-main">
                          <div className="ledger-item-heading">
                            <strong className="ledger-type-title">{txn.typeText}</strong>
                            <span className="ledger-txn-id">{txn.id}</span>
                          </div>

                          <p className="ledger-item-desc">
                            {txn.productTitle || txn.description}
                          </p>

                          <div className="ledger-item-subline">
                            <span>{txn.createdAt}</span>
                            {txn.bankInfo && (
                              <>
                                <span>&bull;</span>
                                <span className="text-slate-600">{txn.bankInfo}</span>
                              </>
                            )}
                            {txn.orderCode && (
                              <>
                                <span>&bull;</span>
                                <span className="ledger-order-link">{txn.orderCode}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Amount & Running Balance */}
                        <div className="ledger-item-amount-box">
                          <strong className={`ledger-amount-number ${isPositive ? 'positive' : isHold ? 'held' : 'negative'}`}>
                            {isPositive ? '+' : isHold ? '' : '-'}{formatVND(txn.amount)}
                          </strong>
                          <span className="ledger-balance-after">
                            Số dư sau GD: {formatVND(txn.balanceAfter)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="ledger-empty-box">
                  <Wallet size={36} color="#94A3B8" />
                  <p>Không tìm thấy giao dịch nào trong mục này.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: RÚT TIỀN VỀ NGÂN HÀNG (WITHDRAW) ================= */}
      {activeModal === 'WITHDRAW' && (
        <div className="modal-backdrop-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F766E' }}>
                <ArrowUpRight size={20} />
                <h3 className="modal-dialog-title">Rút tiền về tài khoản ngân hàng</h3>
              </div>
              <button 
                type="button" 
                className="modal-dialog-close" 
                onClick={() => setActiveModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            {withdrawStep === 1 && (
              <div className="withdraw-modal-body">
                <div className="withdraw-balance-banner">
                  <span>Số dư khả dụng hiện tại:</span>
                  <strong>{formatVND(availableBalance)}</strong>
                </div>

                {/* Chọn số tiền rút */}
                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Số tiền cần rút:
                  </label>
                  <div className="price-input-wrapper">
                    <input
                      type="number"
                      step={50000}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      className="listing-input-price small"
                      max={availableBalance}
                      min={50000}
                    />
                    <span className="price-currency-tag">₫</span>
                  </div>

                  {/* Quick select pills */}
                  <div className="quick-amount-pills">
                    {[500000, 1000000, 2000000, 5000000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className={`btn-amt-pill ${withdrawAmount === amt ? 'active' : ''}`}
                        onClick={() => setWithdrawAmount(amt)}
                      >
                        {formatVND(amt)}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="btn-amt-pill max"
                      onClick={() => setWithdrawAmount(availableBalance)}
                    >
                      Toàn bộ số dư
                    </button>
                  </div>
                </div>

                {/* Chọn tài khoản ngân hàng nhận */}
                <div style={{ marginTop: '18px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                    Tài khoản ngân hàng thụ hưởng (Chính chủ):
                  </label>
                  <div className="bank-accounts-selector">
                    {WALLET_OVERVIEW.bankAccounts.map((bank) => (
                      <div
                        key={bank.id}
                        className={`bank-card-option ${selectedBankId === bank.id ? 'active' : ''}`}
                        onClick={() => setSelectedBankId(bank.id)}
                      >
                        <div className="bank-logo-badge" style={{ background: bank.logoColor }}>
                          {bank.shortName}
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong className="bank-card-name">{bank.bankName}</strong>
                          <div className="bank-card-number">Số TK: {bank.accountNumber} &bull; {bank.accountHolder}</div>
                        </div>
                        {selectedBankId === bank.id && (
                          <CheckCircle2 size={18} color="#0D9488" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fee & Policy Notice */}
                <div className="withdraw-fee-summary">
                  <div className="fee-line">
                    <span>Phí rút tiền:</span>
                    <strong className="text-teal">0 ₫ (Miễn phí qua Napas 24/7)</strong>
                  </div>
                  <div className="fee-line">
                    <span>Thời gian nhận:</span>
                    <span>Tức thì (trong 60 giây)</span>
                  </div>
                </div>

                <div className="modal-dialog-footer-actions" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn-dialog-secondary"
                    onClick={() => setActiveModal(null)}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn-dialog-primary"
                    onClick={() => setWithdrawStep(2)}
                  >
                    Tiếp tục xác nhận &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Bước 2: Nhập OTP bảo mật */}
            {withdrawStep === 2 && (
              <div className="withdraw-modal-body">
                <div className="otp-confirm-box">
                  <ShieldCheck size={36} color="#0D9488" />
                  <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '8px 0 4px 0' }}>Xác thực mã bảo mật rút tiền</h4>
                  <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center' }}>
                    Một mã OTP gồm 6 chữ số đã được gửi tới số điện thoại <strong>0988 ••• 287</strong> của bạn.
                  </p>
                </div>

                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Nhập 6 số OTP (Demo: 123456)"
                    value={withdrawOtp}
                    onChange={(e) => setWithdrawOtp(e.target.value)}
                    className="listing-input-text text-center text-lg font-bold tracking-widest"
                    autoFocus
                  />
                  <div style={{ fontSize: '12px', color: '#0D9488', marginTop: '8px', cursor: 'pointer' }}>
                    Gửi lại mã OTP (58s)
                  </div>
                </div>

                <div className="modal-dialog-footer-actions" style={{ marginTop: '24px' }}>
                  <button
                    type="button"
                    className="btn-dialog-secondary"
                    onClick={() => setWithdrawStep(1)}
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    className="btn-dialog-primary"
                    disabled={isWithdrawing}
                    onClick={handleConfirmWithdraw}
                  >
                    {isWithdrawing ? 'Đang chuyển khoản Napas...' : 'Xác nhận rút tiền ngay'}
                  </button>
                </div>
              </div>
            )}

            {/* Bước 3: Rút tiền thành công */}
            {withdrawStep === 3 && (
              <div className="withdraw-modal-body" style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto'
                }}>
                  <CheckCircle2 size={36} />
                </div>

                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Yêu cầu rút tiền thành công!
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '6px' }}>
                  Số tiền <strong>{formatVND(withdrawAmount)}</strong> đang được chuyển về tài khoản ngân hàng của bạn qua Napas 24/7.
                </p>

                <div className="withdraw-receipt-box">
                  <div className="receipt-line">
                    <span>Số tiền:</span>
                    <strong>{formatVND(withdrawAmount)}</strong>
                  </div>
                  <div className="receipt-line">
                    <span>Ngân hàng nhận:</span>
                    <span>{WALLET_OVERVIEW.bankAccounts.find(b => b.id === selectedBankId)?.bankName}</span>
                  </div>
                  <div className="receipt-line">
                    <span>Số dư ví còn lại:</span>
                    <span>{formatVND(availableBalance)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-dialog-primary"
                  style={{ width: '100%', marginTop: '20px' }}
                  onClick={() => setActiveModal(null)}
                >
                  Hoàn tất
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: NẠP TIỀN VÀO VÍ (TOPUP PAYOS QR) ================= */}
      {activeModal === 'TOPUP' && (
        <div className="modal-backdrop-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0D9488' }}>
                <ArrowDownLeft size={20} />
                <h3 className="modal-dialog-title">Nạp tiền vào ví Escrow Reown</h3>
              </div>
              <button 
                type="button" 
                className="modal-dialog-close" 
                onClick={() => setActiveModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            {topupStep === 1 && (
              <div className="topup-modal-body">
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Nhập số tiền muốn nạp:
                </label>
                <div className="price-input-wrapper">
                  <input
                    type="number"
                    step={100000}
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(Number(e.target.value))}
                    className="listing-input-price small"
                    min={50000}
                  />
                  <span className="price-currency-tag">₫</span>
                </div>

                {/* Quick amount buttons */}
                <div className="quick-amount-pills" style={{ marginTop: '10px' }}>
                  {[1000000, 2000000, 5000000, 10000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`btn-amt-pill ${topupAmount === amt ? 'active' : ''}`}
                      onClick={() => setTopupAmount(amt)}
                    >
                      {formatVND(amt)}
                    </button>
                  ))}
                </div>

                <div className="modal-dialog-footer-actions" style={{ marginTop: '24px' }}>
                  <button
                    type="button"
                    className="btn-dialog-secondary"
                    onClick={() => setActiveModal(null)}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn-dialog-primary"
                    onClick={() => setTopupStep(2)}
                  >
                    Tạo mã VietQR thanh toán &rarr;
                  </button>
                </div>
              </div>
            )}

            {topupStep === 2 && (
              <div className="topup-modal-body" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '14px' }}>
                  Quét mã QR bằng ứng dụng ngân hàng bất kỳ để tiền vào ví tức thì:
                </p>

                {/* QR Code Frame */}
                <div className="qr-pay-box">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=2PAYOS-REOWN-TOPUP-${topupAmount}`}
                    alt="VietQR Reown"
                    className="qr-image"
                  />
                  <strong className="qr-amount-text">{formatVND(topupAmount)}</strong>
                  <span className="qr-ref-code">Nội dung: REOWN TOPUP {Date.now().toString().slice(-6)}</span>
                </div>

                <div className="modal-dialog-footer-actions" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn-dialog-secondary"
                    onClick={() => setTopupStep(1)}
                  >
                    Đổi số tiền
                  </button>
                  <button
                    type="button"
                    className="btn-dialog-primary"
                    onClick={handleConfirmTopupPaid}
                  >
                    Giả lập: Tôi đã chuyển khoản thành công
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: CHI TIẾT GIAO DỊCH (TXN DETAIL) ================= */}
      {activeModal === 'TXN_DETAIL' && selectedTxn && (
        <div className="modal-backdrop-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={19} color="#0D9488" />
                <h3 className="modal-dialog-title">Chi tiết giao dịch sổ cái</h3>
              </div>
              <button 
                type="button" 
                className="modal-dialog-close" 
                onClick={() => setActiveModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="txn-receipt-details">
              <div className="receipt-highlight-box">
                <span className="receipt-type-label">{selectedTxn.typeText}</span>
                <strong className={`receipt-main-amount ${selectedTxn.direction === 'IN' ? 'positive' : selectedTxn.direction === 'HOLD' ? 'held' : 'negative'}`}>
                  {selectedTxn.direction === 'IN' ? '+' : selectedTxn.direction === 'HOLD' ? '' : '-'}{formatVND(selectedTxn.amount)}
                </strong>
                <span className="receipt-status-pill">{selectedTxn.statusText}</span>
              </div>

              <div className="receipt-rows-list">
                <div className="receipt-row">
                  <span>Mã giao dịch:</span>
                  <strong>{selectedTxn.id}</strong>
                </div>
                <div className="receipt-row">
                  <span>Mã tham chiếu:</span>
                  <span>{selectedTxn.refCode}</span>
                </div>
                <div className="receipt-row">
                  <span>Thời gian thực hiện:</span>
                  <span>{selectedTxn.createdAt}</span>
                </div>
                {selectedTxn.orderCode && (
                  <div className="receipt-row">
                    <span>Đơn hàng liên quan:</span>
                    <strong className="text-teal cursor-pointer" onClick={() => {
                      setActiveModal(null);
                      onViewOrderTracking && onViewOrderTracking(selectedTxn.orderCode);
                    }}>
                      {selectedTxn.orderCode} &rarr;
                    </strong>
                  </div>
                )}
                {selectedTxn.fee > 0 && (
                  <div className="receipt-row">
                    <span>Phí sàn Escrow (2%):</span>
                    <span>{formatVND(selectedTxn.fee)}</span>
                  </div>
                )}
                <div className="receipt-row">
                  <span>Số dư sau giao dịch:</span>
                  <strong>{formatVND(selectedTxn.balanceAfter)}</strong>
                </div>
              </div>

              <div className="receipt-desc-box">
                <strong>Diễn giải nghiệp vụ:</strong>
                <p>{selectedTxn.description}</p>
              </div>
            </div>

            <div className="modal-dialog-footer-actions" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn-dialog-primary"
                style={{ width: '100%' }}
                onClick={() => setActiveModal(null)}
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
