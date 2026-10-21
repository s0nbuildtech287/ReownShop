export const MOCK_CHATS = [
  {
    id: 'chat_1',
    sellerId: 'seller_101',
    sellerName: 'Hoàng Nam Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastMessage: 'Dạ máy còn nguyên hộp anh nhé. Anh bấm Thanh toán ngay qua Escrow là em ship trong 2 tiếng.',
    lastTime: '10:28',
    unreadCount: 1,
    hasOffer: true,
    offerAmount: 17200000,
    offerStatus: 'ACCEPTED',
    product: {
      id: 'prod_101',
      title: 'iPhone 14 Pro Max 128GB Tím Deep Purple',
      price: 17800000,
      originalPrice: 29990000,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      conditionLabel: 'Rất tốt (95%)',
      condition: 'EXCELLENT',
      status: 'AVAILABLE'
    }
  },
  {
    id: 'chat_2',
    sellerId: 'seller_103',
    sellerName: 'Quốc Đạt Camera',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isOnline: false,
    lastMessage: 'Đơn hàng của anh đã được đóng gói và bàn giao cho ĐVVC GHTK!',
    lastTime: 'Hôm qua',
    unreadCount: 0,
    hasOffer: false,
    product: {
      id: 'prod_104',
      title: 'Sony Alpha A7 Mark III Body (12k shot)',
      price: 24500000,
      originalPrice: 32000000,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      conditionLabel: 'Rất tốt (95%)',
      condition: 'EXCELLENT',
      status: 'SHIPPED'
    }
  },
  {
    id: 'chat_3',
    sellerId: 'seller_102',
    sellerName: 'Minh Thư Vintage',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastMessage: 'Anh trả giá 4.500.000₫ em thấy hơi thấp, em trả lại giá 4.700.000₫ anh xem nhé.',
    lastTime: 'Thứ 2',
    unreadCount: 0,
    hasOffer: true,
    offerAmount: 4700000,
    offerStatus: 'COUNTERED',
    product: {
      id: 'prod_105',
      title: 'Apple Watch Series 8 45mm GPS Nhôm Đen',
      price: 4900000,
      originalPrice: 8900000,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      conditionLabel: 'Rất tốt (95%)',
      condition: 'EXCELLENT',
      status: 'AVAILABLE'
    }
  }
];

export const INITIAL_CHAT_MESSAGES = {
  chat_1: [
    {
      id: 'm1_1',
      sender: 'seller',
      type: 'text',
      text: 'Chào bạn! Mình là Nam bên Hoàng Nam Tech, chiếc iPhone 14 Pro Max Tím vẫn còn sẵn nhé.',
      time: '10:15',
      status: 'read'
    },
    {
      id: 'm1_2',
      sender: 'buyer',
      type: 'text',
      text: 'Chào anh Nam! Máy pin còn bao nhiêu % và có vết cấn móp nào không anh?',
      time: '10:18',
      status: 'read'
    },
    {
      id: 'm1_3',
      sender: 'seller',
      type: 'text',
      text: 'Dạ pin còn 89%, viền phẩy lông mèo siêu nhẹ nhìn nghiêng mới thấy, màn zin chưa ép kính bao test 48h thoải mái qua Escrow Reown anh nhé.',
      time: '10:20',
      status: 'read'
    },
    {
      id: 'm1_4',
      sender: 'buyer',
      type: 'offer',
      offerAmount: 17200000,
      originalPrice: 17800000,
      offerStatus: 'ACCEPTED',
      note: 'Anh bớt cho em 600k lấy lộc em chốt mua luôn hôm nay ạ!',
      time: '10:22',
      status: 'read'
    },
    {
      id: 'm1_5',
      sender: 'seller',
      type: 'text',
      text: 'Dạ ok anh, em đã chấp nhận mức giá 17.200.000₫! Anh bấm nút "Thanh toán ngay" để hệ thống giữ tiền Escrow là em đóng gói ship liền.',
      time: '10:25',
      status: 'read'
    },
    {
      id: 'm1_6',
      sender: 'seller',
      type: 'text',
      text: 'Nếu tiện anh chuyển khoản trước vào stk Vietcombank 0988123456 bên em bớt thêm 100k ship nha',
      time: '10:27',
      status: 'read'
      // This will trigger the suspicious bank transfer security warning!
    }
  ],
  chat_2: [
    {
      id: 'm2_1',
      sender: 'buyer',
      type: 'text',
      text: 'Shop cho mình hỏi máy Sony A7M3 sensor có điểm chết hay bụi bẩn gì không?',
      time: 'Hôm qua 14:10',
      status: 'read'
    },
    {
      id: 'm2_2',
      sender: 'seller',
      type: 'text',
      text: 'Dạ sensor sạch tinh tươm ạ, chụp test f/22 không một vết bụi. Shop tặng kèm thẻ nhớ 64GB Extreme Pro.',
      time: 'Hôm qua 14:15',
      status: 'read'
    },
    {
      id: 'm2_3',
      sender: 'system',
      type: 'order_status',
      orderCode: 'ORD-8829-VN',
      orderStatus: 'PAID_HELD',
      title: 'Đơn hàng đã được người mua thanh toán & tiền vào ví Escrow',
      subText: 'Người bán vui lòng đóng gói và bàn giao hàng cho bưu tá trước 18:00.',
      amount: 24535000,
      time: 'Hôm qua 15:30'
    },
    {
      id: 'm2_4',
      sender: 'system',
      type: 'order_status',
      orderCode: 'ORD-8829-VN',
      orderStatus: 'SHIPPED',
      title: 'Kiện hàng đã được gửi đi (Mã vận đơn: GHTK-892401)',
      subText: 'Dự kiến giao trong 1-2 ngày. Người mua có 48h kiểm tra hàng sau khi nhận.',
      amount: 24535000,
      time: 'Hôm qua 16:45'
    }
  ],
  chat_3: [
    {
      id: 'm3_1',
      sender: 'buyer',
      type: 'offer',
      offerAmount: 4500000,
      originalPrice: 4900000,
      offerStatus: 'COUNTERED',
      note: 'Em gửi đề nghị 4.500.000₫ nha chị Thư.',
      time: 'Thứ 2 09:12',
      status: 'read'
    },
    {
      id: 'm3_2',
      sender: 'seller',
      type: 'counter_offer',
      counterAmount: 4700000,
      originalPrice: 4900000,
      offerStatus: 'PENDING',
      note: 'Dạ đồng hồ còn bảo hành Apple 4 tháng và dây đeo thể thao nguyên seal, em để anh giá 4.700.000₫ là giá chót anh nhé.',
      time: 'Thứ 2 09:30',
      status: 'read'
    }
  ]
};

// Simulated automated replies from sellers
export const AUTO_REPLIES = [
  'Dạ mình đã nhận được tin nhắn! Máy vẫn còn đầy đủ phụ kiện zin theo hộp bạn nhé.',
  'Bạn có thể đặt hàng giữ tiền qua Escrow Reown, mình sẽ hỗ trợ bọc chống sốc kỹ càng và gửi ngay.',
  'Nếu bạn ở gần có thể hẹn gặp trực tiếp kiểm tra máy kỹ càng rồi mới bấm giải ngân tiền trên app nha.',
  'Dạ mức giá này mình đã cân nhắc rất kỹ theo độ đẹp của máy rồi ạ, bảo hành trách nhiệm 7 ngày lỗi hoàn tiền 100%.'
];
