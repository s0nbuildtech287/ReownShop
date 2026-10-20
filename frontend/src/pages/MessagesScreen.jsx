import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Tag, 
  ChevronRight, 
  CheckCheck, 
  Clock, 
  Send, 
  Smile, 
  Paperclip, 
  ArrowLeft 
} from 'lucide-react';
import { MOCK_CHATS } from '../mocks/chats';
import { formatVND } from '../utils/formatters';

export default function MessagesScreen({ onSelectChat, onBackHome }) {
  const [filterType, setFilterType] = useState('ALL'); // ALL | OFFER
  const [searchWord, setSearchWord] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(MOCK_CHATS[0]?.id || null);
  const [typedMessage, setTypedMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({
    chat_1: [
      { id: 'm1', sender: 'seller', text: 'Chào anh! Anh có quan tâm chiếc iPhone 14 Pro Max bên em không ạ?', time: '10:15' },
      { id: 'm2', sender: 'buyer', text: 'Máy pin còn bao nhiêu % vậy em? Có hộp zin theo máy không?', time: '10:18' },
      { id: 'm3', sender: 'seller', text: 'Dạ pin còn 89% anh nhé, hộp và cáp sạc C-Lightning chính hãng theo máy còn đầy đủ ạ.', time: '10:20' },
      { id: 'm4', sender: 'buyer', text: 'Anh gửi đề nghị trả giá 17.200.000₫ được không em?', time: '10:22', isOffer: true, offerVal: 17200000 },
      { id: 'm5', sender: 'seller', text: 'Dạ ok anh, em đồng ý chốt giá 17.200.000₫ nhé. Anh tạo đơn giữ tiền qua Escrow là em ship liền trong 2 tiếng.', time: '10:28' }
    ]
  });

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

  const currentChat = MOCK_CHATS.find((c) => c.id === selectedChatId) || MOCK_CHATS[0];
  const messagesList = chatMessages[currentChat?.id] || [
    { id: 'm0', sender: 'seller', text: currentChat?.lastMessage, time: currentChat?.lastTime }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !currentChat) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'buyer',
      text: typedMessage.trim(),
      time: 'Vừa xong'
    };

    setChatMessages((prev) => ({
      ...prev,
      [currentChat.id]: [...(prev[currentChat.id] || []), newMsg]
    }));

    setTypedMessage('');
  };

  return (
    <div className="messages-layout-container">
      {/* CỘT TRÁI: DANH SÁCH HỘI THOẠI */}
      <div className="messages-chat-list-card">
        {/* Messages Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
                Tin nhắn & Trả giá
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Đàm phán giá an toàn — Bảo chứng Escrow
              </p>
            </div>
            <div style={{
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldCheck size={13} />
              <span>Escrow Chat</span>
            </div>
          </div>

          {/* Search Chats Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--surface-alt)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px'
          }}>
            <Search size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Tìm theo người bán, tên món đồ..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '13px',
                width: '100%',
                fontFamily: 'inherit',
                color: 'var(--text-main)'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: filterType === 'ALL' ? 'var(--primary)' : 'var(--border)',
                background: filterType === 'ALL' ? 'var(--primary)' : 'var(--surface)',
                color: filterType === 'ALL' ? 'white' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Tất cả ({MOCK_CHATS.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('OFFER')}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: filterType === 'OFFER' ? 'var(--primary)' : 'var(--border)',
                background: filterType === 'OFFER' ? 'var(--primary)' : 'var(--surface)',
                color: filterType === 'OFFER' ? 'white' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Tag size={12} />
              <span>Có trả giá (Offer)</span>
            </button>
          </div>
        </div>

        {/* Trust Reminder Strip */}
        <div style={{
          background: '#FEF3C7',
          borderBottom: '1px solid #FDE68A',
          padding: '8px 16px',
          fontSize: '11px',
          color: '#92400E',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <ShieldCheck size={13} color="#D97706" style={{ flexShrink: 0 }} />
          <span>Không chuyển cọc ngoài nền tảng để tránh lừa đảo.</span>
        </div>

        {/* Chat List */}
        <div style={{ overflowY: 'auto', maxHeight: '650px' }}>
          {filteredChats.map((chat) => {
            const isSelected = chat.id === currentChat?.id;
            return (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChatId(chat.id);
                  if (onSelectChat) onSelectChat(chat);
                }}
                style={{
                  padding: '12px 16px',
                  background: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                  borderBottom: '1px solid var(--border)',
                  borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  {/* Seller Avatar */}
                  <div style={{ position: 'relative' }}>
                    <img
                      src={chat.sellerAvatar}
                      alt={chat.sellerName}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid var(--border)'
                      }}
                    />
                    {chat.isOnline && (
                      <span style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '9px',
                        height: '9px',
                        backgroundColor: '#16A34A',
                        borderRadius: '50%',
                        border: '2px solid white'
                      }} />
                    )}
                  </div>

                  {/* Chat Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {chat.sellerName}
                      </h3>
                      <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                        {chat.lastTime}
                      </span>
                    </div>

                    <p style={{
                      fontSize: '12.5px',
                      color: chat.unreadCount > 0 ? 'var(--text-main)' : 'var(--text-muted)',
                      fontWeight: chat.unreadCount > 0 ? 600 : 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '6px'
                    }}>
                      {chat.lastMessage}
                    </p>

                    {/* Attached Mini Product Snippet */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      border: '1px solid var(--border)'
                    }}>
                      <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                        {chat.product.title}
                      </span>
                      <strong style={{ color: '#DC2626' }}>
                        {formatVND(chat.product.price)}
                      </strong>
                    </div>
                  </div>

                  {chat.unreadCount > 0 && (
                    <span style={{
                      background: 'var(--accent)',
                      color: 'white',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '10px',
                      fontWeight: 800,
                      minWidth: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px'
                    }}>
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CỘT PHẢI (DESKTOP): KHUNG HỘI THOẠI TRỰC TIẾP */}
      <div className="messages-detail-pane">
        {currentChat ? (
          <>
            {/* Chat Pane Header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={currentChat.sellerAvatar}
                  alt={currentChat.sellerName}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 800 }}>{currentChat.sellerName}</h2>
                    <span style={{
                      background: '#DCFCE7',
                      color: '#16A34A',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      Uy tín
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A' }} />
                    <span>Đang hoạt động — Phản hồi trong 15 phút</span>
                  </div>
                </div>
              </div>

              {/* Product Pin Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--surface-alt)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}>
                <img
                  src={currentChat.product.image}
                  alt={currentChat.product.title}
                  style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentChat.product.title}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#DC2626' }}>
                    {formatVND(currentChat.product.price)}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Stream Area */}
            <div style={{
              flex: 1,
              padding: '20px',
              background: '#F8FAFC',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              minHeight: '340px'
            }}>
              {/* Escrow System Security Notification */}
              <div style={{
                margin: '0 auto',
                background: '#F0FDFA',
                border: '1px solid #CCFBF1',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '11.5px',
                color: '#0F766E',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ShieldCheck size={14} />
                <span>Cuộc hội thoại được mã hóa. Đơn hàng sẽ được bảo chứng bởi Reown Escrow.</span>
              </div>

              {messagesList.map((msg) => {
                const isMe = msg.sender === 'buyer';
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      background: isMe ? 'var(--primary)' : 'white',
                      color: isMe ? 'white' : 'var(--text-main)',
                      padding: '10px 14px',
                      borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      fontSize: '13.5px',
                      lineHeight: '1.45',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                      border: isMe ? 'none' : '1px solid var(--border)'
                    }}>
                      {msg.text}

                      {msg.isOffer && (
                        <div style={{
                          marginTop: '8px',
                          padding: '6px 10px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700
                        }}>
                          ⚡ Mức giá đề nghị: {formatVND(msg.offerVal)}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '3px', padding: '0 4px' }}>
                      {msg.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Form Bar */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '12px 16px',
                background: 'white',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <button
                type="button"
                onClick={() => alert('Mở popup đề nghị trả giá (Offer) trực tiếp')}
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: '1px solid #CCFBF1',
                  borderRadius: 'var(--radius-md)',
                  height: '42px',
                  padding: '0 12px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0
                }}
              >
                <Tag size={14} />
                <span>Trả giá</span>
              </button>

              <input
                type="text"
                placeholder="Nhập tin nhắn cho người bán..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                style={{
                  flex: 1,
                  height: '42px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />

              <button
                type="submit"
                style={{
                  height: '42px',
                  padding: '0 18px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={15} />
                <span>Gửi</span>
              </button>
            </form>
          </>
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu nhắn tin.
          </div>
        )}
      </div>
    </div>
  );
}
