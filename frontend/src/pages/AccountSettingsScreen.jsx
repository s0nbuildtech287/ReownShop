import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Building2,
  MapPin,
  Lock,
  Smartphone,
  Mail,
  CheckCircle2,
  ChevronRight,
  Save,
  CreditCard,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AccountSettingsScreen({
  onBack,
  onSaveSuccess
}) {
  const [activeTab, setActiveTab] = useState('PROFILE'); // 'PROFILE' | 'BANK' | 'SECURITY'

  // User details
  const [fullName, setFullName] = useState('Nguyễn Xuân Sơn');
  const [phoneNumber, setPhoneNumber] = useState('0988 888 287');
  const [email, setEmail] = useState('xuanson.lotusquant@gmail.com');

  // Bank details for Escrow withdrawal
  const [bankName, setBankName] = useState('MB Bank (Ngân hàng Quân Đội)');
  const [bankAccountNo, setBankAccountNo] = useState('0988888287');
  const [bankAccountHolder, setBankAccountHolder] = useState('NGUYEN XUAN SON');

  // Address
  const [receiverName, setReceiverName] = useState('Nguyễn Xuân Sơn');
  const [receiverPhone, setReceiverPhone] = useState('0988 888 287');
  const [deliveryAddress, setDeliveryAddress] = useState('Tòa nhà Keangnam Landmark 72, Đường Phạm Hùng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội');

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Đã lưu các thay đổi tài khoản thành công!');
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <div className="account-settings-screen-container">
      {/* HEADER */}
      <div className="settings-header-panel">
        <button type="button" className="btn-back-clean" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Quay lại</span>
        </button>
        <div className="settings-title-group">
          <h1 className="settings-main-title">Cài Đặt Tài Khoản & Định Danh Escrow</h1>
          <p className="settings-sub">Quản lý hồ sơ cá nhân, tài khoản rút tiền ví và bảo mật 2 lớp</p>
        </div>
      </div>

      {toastMsg && (
        <div className="settings-toast-badge">
          <CheckCircle2 size={16} color="#0D9488" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TABS */}
      <div className="settings-tab-nav">
        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'PROFILE' ? 'active' : ''}`}
          onClick={() => setActiveTab('PROFILE')}
        >
          <User size={16} />
          <span>Thông tin & Địa chỉ</span>
        </button>

        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'BANK' ? 'active' : ''}`}
          onClick={() => setActiveTab('BANK')}
        >
          <CreditCard size={16} />
          <span>Ngân hàng rút tiền Escrow</span>
        </button>

        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'SECURITY' ? 'active' : ''}`}
          onClick={() => setActiveTab('SECURITY')}
        >
          <Lock size={16} />
          <span>Bảo mật & Mật khẩu</span>
        </button>
      </div>

      {/* CONTENT TABS */}
      <form onSubmit={handleSave} className="settings-form-content">
        {/* TAB 1: PROFILE & ADDRESS */}
        {activeTab === 'PROFILE' && (
          <div className="settings-tab-pane">
            {/* eKYC Verification Card */}
            <div className="ekyc-verified-banner">
              <div className="ekyc-icon"><ShieldCheck size={26} color="#0D9488" /></div>
              <div className="ekyc-info">
                <div className="ekyc-title-row">
                  <strong>Đã định danh CCCD gắn chip (Cấp độ 2)</strong>
                  <span className="ekyc-badge">Đã xác minh</span>
                </div>
                <p>Số CCCD: <strong>001098******</strong> &bull; Hạn mức thanh toán Escrow: <strong>500.000.000 ₫/tháng</strong></p>
              </div>
            </div>

            <div className="settings-card-section">
              <h3 className="section-title">Hồ sơ cá nhân</h3>
              <div className="settings-field-group">
                <label>Họ và tên hiển thị:</label>
                <div className="input-with-icon">
                  <User size={16} color="#64748B" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="settings-field-grid">
                <div className="settings-field-group">
                  <label>Số điện thoại:</label>
                  <div className="input-with-icon">
                    <Smartphone size={16} color="#64748B" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="settings-field-group">
                  <label>Email liên hệ:</label>
                  <div className="input-with-icon">
                    <Mail size={16} color="#64748B" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-card-section">
              <h3 className="section-title">Địa chỉ nhận hàng mặc định</h3>
              <div className="settings-field-grid">
                <div className="settings-field-group">
                  <label>Tên người nhận hàng:</label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </div>
                <div className="settings-field-group">
                  <label>Số điện thoại nhận hàng:</label>
                  <input
                    type="tel"
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="settings-field-group">
                <label>Địa chỉ chi tiết (Số nhà, đường, tòa nhà, phường/xã):</label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BANK ACCOUNT */}
        {activeTab === 'BANK' && (
          <div className="settings-tab-pane">
            <div className="bank-info-alert">
              <ShieldCheck size={20} color="#0D9488" />
              <div>
                <strong>Tài khoản ngân hàng nhận tiền giải ngân Escrow</strong>
                <p>Mỗi khi đơn bán được người mua xác nhận hài lòng, tiền sẽ tự động chuyển về tài khoản này theo lệnh rút của bạn.</p>
              </div>
            </div>

            <div className="settings-card-section">
              <div className="settings-field-group">
                <label>Ngân hàng:</label>
                <div className="input-with-icon">
                  <Building2 size={16} color="#64748B" />
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
              </div>

              <div className="settings-field-group">
                <label>Số tài khoản ngân hàng:</label>
                <div className="input-with-icon">
                  <CreditCard size={16} color="#64748B" />
                  <input
                    type="text"
                    value={bankAccountNo}
                    onChange={(e) => setBankAccountNo(e.target.value)}
                  />
                </div>
              </div>

              <div className="settings-field-group">
                <label>Tên chủ tài khoản (Viết hoa không dấu):</label>
                <div className="input-with-icon">
                  <User size={16} color="#64748B" />
                  <input
                    type="text"
                    value={bankAccountHolder}
                    onChange={(e) => setBankAccountHolder(e.target.value)}
                  />
                </div>
                <p className="field-hint">Tên chủ tài khoản ngân hàng phải trùng khớp với tên trên CCCD đã định danh.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY */}
        {activeTab === 'SECURITY' && (
          <div className="settings-tab-pane">
            <div className="settings-card-section">
              <h3 className="section-title">Đổi mật khẩu đăng nhập</h3>

              <div className="settings-field-group">
                <label>Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại..."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="settings-field-group">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  placeholder="Tối thiểu 8 ký tự gồm chữ và số..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="settings-card-section">
              <h3 className="section-title">Bảo mật nâng cao</h3>
              <div className="security-toggle-item">
                <div className="security-item-info">
                  <strong>Xác thực 2 yếu tố (2FA) qua mã OTP SMS</strong>
                  <p>Mỗi khi rút tiền ví Escrow trên 10.000.000 ₫ hoặc đổi mật khẩu, hệ thống sẽ gửi mã OTP đến số điện thoại.</p>
                </div>
                <label className="switch-toggle">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  />
                  <span className="slider round" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="settings-save-footer">
          <button type="submit" className="btn-save-settings">
            <Save size={16} />
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
