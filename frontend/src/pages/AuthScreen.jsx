import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  KeyRound
} from 'lucide-react';

export default function AuthScreen({ onBack, onAuthSuccess }) {
  // Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState('login');

  // Login Method: 'phone_otp' | 'password'
  const [loginMethod, setLoginMethod] = useState('phone_otp');

  // Form Fields
  const [phoneNumber, setPhoneNumber] = useState('0988888287');
  const [fullName, setFullName] = useState('Nguyễn Xuân Sơn');
  const [password, setPassword] = useState('Password123@');
  const [confirmPassword, setConfirmPassword] = useState('Password123@');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Step (for Phone OTP login/register)
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      showToast('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpStep(true);
      showToast(`Mã OTP đã gửi đến SĐT ${phoneNumber} (Mã test: 123456)`);
    }, 800);
  };

  const handleVerifyOtpAndLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        name: fullName || 'Nguyễn Xuân Sơn',
        phone: phoneNumber,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        isVerifiedCCCD: true,
        availableBalance: 8450000,
        heldInEscrowBalance: 17835000
      };
      showToast(activeTab === 'login' ? 'Đăng nhập thành công!' : 'Đăng ký tài khoản Escrow thành công!');
      if (onAuthSuccess) onAuthSuccess(userData);
    }, 1000);
  };

  const handlePasswordLogin = () => {
    if (!phoneNumber || !password) {
      showToast('Vui lòng nhập đầy đủ số điện thoại và mật khẩu');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        name: 'Nguyễn Xuân Sơn',
        phone: phoneNumber,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        isVerifiedCCCD: true,
        availableBalance: 8450000,
        heldInEscrowBalance: 17835000
      };
      showToast('Đăng nhập thành công!');
      if (onAuthSuccess) onAuthSuccess(userData);
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        name: 'Nguyễn Xuân Sơn (Google)',
        phone: '0988 888 287',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        isVerifiedCCCD: true,
        availableBalance: 8450000,
        heldInEscrowBalance: 17835000
      };
      showToast('Đăng nhập qua Google thành công!');
      if (onAuthSuccess) onAuthSuccess(userData);
    }, 900);
  };

  return (
    <div className="auth-screen-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="seller-dashboard-toast">
          <CheckCircle2 size={16} color="#0D9488" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="auth-top-bar">
        <button type="button" className="btn-back-profile" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Quay lại trang chủ</span>
        </button>

        <div className="auth-escrow-badge">
          <ShieldCheck size={16} color="#0D9488" />
          <span>Tài khoản bảo chứng Escrow Reown</span>
        </div>
      </div>

      <div className="auth-card-panel">
        {/* Brand Banner */}
        <div className="auth-brand-header">
          <div className="auth-brand-logo-circle">
            <ShieldCheck size={28} strokeWidth={2.4} color="#0D9488" />
          </div>
          <h2 className="auth-brand-title">ReownShop</h2>
          <p className="auth-brand-tagline">
            Chợ đồ cũ thông minh &bull; Bảo chứng dòng tiền an toàn 100%
          </p>
        </div>

        {/* Tab Toggle: Đăng nhập / Đăng ký */}
        <div className="auth-tabs-toggle">
          <button
            type="button"
            className={`btn-auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setOtpStep(false);
            }}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={`btn-auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setOtpStep(false);
            }}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {/* ================= 1. TAB ĐĂNG NHẬP ================= */}
        {activeTab === 'login' && (
          <div className="auth-form-content">
            {!otpStep ? (
              <>
                {/* Method selector: SĐT OTP vs Mật khẩu */}
                <div className="login-method-chips">
                  <button
                    type="button"
                    className={`btn-method-chip ${loginMethod === 'phone_otp' ? 'active' : ''}`}
                    onClick={() => setLoginMethod('phone_otp')}
                  >
                    <Smartphone size={14} />
                    <span>Mã OTP qua SMS</span>
                  </button>
                  <button
                    type="button"
                    className={`btn-method-chip ${loginMethod === 'password' ? 'active' : ''}`}
                    onClick={() => setLoginMethod('password')}
                  >
                    <KeyRound size={14} />
                    <span>Mật khẩu tài khoản</span>
                  </button>
                </div>

                <div className="form-group-item">
                  <label className="form-item-label">Số điện thoại di động:</label>
                  <div className="input-with-icon">
                    <Smartphone size={17} color="#64748B" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Ví dụ: 0988 888 287"
                      className="auth-text-input"
                    />
                  </div>
                </div>

                {loginMethod === 'password' && (
                  <div className="form-group-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="form-item-label" style={{ margin: 0 }}>Mật khẩu:</label>
                      <button 
                        type="button" 
                        className="btn-forgot-password" 
                        onClick={() => showToast('Mã đặt lại mật khẩu đã gửi về số điện thoại của bạn.')}
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                    <div className="input-with-icon">
                      <Lock size={17} color="#64748B" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu..."
                        className="auth-text-input"
                      />
                      <button
                        type="button"
                        className="btn-toggle-eye"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {loginMethod === 'phone_otp' ? (
                  <button
                    type="button"
                    className="btn-primary-auth"
                    disabled={isLoading}
                    onClick={handleSendOtp}
                  >
                    {isLoading ? 'Đang gửi mã...' : 'Nhận mã OTP đăng nhập →'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary-auth"
                    disabled={isLoading}
                    onClick={handlePasswordLogin}
                  >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
                  </button>
                )}

                {/* Social Google Login Divider */}
                <div className="auth-social-divider">
                  <span>Hoặc tiếp tục với</span>
                </div>

                <button
                  type="button"
                  className="btn-google-login"
                  onClick={handleGoogleLogin}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Đăng nhập nhanh với Google</span>
                </button>
              </>
            ) : (
              /* BƯỚC NHẬP OTP XÁC THỰC */
              <div className="otp-verification-panel">
                <div className="otp-icon-header">
                  <Smartphone size={32} color="#0D9488" />
                  <h3>Nhập mã xác thực OTP</h3>
                  <p>Mã 6 chữ số vừa được gửi đến SĐT <strong>{phoneNumber}</strong></p>
                </div>

                <div className="otp-input-wrap">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="otp-code-input"
                    autoFocus
                  />
                  <div className="otp-resend-text">
                    Chưa nhận được mã? <span onClick={handleSendOtp}>Gửi lại (45s)</span>
                  </div>
                </div>

                <div className="otp-actions-group">
                  <button
                    type="button"
                    className="btn-secondary-auth"
                    onClick={() => setOtpStep(false)}
                  >
                    Đổi số điện thoại
                  </button>
                  <button
                    type="button"
                    className="btn-primary-auth"
                    disabled={isLoading}
                    onClick={handleVerifyOtpAndLogin}
                  >
                    {isLoading ? 'Đang xác thực...' : 'Xác nhận & Đăng nhập'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 2. TAB ĐĂNG KÝ ================= */}
        {activeTab === 'register' && (
          <div className="auth-form-content">
            {!otpStep ? (
              <>
                <div className="form-group-item">
                  <label className="form-item-label">Họ và tên của bạn:</label>
                  <div className="input-with-icon">
                    <User size={17} color="#64748B" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Xuân Sơn"
                      className="auth-text-input"
                    />
                  </div>
                </div>

                <div className="form-group-item">
                  <label className="form-item-label">Số điện thoại:</label>
                  <div className="input-with-icon">
                    <Smartphone size={17} color="#64748B" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Số điện thoại nhận OTP"
                      className="auth-text-input"
                    />
                  </div>
                </div>

                <div className="form-group-item">
                  <label className="form-item-label">Mật khẩu mới:</label>
                  <div className="input-with-icon">
                    <Lock size={17} color="#64748B" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tối thiểu 8 ký tự..."
                      className="auth-text-input"
                    />
                    <button
                      type="button"
                      className="btn-toggle-eye"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Terms agreement */}
                <label className="auth-terms-checkbox">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>
                    Tôi cam kết tuân thủ <strong>Quy chế giao dịch Bảo chứng Escrow</strong> (Không chuyển khoản ngoài luồng, hoàn tiền 100% khi phát sinh gian lận).
                  </span>
                </label>

                <button
                  type="button"
                  className="btn-primary-auth"
                  disabled={isLoading || !agreeTerms}
                  onClick={handleSendOtp}
                >
                  {isLoading ? 'Đang gửi mã...' : 'Nhận mã OTP kích hoạt tài khoản →'}
                </button>
              </>
            ) : (
              <div className="otp-verification-panel">
                <div className="otp-icon-header">
                  <ShieldCheck size={32} color="#0D9488" />
                  <h3>Kích hoạt tài khoản Reown</h3>
                  <p>Nhập mã OTP 6 chữ số gửi tới <strong>{phoneNumber}</strong></p>
                </div>

                <div className="otp-input-wrap">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="otp-code-input"
                    autoFocus
                  />
                </div>

                <div className="otp-actions-group">
                  <button
                    type="button"
                    className="btn-secondary-auth"
                    onClick={() => setOtpStep(false)}
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    className="btn-primary-auth"
                    disabled={isLoading}
                    onClick={handleVerifyOtpAndLogin}
                  >
                    {isLoading ? 'Đang kích hoạt...' : 'Hoàn tất đăng ký'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
