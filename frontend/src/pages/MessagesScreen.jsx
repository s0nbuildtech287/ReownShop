import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Tag, 
  ChevronRight, 
  CheckCheck, 
  Check, 
  Clock, 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  ArrowLeft, 
  AlertTriangle, 
  ExternalLink, 
  ShoppingBag, 
  X, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Truck,
  DollarSign
} from 'lucide-react';
import { MOCK_CHATS, INITIAL_CHAT_MESSAGES, AUTO_REPLIES } from '../mocks/chats';
import { formatVND } from '../utils/formatters';

// Regex detects suspicious bank accounts, transfers, or off-platform contact
const SUSPICIOUS_PATTERN = /(stk|số tài khoản|chuyển khoản|chuyển cọc|ngân hàng|bank|vietcombank|mbbank|techcombank|acb|tpbank|vpbank|bidv|zalo|inbox zalo|\b\d{9,16}\b)/i;

export default function MessagesScreen({ 
  onSelectChat, 
  onBackHome,
  onViewProduct,
  onStartCheckout
}) {
  const [filterType, setFilterType] = useState('ALL'); // ALL | OFFER
  const [searchWord, setSearchWord] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(MOCK_CHATS[0]?.id || 'chat_1');
  const [typedMessage, setTypedMessage] = useState('');
  
  // Mobile specific: show chat detail pane on mobile when true
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  // Chat messages dictionary
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);

  // Realtime "is typing..." indicator state
  const [isTyping, setIsTyping] = useState(false);

  // In-chat Offer Dialog state
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [offerInputPrice, setOfferInputPrice] = useState(0);
  const [offerNote, setOfferNote] = useState('');

  // Counter Offer dialog state
  const [counterTargetMessage, setCounterTargetMessage] = useState(null);
  const [counterInputPrice, setCounterInputPrice] = useState(0);

  const fileInputRef = useRef(null);
  const chatStreamEndRef = useRef(null);

  const currentChat = MOCK_CHATS.find((c) => c.id === selectedChatId) || MOCK_CHATS[0];
  const messagesList = chatMessages[currentChat?.id] || [];

  // Scroll to bottom whenever messages change or typing changes
  useEffect(() => {
    chatStreamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesList, isTyping]);

  // Set initial offer price based on current chat product price
  useEffect(() => {
    if (currentChat?.product?.price) {
      setOfferInputPrice(Math.round(currentChat.product.price * 0.95)); // Default 5% off
    }
  }, [currentChat]);

  // Filter chats by search and offer
  const filteredChats = MOCK_CHATS.filter((chat) => {
    if (filterType === 'OFFER' && !chat.hasOffer) return false;
    if (searchWord.trim()) {
      const q = searchWord.toLowerCase();
      return (
        chat.sellerName.toLowerCase().includes(q) ||
        chat.product.title.toLowerCase().includes(q) ||
        chat.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle selecting chat
  const handleSelectChat = (chat) => {
    setSelectedChatId(chat.id);
    setMobileShowDetail(true);
    if (onSelectChat) onSelectChat(chat);
  };

  // SEND TEXT MESSAGE (with Realtime Mock Simulation)
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!typedMessage.trim() || !currentChat) return;

    const textToSend = typedMessage.trim();
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'buyer',
      type: 'text',
      text: textToSend,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChatMessages((prev) => ({
      ...prev,
      [currentChat.id]: [...(prev[currentChat.id] || []), newMsg]
    }));
    setTypedMessage('');

    // SIMULATE REALTIME RESPONSE (Placeholder for WebSocket connection)
    simulateSellerRealtimeResponse(currentChat.id);
  };

  // Simulated seller auto-reply after 2.5 - 3.5 seconds
  const simulateSellerRealtimeResponse = (chatId) => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
        const replyMsg = {
          id: `msg_reply_${Date.now()}`,
          sender: 'seller',
          type: 'text',
          text: randomReply,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };

        setChatMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), replyMsg]
        }));
      }, 1800);
    }, 1000);
  };

  // SEND ATTACHED IMAGE
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentChat) return;

    const imageUrl = URL.createObjectURL(file);
    const newMsg = {
      id: `msg_img_${Date.now()}`,
      sender: 'buyer',
      type: 'image',
      imageUrl,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChatMessages((prev) => ({
      ...prev,
      [currentChat.id]: [...(prev[currentChat.id] || []), newMsg]
    }));

    if (fileInputRef.current) fileInputRef.current.value = '';
    simulateSellerRealtimeResponse(currentChat.id);
  };

  // SEND IN-CHAT OFFER
  const handleSendOffer = () => {
    if (!offerInputPrice || !currentChat) return;

    const offerMsg = {
      id: `msg_offer_${Date.now()}`,
      sender: 'buyer',
      type: 'offer',
      offerAmount: offerInputPrice,
      originalPrice: currentChat.product.price,
      offerStatus: 'PENDING',
      note: offerNote.trim() || 'Em gửi đề nghị giá cho sản phẩm này ạ!',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChatMessages((prev) => ({
      ...prev,
      [currentChat.id]: [...(prev[currentChat.id] || []), offerMsg]
    }));

    setShowOfferDialog(false);
    setOfferNote('');

    // Simulate seller accepting or countering after 3 seconds
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages((prev) => {
          const currentList = prev[currentChat.id] || [];
          return {
            ...prev,
            [currentChat.id]: currentList.map((m) => 
              m.id === offerMsg.id ? { ...m, offerStatus: 'ACCEPTED' } : m
            ).concat({
              id: `msg_seller_accept_${Date.now()}`,
              sender: 'seller',
              type: 'text',
              text: `Dạ mình đồng ý chốt giá ${formatVND(offerInputPrice)} nhé! Bạn bấm nút "Thanh toán ngay" để Escrow giữ tiền là mình gửi hàng liền.`,
              time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              status: 'read'
            })
          };
        });
      }, 2000);
    }, 1200);
  };

  // ACCEPT SELLER'S COUNTER OFFER
  const handleAcceptCounterOffer = (messageId, amount) => {
    setChatMessages((prev) => ({
      ...prev,
      [currentChat.id]: (prev[currentChat.id] || []).map((m) => 
        m.id === messageId ? { ...m, offerStatus: 'ACCEPTED' } : m
      )
    }));

    // Trigger instant checkout option
    if (onStartCheckout) {
      onStartCheckout({
        ...currentChat.product,
        price: amount,
        originalPrice: currentChat.product.price
      });
    }
  };

  // REJECT COUNTER OFFER
  const handleRejectOffer = (messageId) => {
    setChatMessages((prev) => ({
      ...prev,
      [currentChat.id]: (prev[currentChat.id] || []).map((m) => 
        m.id === messageId ? { ...m, offerStatus: 'REJECTED' } : m
      )
    }));
  };

  // SUBMIT COUNTER BACK
  const handleSubmitCounterBack = () => {
    if (!counterTargetMessage || !counterInputPrice) return;

    const counterMsg = {
      id: `msg_counter_${Date.now()}`,
      sender: 'buyer',
      type: 'offer',
      offerAmount: counterInputPrice,
      originalPrice: currentChat.product.price,
      offerStatus: 'PENDING',
      note: 'Em xin phép trả lại mức giá này, anh xem hợp lý chốt giúp em nhé!',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChatMessages((prev) => ({
      ...prev,
      [currentChat.id]: (prev[currentChat.id] || []).map((m) => 
        m.id === counterTargetMessage.id ? { ...m, offerStatus: 'COUNTERED' } : m
      ).concat(counterMsg)
    }));

    setCounterTargetMessage(null);
  };

  return (
    <div className="messages-layout-container">
      {/* ================= CỘT TRÁI: DANH SÁCH HỘI THOẠI ================= */}
      <div className={`messages-chat-list-card ${mobileShowDetail ? 'mobile-hidden' : ''}`}>
        {/* Messages Header */}
        <div className="chat-list-header">
          <div className="chat-list-header-top">
            <div>
              <h1 className="chat-list-title">Tin nhắn & Trả giá</h1>
              <p className="chat-list-subtitle">Bảo chứng an toàn bởi Reown Escrow</p>
            </div>
            <div className="escrow-header-pill">
              <ShieldCheck size={13} />
              <span>Escrow Chat</span>
            </div>
          </div>

          {/* Search Chats Input */}
          <div className="chat-search-bar">
            <Search size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Tìm theo người bán, tên món đồ..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="chat-search-input"
            />
          </div>

          {/* Filter Pills */}
          <div className="chat-filter-pills">
            <button
              type="button"
              className={`chat-filter-pill ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              Tất cả ({MOCK_CHATS.length})
            </button>
            <button
              type="button"
              className={`chat-filter-pill ${filterType === 'OFFER' ? 'active' : ''}`}
              onClick={() => setFilterType('OFFER')}
            >
              <Tag size={12} />
              <span>Có trả giá (Offer)</span>
            </button>
          </div>
        </div>

        {/* Chat List Items */}
        <div className="chat-items-scroll-box hide-scrollbar">
          {filteredChats.map((chat) => {
            const isSelected = chat.id === currentChat?.id;
            return (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`chat-list-item ${isSelected ? 'active' : ''}`}
              >
                <div className="chat-item-avatar-wrap">
                  <img
                    src={chat.sellerAvatar}
                    alt={chat.sellerName}
                    className="chat-item-avatar"
                  />
                  {chat.isOnline && <span className="chat-online-dot" />}
                </div>

                <div className="chat-item-info">
                  <div className="chat-item-top-row">
                    <h3 className="chat-item-name">{chat.sellerName}</h3>
                    <span className="chat-item-time">{chat.lastTime}</span>
                  </div>

                  <p className={`chat-item-preview ${chat.unreadCount > 0 ? 'unread' : ''}`}>
                    {chat.lastMessage}
                  </p>

                  {/* Attached Mini Product Snippet */}
                  <div className="chat-item-product-snippet">
                    <span className="snippet-title">{chat.product.title}</span>
                    <strong className="snippet-price">{formatVND(chat.product.price)}</strong>
                  </div>
                </div>

                {chat.unreadCount > 0 && (
                  <span className="chat-unread-badge">{chat.unreadCount}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= CỘT PHẢI: KHUNG HỘI THOẠI TRỰC TIẾP ================= */}
      <div className={`messages-detail-pane ${!mobileShowDetail ? 'mobile-hidden' : ''}`}>
        {currentChat ? (
          <>
            {/* 1. KHUNG HEADER HỘI THOẠI VỚI NÚT QUAY LẠI MOBILE */}
            <div className="chat-pane-header">
              <div className="chat-pane-header-left">
                {/* Mobile Back Button */}
                <button
                  type="button"
                  className="chat-mobile-back-btn"
                  onClick={() => setMobileShowDetail(false)}
                  title="Quay lại danh sách"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="chat-seller-avatar-box">
                  <img
                    src={currentChat.sellerAvatar}
                    alt={currentChat.sellerName}
                    className="chat-seller-avatar"
                  />
                  {currentChat.isOnline && <span className="chat-online-dot" />}
                </div>

                <div>
                  <div className="chat-seller-title-row">
                    <h2 className="chat-seller-name">{currentChat.sellerName}</h2>
                    <span className="chat-trust-tag">
                      <ShieldCheck size={11} />
                      <span>Đã xác minh</span>
                    </span>
                  </div>
                  <div className="chat-online-status">
                    <span className="pulse-dot" />
                    <span>Đang hoạt động &bull; Phản hồi trong 15 phút</span>
                  </div>
                </div>
              </div>

              {/* 2. ĐẦU KHUNG CHAT: THẺ SẢN PHẨM GHIM VÀ NÚT XEM TIN */}
              <div className="chat-pinned-product-card">
                <img
                  src={currentChat.product.image}
                  alt={currentChat.product.title}
                  className="pinned-product-thumb"
                />
                <div className="pinned-product-meta">
                  <h4 className="pinned-product-title" title={currentChat.product.title}>
                    {currentChat.product.title}
                  </h4>
                  <div className="pinned-product-price-row">
                    <strong className="pinned-product-price">
                      {formatVND(currentChat.product.price)}
                    </strong>
                    <span className="pinned-status-badge">
                      {currentChat.product.conditionLabel || 'Đang bán'}
                    </span>
                  </div>
                </div>

                <div className="pinned-action-buttons">
                  <button
                    type="button"
                    className="btn-pinned-view"
                    onClick={() => onViewProduct && onViewProduct(currentChat.product)}
                    title="Xem chi tiết sản phẩm này"
                  >
                    <span>Xem tin</span>
                    <ExternalLink size={13} />
                  </button>

                  <button
                    type="button"
                    className="btn-pinned-buy"
                    onClick={() => onStartCheckout && onStartCheckout(currentChat.product)}
                    title="Mua ngay qua Escrow"
                  >
                    <ShoppingBag size={13} />
                    <span>Mua ngay</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. VÙNG STREAM TIN NHẮN (BONG BÓNG + THẺ ĐẶC BIỆT + CẢNH BÁO) */}
            <div className="chat-stream-area hide-scrollbar">
              {/* Banner nhắc an toàn cố định ở đầu cuộc chat */}
              <div className="chat-safety-fixed-banner">
                <ShieldCheck size={16} color="#0D9488" className="safety-shield-icon" />
                <div className="safety-banner-text">
                  <strong>Quy tắc bảo vệ Escrow Reown:</strong> Hãy luôn giao dịch và thanh toán qua hệ thống. Tuyệt đối không chuyển khoản hoặc gửi cọc trực tiếp ngoài nền tảng để tránh rủi ro mất tiền.
                </div>
              </div>

              {/* Danh sách tin nhắn */}
              {messagesList.map((msg) => {
                const isMe = msg.sender === 'buyer';
                const isSystem = msg.sender === 'system';
                const isSuspicious = msg.text && SUSPICIOUS_PATTERN.test(msg.text);

                // SYSTEM NOTIFICATION CARD (Cập nhật trạng thái đơn hàng)
                if (isSystem || msg.type === 'order_status') {
                  return (
                    <div key={msg.id} className="chat-system-card">
                      <div className="system-card-icon-wrap">
                        {msg.orderStatus === 'SHIPPED' ? (
                          <Truck size={18} color="#0D9488" />
                        ) : (
                          <ShieldCheck size={18} color="#0D9488" />
                        )}
                      </div>
                      <div className="system-card-body">
                        <div className="system-card-header">
                          <span className="system-card-code">Mã đơn: {msg.orderCode}</span>
                          <span className="system-card-badge">{msg.orderStatus}</span>
                        </div>
                        <h4 className="system-card-title">{msg.title}</h4>
                        <p className="system-card-sub">{msg.subText}</p>
                        {msg.amount && (
                          <div className="system-card-amount">
                            Số tiền bảo chứng: <strong>{formatVND(msg.amount)}</strong>
                          </div>
                        )}
                        <span className="system-card-time">{msg.time}</span>
                      </div>
                    </div>
                  );
                }

                // SPECIAL CARD: THẺ ĐỀ NGHỊ GIÁ (OFFER CARD)
                if (msg.type === 'offer' || msg.type === 'counter_offer') {
                  const isAccepted = msg.offerStatus === 'ACCEPTED';
                  const isRejected = msg.offerStatus === 'REJECTED';
                  const isCountered = msg.offerStatus === 'COUNTERED';
                  const isPending = msg.offerStatus === 'PENDING';
                  const amount = msg.offerAmount || msg.counterAmount;

                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble-wrapper ${isMe ? 'align-right' : 'align-left'}`}
                    >
                      <div className="chat-offer-card">
                        <div className="offer-card-top-tag">
                          <Tag size={13} />
                          <span>
                            {msg.type === 'counter_offer' ? 'Đề nghị giá phản hồi từ Người bán' : 'Đề nghị giá từ Người mua'}
                          </span>
                        </div>

                        <div className="offer-card-price-row">
                          <span className="offer-card-lbl">Giá đề nghị:</span>
                          <strong className="offer-card-val">{formatVND(amount)}</strong>
                        </div>

                        {msg.originalPrice && (
                          <div className="offer-card-orig-price">
                            (Giá niêm yết: {formatVND(msg.originalPrice)})
                          </div>
                        )}

                        {msg.note && <p className="offer-card-note">"{msg.note}"</p>}

                        {/* Status Badge */}
                        <div className="offer-status-badge-row">
                          <span className={`offer-status-badge ${msg.offerStatus?.toLowerCase()}`}>
                            {isAccepted && 'Đã chấp nhận giá này'}
                            {isRejected && 'Đã từ chối'}
                            {isCountered && 'Đã trả giá lại'}
                            {isPending && 'Đang chờ phản hồi'}
                          </span>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="offer-actions-bar">
                          {isAccepted && isMe && (
                            <button
                              type="button"
                              className="btn-offer-pay-now"
                              onClick={() => {
                                if (onStartCheckout) {
                                  onStartCheckout({
                                    ...currentChat.product,
                                    price: amount,
                                    originalPrice: currentChat.product.price
                                  });
                                }
                              }}
                            >
                              <ShoppingBag size={14} />
                              <span>Thanh toán ngay ({formatVND(amount)})</span>
                            </button>
                          )}

                          {!isMe && isPending && (
                            <div className="counter-btn-group">
                              <button
                                type="button"
                                className="btn-counter-accept"
                                onClick={() => handleAcceptCounterOffer(msg.id, amount)}
                              >
                                <Check size={14} />
                                <span>Chấp nhận</span>
                              </button>
                              <button
                                type="button"
                                className="btn-counter-counter"
                                onClick={() => {
                                  setCounterTargetMessage(msg);
                                  setCounterInputPrice(amount);
                                }}
                              >
                                <RotateCcw size={13} />
                                <span>Trả giá lại</span>
                              </button>
                              <button
                                type="button"
                                className="btn-counter-reject"
                                onClick={() => handleRejectOffer(msg.id)}
                              >
                                <X size={14} />
                                <span>Từ chối</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <span className="offer-card-time">{msg.time}</span>
                      </div>
                    </div>
                  );
                }

                // SPECIAL CARD: HÌNH ẢNH ĐÍNH KÈM
                if (msg.type === 'image') {
                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble-wrapper ${isMe ? 'align-right' : 'align-left'}`}
                    >
                      <div className="chat-image-bubble">
                        <img src={msg.imageUrl} alt="Ảnh đính kèm" className="chat-attached-img" />
                        <div className="bubble-time-stamp-row">
                          <span>{msg.time}</span>
                          {isMe && <CheckCheck size={13} color="#0D9488" />}
                        </div>
                      </div>
                    </div>
                  );
                }

                // STANDARD TEXT MESSAGE BUBBLE
                return (
                  <div
                    key={msg.id}
                    className={`chat-bubble-wrapper ${isMe ? 'align-right' : 'align-left'}`}
                  >
                    <div className={`chat-message-bubble ${isMe ? 'bubble-me' : 'bubble-other'}`}>
                      <p className="bubble-text">{msg.text}</p>
                      
                      <div className="bubble-meta-row">
                        <span className="bubble-time">{msg.time}</span>
                        {isMe && (
                          <span className="bubble-status-icon">
                            {msg.status === 'read' ? (
                              <CheckCheck size={13} color="rgba(255,255,255,0.9)" />
                            ) : (
                              <Check size={13} color="rgba(255,255,255,0.7)" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* SUSPICIOUS OFF-PLATFORM BANK WARNING */}
                    {isSuspicious && (
                      <div className="suspicious-bank-alert-box">
                        <div className="alert-badge-row">
                          <AlertTriangle size={14} color="#DC2626" />
                          <strong>Cảnh báo an toàn Escrow:</strong>
                        </div>
                        <p className="alert-content">
                          Phát hiện thông tin số tài khoản hoặc dấu hiệu giao dịch ngoài nền tảng. Tuyệt đối không chuyển khoản trực tiếp! Mọi giao dịch ngoài Reown Escrow sẽ <strong>không được bảo đảm hoàn tiền</strong> nếu người bán không gửi hàng.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* REALTIME "IS TYPING..." INDICATOR */}
              {isTyping && (
                <div className="chat-bubble-wrapper align-left">
                  <div className="typing-indicator-bubble">
                    <span className="typing-label">{currentChat.sellerName} đang nhập</span>
                    <div className="typing-dots-animation">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatStreamEndRef} />
            </div>

            {/* 4. THANH NHẬP LIỆU: NÚT TRẢ GIÁ, NÚT ẢNH, INPUT, GỬI */}
            <form onSubmit={handleSendMessage} className="chat-input-bar-container">
              {/* Nút Đề nghị giá */}
              <button
                type="button"
                className="btn-chat-action-offer"
                onClick={() => setShowOfferDialog(true)}
                title="Gửi đề nghị giá mới"
              >
                <Tag size={15} />
                <span>Đề nghị giá</span>
              </button>

              {/* Nút gửi ảnh */}
              <button
                type="button"
                className="btn-chat-action-icon"
                onClick={() => fileInputRef.current?.click()}
                title="Gửi ảnh đính kèm"
              >
                <ImageIcon size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />

              {/* Ô nhập tin nhắn */}
              <input
                type="text"
                placeholder="Nhập tin nhắn cho người bán (Enter để gửi)..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="chat-text-input-field"
              />

              {/* Nút Gửi */}
              <button
                type="submit"
                disabled={!typedMessage.trim()}
                className={`btn-chat-send ${typedMessage.trim() ? 'active' : ''}`}
              >
                <Send size={16} />
                <span>Gửi</span>
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty-selection">
            <div className="empty-chat-icon-wrap">
              <ShieldCheck size={36} color="#0D9488" />
            </div>
            <h3>Chọn một cuộc hội thoại từ danh sách bên trái</h3>
            <p>Hệ thống Reown Escrow bảo vệ an toàn mọi trao đổi và trả giá của bạn.</p>
          </div>
        )}
      </div>

      {/* POPUP 1: ĐỀ NGHỊ GIÁ TRỰC TIẾP TRONG CHAT */}
      {showOfferDialog && (
        <div className="modal-backdrop-overlay" onClick={() => setShowOfferDialog(false)}>
          <div className="chat-offer-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="chat-offer-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} color="#0D9488" />
                <h3 className="modal-title">Gửi đề nghị giá cho người bán</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowOfferDialog(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="chat-offer-modal-body">
              {/* Product mini banner */}
              <div className="offer-modal-product-box">
                <img src={currentChat.product.image} alt={currentChat.product.title} />
                <div>
                  <h4 className="offer-modal-product-name">{currentChat.product.title}</h4>
                  <div className="offer-modal-product-price">
                    Giá niêm yết: <strong>{formatVND(currentChat.product.price)}</strong>
                  </div>
                </div>
              </div>

              {/* Quick Select Buttons (-5%, -10%, -15%) */}
              <div className="quick-discount-buttons-row">
                <span className="quick-lbl">Chọn nhanh:</span>
                {[5, 10, 15].map((pct) => {
                  const discounted = Math.round(currentChat.product.price * (1 - pct / 100));
                  return (
                    <button
                      key={pct}
                      type="button"
                      className="btn-quick-pct"
                      onClick={() => setOfferInputPrice(discounted)}
                    >
                      -{pct}% ({formatVND(discounted)})
                    </button>
                  );
                })}
              </div>

              {/* Price input */}
              <div className="offer-modal-input-group">
                <label>Mức giá đề xuất của bạn (VNĐ):</label>
                <div className="price-input-wrapper">
                  <input
                    type="number"
                    step={50000}
                    value={offerInputPrice}
                    onChange={(e) => setOfferInputPrice(Number(e.target.value))}
                    className="listing-input-price small"
                  />
                  <span className="price-currency-tag">₫</span>
                </div>
              </div>

              {/* Note input */}
              <div className="offer-modal-input-group">
                <label>Lời nhắn cho người bán (Tùy chọn):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Em qua lấy trực tiếp hoặc chốt mua luôn hôm nay ạ..."
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  className="listing-input-text"
                />
              </div>

              <div className="offer-escrow-reminder">
                <ShieldCheck size={15} color="#0D9488" />
                <span>Khi người bán đồng ý, bạn có thể thanh toán giữ tiền an toàn qua Escrow ngay.</span>
              </div>
            </div>

            <div className="chat-offer-modal-footer">
              <button
                type="button"
                className="btn-dialog-secondary"
                onClick={() => setShowOfferDialog(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn-dialog-primary"
                onClick={handleSendOffer}
              >
                Gửi đề nghị giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: TRẢ GIÁ LẠI (COUNTER OFFER) */}
      {counterTargetMessage && (
        <div className="modal-backdrop-overlay" onClick={() => setCounterTargetMessage(null)}>
          <div className="chat-offer-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="chat-offer-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} color="#0D9488" />
                <h3 className="modal-title">Trả giá lại (Counter Offer)</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setCounterTargetMessage(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="chat-offer-modal-body">
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '14px' }}>
                Người bán đã đề xuất mức giá: <strong>{formatVND(counterTargetMessage.counterAmount || counterTargetMessage.offerAmount)}</strong>. Bạn muốn phản hồi lại mức giá nào?
              </p>

              <div className="offer-modal-input-group">
                <label>Mức giá phản hồi của bạn (VNĐ):</label>
                <div className="price-input-wrapper">
                  <input
                    type="number"
                    step={50000}
                    value={counterInputPrice}
                    onChange={(e) => setCounterInputPrice(Number(e.target.value))}
                    className="listing-input-price small"
                  />
                  <span className="price-currency-tag">₫</span>
                </div>
              </div>
            </div>

            <div className="chat-offer-modal-footer">
              <button
                type="button"
                className="btn-dialog-secondary"
                onClick={() => setCounterTargetMessage(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn-dialog-primary"
                onClick={handleSubmitCounterBack}
              >
                Gửi giá phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
