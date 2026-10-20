export const MOCK_CHATS = [
  {
    id: 'chat_1',
    sellerId: 'seller_101',
    sellerName: 'Hoàng Nam Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastMessage: 'Dạ máy còn nguyên hộp anh nhé. Anh tạo đơn giữ tiền qua Escrow là em ship liền trong 2 tiếng.',
    lastTime: '10:28',
    unreadCount: 1,
    hasOffer: true,
    offerAmount: 17200000,
    offerStatus: 'ACCEPTED', // PENDING | ACCEPTED | REJECTED
    product: {
      id: 'prod_101',
      title: 'iPhone 14 Pro Max 128GB Tím Deep Purple',
      price: 17800000,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      conditionLabel: 'Rất tốt (95%)'
    }
  },
  {
    id: 'chat_2',
    sellerId: 'seller_103',
    sellerName: 'Quốc Đạt Camera',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isOnline: false,
    lastMessage: 'Máy A7M3 sensor sạch tinh không hạt bụi, em bao test 7 ngày qua Escrow cho anh yên tâm.',
    lastTime: 'Hôm qua',
    unreadCount: 0,
    hasOffer: false,
    product: {
      id: 'prod_104',
      title: 'Sony Alpha A7 Mark III Body (12k shot)',
      price: 24500000,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      conditionLabel: 'Rất tốt (95%)'
    }
  },
  {
    id: 'chat_3',
    sellerId: 'seller_102',
    sellerName: 'Minh Thư Vintage',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastMessage: 'Dạ em vừa gửi thêm ảnh dây đeo Apple Watch qua tin nhắn rồi ạ.',
    lastTime: 'Thứ 2',
    unreadCount: 0,
    hasOffer: true,
    offerAmount: 4700000,
    offerStatus: 'PENDING',
    product: {
      id: 'prod_105',
      title: 'Apple Watch Series 8 45mm GPS Nhôm Đen',
      price: 4900000,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      conditionLabel: 'Rất tốt (95%)'
    }
  }
];
