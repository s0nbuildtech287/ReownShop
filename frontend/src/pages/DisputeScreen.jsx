import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UploadCloud,
  FileText,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DISPUTE_REASONS, RESOLUTION_OPTIONS } from '../mocks/disputeData';
import { formatVND } from '../utils/formatters';

export default function DisputeScreen({
  order = {
    orderCode: 'REOWN-2025-8829',
    product: {
      title: 'iPhone 14 Pro Max 128GB Tím Deep Purple',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80',
      condition: 'EXCELLENT',
      price: 17800000
    },
    seller: {
      name: 'Nguyễn Văn Minh',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: 4.9
    },
    payment: {
      totalAmount: 17800000
    }
  },
  onBack,
  onGoToChatWithSeller,
  onViewOrder
}) {
  const [selectedReason, setSelectedReason] = useState(DISPUTE_REASONS[0].id);
  const [selectedResolution, setSelectedResolution] = useState(RESOLUTION_OPTIONS[0].id);
  const [customRefundAmount, setCustomRefundAmount] = useState('1500000');
  const [description, setDescription] = useState('Màn hình máy xuất hiện một vệt sọc xanh nhỏ ở cạnh viền trái không hề được người bán đề cập trong phần mô tả sản phẩm lúc mua. Tôi có đính kèm video unbox chứng minh lỗi có sẵn khi mở hộp.');
  const [uploadedEvidence, setUploadedEvidence] = useState([
    { type: 'video', name: 'video_unboxing_mo_hop.mp4', size: '24.5 MB', verified: true },
    { type: 'image', name: 'anh_soc_man_hinh_1.jpg', size: '3.2 MB', verified: true },
    { type: 'image', name: 'anh_so_imei_khong_khop.jpg', size: '2.8 MB', verified: true }
  ]);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disputeCreated, setDisputeCreated] = useState(false);

  const handleSubmitDispute = (e) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setDisputeCreated(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  const handleSimulateAddPhoto = () => {
    const newIdx = uploadedEvidence.length + 1;
    setUploadedEvidence([
      ...uploadedEvidence,
      { type: 'image', name: `anh_bang_chung_bo_sung_${newIdx}.jpg`, size: '2.4 MB', verified: true }
    ]);
  };

  return (
    <div className="dispute-screen-container">
      {/* TOP HEADER */}
      <div className="dispute-header-bar">
        <button type="button" className="btn-back-clean" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Quay lại đơn hàng</span>
        </button>

        <div className="dispute-header-title-box">
          <h1 className="dispute-main-title">Hồ Sơ Khiếu Nại & Trả Hàng Escrow</h1>
          <div className="dispute-order-tag">
            <span>Đơn hàng: <strong>{order.orderCode}</strong></span>
            <span>&bull;</span>
            <span className="badge-escrow-frozen">
              <ShieldAlert size={14} />
              <span>Tiền Escrow ({formatVND(order.payment?.totalAmount || order.product.price)}) đang TẠM KHÓA</span>
            </span>
          </div>
        </div>
      </div>

      {disputeCreated ? (
        /* KHI KHIẾU NẠI ĐÃ ĐƯỢC TẠO THÀNH CÔNG */
        <div className="dispute-success-receipt">
          <div className="receipt-status-banner">
            <div className="success-icon-badge">
              <ShieldAlert size={36} color="#DC2626" />
            </div>
            <h2>Đã mở hồ sơ khiếu nại thành công!</h2>
            <p className="receipt-sub">
              Mã hồ sơ: <strong>DSP-{order.orderCode}-01</strong> &bull; Trọng tài Reown đã tiếp nhận
            </p>
          </div>

          <div className="dispute-timeline-card">
            <h3 className="card-subhead">Tiến trình xử lý tranh chấp:</h3>
            <div className="escrow-dispute-timeline">
              <div className="timeline-node active">
                <div className="node-icon"><CheckCircle2 size={16} /></div>
                <div className="node-content">
                  <strong>1. Người mua mở khiếu nại (Hoàn tất)</strong>
                  <p>Khoản tiền <strong>{formatVND(order.payment?.totalAmount || order.product.price)}</strong> được tạm khóa vô thời hạn trong ví Escrow cho đến khi có phán quyết.</p>
                </div>
              </div>

              <div className="timeline-node pending">
                <div className="node-icon"><Clock size={16} /></div>
                <div className="node-content">
                  <strong>2. Chờ người bán phản hồi (Hạn 24 giờ)</strong>
                  <p>Người bán có 24h để đồng ý giải pháp trả hàng hoàn tiền hoặc thương lượng bồi thường với bạn.</p>
                </div>
              </div>

              <div className="timeline-node next">
                <div className="node-icon"><ShieldCheck size={16} /></div>
                <div className="node-content">
                  <strong>3. Trọng tài Reown phán quyết</strong>
                  <p>Nếu người bán từ chối hoặc quá 24h không phản hồi, Reown sẽ căn cứ video unbox để cưỡng chế hoàn tiền 100%.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="receipt-actions-row">
            <button
              type="button"
              className="btn-primary-dispute"
              onClick={onGoToChatWithSeller || onBack}
            >
              <MessageSquare size={16} />
              <span>Vào khung chat thương lượng với người bán</span>
            </button>
            <button
              type="button"
              className="btn-outline-dispute"
              onClick={onViewOrder || onBack}
            >
              <span>Về màn theo dõi đơn hàng</span>
            </button>
          </div>
        </div>
      ) : (
        /* FORM ĐIỀN KHIẾU NẠI */
        <div className="dispute-grid-layout">
          {/* CỘT TRÁI: TÓM TẮT ĐƠN HÀNG & QUY CHẾ BẢO VỆ ESCROW */}
          <div className="dispute-sidebar-info">
            {/* Thẻ sản phẩm */}
            <div className="dispute-item-card">
              <h3 className="section-title">Sản phẩm khiếu nại</h3>
              <div className="dispute-item-row">
                <img
                  src={order.product?.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80'}
                  alt={order.product?.title}
                  className="dispute-item-thumb"
                />
                <div className="dispute-item-meta">
                  <h4 className="dispute-item-title">{order.product?.title}</h4>
                  <div className="dispute-item-price">{formatVND(order.product?.price || 17800000)}</div>
                  <div className="dispute-seller-line">
                    <span>Người bán: <strong>{order.seller?.name || 'Nguyễn Văn Minh'}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thẻ cơ chế bảo vệ Escrow */}
            <div className="dispute-policy-card">
              <div className="policy-badge-header">
                <ShieldCheck size={20} color="#0D9488" />
                <h4>Quy chế bảo vệ người mua Escrow</h4>
              </div>
              <ul className="policy-list">
                <li>
                  <strong>Tiền được giữ an toàn:</strong> Người bán hoàn toàn chưa nhận được tiền cho đến khi khiếu nại được giải quyết thỏa đáng.
                </li>
                <li>
                  <strong>Ưu tiên video unboxing:</strong> Video mở hộp còn nguyên mã vận đơn là bằng chứng tối thượng giúp bạn thắng khiếu nại 100%.
                </li>
                <li>
                  <strong>Miễn phí cước gửi trả hàng:</strong> Nếu người bán gửi sai hàng hoặc lỗi che giấu, người bán phải chịu 100% phí ship hoàn về.
                </li>
              </ul>
            </div>
          </div>

          {/* CỘT PHẢI: FORM CHỌN LÝ DO & TẢI BẰNG CHỨNG */}
          <form className="dispute-form-panel" onSubmit={handleSubmitDispute}>
            {/* 1. Chọn lý do */}
            <div className="form-section-block">
              <h3 className="form-section-title">1. Chọn lý do khiếu nại chính xác:</h3>
              <div className="reasons-radio-grid">
                {DISPUTE_REASONS.map((reason) => {
                  const isChecked = selectedReason === reason.id;
                  return (
                    <div
                      key={reason.id}
                      className={`reason-option-box ${isChecked ? 'selected' : ''}`}
                      onClick={() => setSelectedReason(reason.id)}
                    >
                      <input
                        type="radio"
                        name="disputeReason"
                        checked={isChecked}
                        onChange={() => setSelectedReason(reason.id)}
                      />
                      <div className="reason-text">
                        <strong className="reason-title">{reason.title}</strong>
                        <p className="reason-desc">{reason.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Chọn phương án mong muốn */}
            <div className="form-section-block">
              <h3 className="form-section-title">2. Phương án giải quyết bạn đề xuất:</h3>
              <div className="resolutions-grid">
                {RESOLUTION_OPTIONS.map((res) => {
                  const isSelected = selectedResolution === res.id;
                  return (
                    <div
                      key={res.id}
                      className={`resolution-box ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedResolution(res.id)}
                    >
                      <input
                        type="radio"
                        name="resolutionOption"
                        checked={isSelected}
                        onChange={() => setSelectedResolution(res.id)}
                      />
                      <div className="res-content">
                        <strong>{res.title}</strong>
                        <p>{res.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedResolution === 'PARTIAL_REFUND_KEEP' && (
                <div className="custom-refund-input-wrap">
                  <label>Số tiền yêu cầu người bán bồi hoàn (VNĐ):</label>
                  <div className="input-vnd-field">
                    <input
                      type="text"
                      value={customRefundAmount}
                      onChange={(e) => setCustomRefundAmount(e.target.value)}
                      placeholder="Ví dụ: 1.500.000"
                    />
                    <span>₫</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Tải bằng chứng ảnh / video */}
            <div className="form-section-block">
              <h3 className="form-section-title">3. Bằng chứng kiểm tra (Ảnh & Video Unbox):</h3>
              <div className="evidence-list-wrap">
                {uploadedEvidence.map((item, idx) => (
                  <div key={idx} className="evidence-item-badge">
                    {item.type === 'video' ? <Video size={16} color="#0D9488" /> : <ImageIcon size={16} color="#0284C7" />}
                    <span className="file-name">{item.name}</span>
                    <span className="file-size">({item.size})</span>
                    <span className="badge-verified"><CheckCircle2 size={12} /> Hợp lệ</span>
                  </div>
                ))}
              </div>

              <div className="upload-dropzone-simulated" onClick={handleSimulateAddPhoto}>
                <UploadCloud size={24} color="#0D9488" />
                <div>
                  <strong>Bấm để tải thêm ảnh lỗi hoặc video unbox</strong>
                  <p>Hỗ trợ MP4, MOV, JPG, PNG dung lượng tối đa 100MB</p>
                </div>
              </div>
            </div>

            {/* 4. Chi tiết giải trình */}
            <div className="form-section-block">
              <h3 className="form-section-title">4. Mô tả chi tiết tình trạng hàng khi nhận:</h3>
              <textarea
                className="dispute-textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả cụ thể sự khác biệt so với cam kết ban đầu của người bán..."
              />
            </div>

            {/* 5. Cam kết */}
            <label className="dispute-agree-checkbox">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                Tôi cam kết thông tin và bằng chứng cung cấp là sự thật. Tôi hiểu rằng gian lận trong khiếu nại Escrow có thể dẫn tới việc khóa vĩnh viễn tài khoản và chuyển cơ quan chức năng.
              </span>
            </label>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || !agreeTerms}
              className="btn-submit-dispute-main"
            >
              {isSubmitting ? 'Đang gửi hồ sơ tới Trọng tài...' : 'Gửi Yêu Cầu Khiếu Nại & Khóa Tiền Escrow'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
