export const ORDER_STATUS_DETAILS = {
  PENDING_PAYMENT: {
    label: 'Chờ thanh toán',
    color: '#D97706',
    bg: '#FEF3C7',
    desc: 'Đơn hàng đang chờ người mua chuyển tiền vào ví bảo chứng Escrow.'
  },
  PAID_HELD: {
    label: 'Tiền đã vào Escrow',
    color: '#0D9488',
    bg: '#CCFBF1',
    desc: 'Tiền đã được giữ an toàn tại Escrow. Người bán đang chuẩn bị đóng gói hàng.'
  },
  SHIPPED: {
    label: 'Đang vận chuyển',
    color: '#2563EB',
    bg: '#DBEAFE',
    desc: 'Kiện hàng đã được bàn giao cho đơn vị vận chuyển và đang trên đường giao.'
  },
  DELIVERED: {
    label: 'Đã nhận & Chờ kiểm tra (48h)',
    color: '#7C3AED',
    bg: '#EDE9FE',
    desc: 'Kiện hàng đã giao thành công. Bạn có 48 giờ để đồng kiểm và test tính năng.'
  },
  COMPLETED: {
    label: 'Giao dịch hoàn tất',
    color: '#16A34A',
    bg: '#DCFCE7',
    desc: 'Người mua đã xác nhận hài lòng. Tiền đã được giải ngân thành công cho người bán.'
  },
  DISPUTED: {
    label: 'Đang khiếu nại (Đóng băng tiền)',
    color: '#DC2626',
    bg: '#FEE2E2',
    desc: 'Có tranh chấp phát sinh. Khoản tiền Escrow đang được đóng băng để bộ phận hỗ trợ xử lý.'
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    color: '#475569',
    bg: '#F1F5F9',
    desc: 'Đơn hàng đã được hủy và 100% tiền đã được hoàn trả lại cho người mua.'
  }
};

export const MOCK_ORDERS_FULL = [
  {
    id: 'ORD-8829-VN',
    orderCode: 'ORD-8829-VN',
    status: 'PAID_HELD',
    createdAt: '10:20 - 20/10/2026',
    product: {
      id: 'prod_101',
      title: 'iPhone 14 Pro Max 128GB Tím Deep Purple',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      price: 17800000,
      originalPrice: 29990000,
      conditionLabel: 'Rất tốt (95%)'
    },
    seller: {
      id: 'seller_101',
      name: 'Hoàng Nam Tech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '0988 123 456',
      rating: 4.9
    },
    shipping: {
      method: 'Đơn vị vận chuyển (GHTK)',
      carrier: 'Giao Hàng Tiết Kiệm',
      trackingCode: 'GHTK-892401-HCM',
      shippingFee: 35000,
      receiverName: 'Nguyễn Xuân Sơn',
      receiverPhone: '0988 888 287',
      address: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP.HCM',
      notes: 'Gọi trước khi giao hàng 15 phút, bọc chống sốc kỹ.'
    },
    payment: {
      gateway: 'PayOS (VietQR Sandbox)',
      subtotal: 17800000,
      shippingFee: 35000,
      escrowInsuranceFee: 0,
      totalAmount: 17835000
    },
    countdownSeconds: null,
    timeline: [
      { step: 1, key: 'PENDING_PAYMENT', title: 'Đã tạo đơn', time: '10:15 - 20/10/2026', completed: true },
      { step: 2, key: 'PAID_HELD', title: 'Tiền đã vào Escrow', time: '10:20 - 20/10/2026', completed: true, current: true },
      { step: 3, key: 'SHIPPED', title: 'Người bán gửi hàng', time: 'Dự kiến hôm nay', completed: false },
      { step: 4, key: 'DELIVERED', title: 'Giao hàng & 48h kiểm tra', time: 'Dự kiến 21/10/2026', completed: false },
      { step: 5, key: 'COMPLETED', title: 'Giải ngân & Hoàn tất', time: 'Sau khi xác nhận', completed: false }
    ]
  },
  {
    id: 'ORD-6541-VN',
    orderCode: 'ORD-6541-VN',
    status: 'DELIVERED',
    createdAt: '14:30 - 18/10/2026',
    product: {
      id: 'prod_103',
      title: 'Tai nghe Sony WH-1000XM5 Chống Ồn Màu Đen Fullbox',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      price: 5200000,
      originalPrice: 8490000,
      conditionLabel: 'Như mới (99%)'
    },
    seller: {
      id: 'seller_102',
      name: 'Minh Thư Vintage',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      phone: '0912 345 678',
      rating: 5.0
    },
    shipping: {
      method: 'Đơn vị vận chuyển (Viettel Post)',
      carrier: 'Viettel Post',
      trackingCode: 'VTP-7729182',
      shippingFee: 30000,
      receiverName: 'Nguyễn Xuân Sơn',
      receiverPhone: '0988 888 287',
      address: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP.HCM',
      notes: 'Kiện hàng đã giao thành công.'
    },
    payment: {
      gateway: 'MoMo E-Wallet',
      subtotal: 5200000,
      shippingFee: 30000,
      escrowInsuranceFee: 0,
      totalAmount: 5230000
    },
    countdownSeconds: 36 * 3600 + 42 * 60 + 15, // 36h 42m
    timeline: [
      { step: 1, key: 'PENDING_PAYMENT', title: 'Đã tạo đơn', time: '14:30 - 18/10/2026', completed: true },
      { step: 2, key: 'PAID_HELD', title: 'Tiền đã vào Escrow', time: '14:32 - 18/10/2026', completed: true },
      { step: 3, key: 'SHIPPED', title: 'Người bán gửi hàng', time: '09:15 - 19/10/2026', completed: true },
      { step: 4, key: 'DELIVERED', title: 'Đã nhận hàng (Đang trong 48h kiểm hàng)', time: '11:20 - 20/10/2026', completed: true, current: true },
      { step: 5, key: 'COMPLETED', title: 'Giải ngân & Hoàn tất', time: 'Chờ hết 48h hoặc bấm xác nhận', completed: false }
    ]
  },
  {
    id: 'ORD-7712-VN',
    orderCode: 'ORD-7712-VN',
    status: 'SHIPPED',
    createdAt: '08:45 - 19/10/2026',
    product: {
      id: 'prod_106',
      title: 'Bàn phím cơ Keychron Q1 Pro RGB Wireless Knob',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      price: 2900000,
      originalPrice: 4200000,
      conditionLabel: 'Rất tốt (95%)'
    },
    seller: {
      id: 'seller_104',
      name: 'Gia Huy Custom Key',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '0977 444 999',
      rating: 4.8
    },
    shipping: {
      method: 'Đơn vị vận chuyển (GHTK)',
      carrier: 'Giao Hàng Tiết Kiệm',
      trackingCode: 'GHTK-99210-VN',
      shippingFee: 35000,
      receiverName: 'Nguyễn Xuân Sơn',
      receiverPhone: '0988 888 287',
      address: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP.HCM'
    },
    payment: {
      gateway: 'VNPay-QR',
      subtotal: 2900000,
      shippingFee: 35000,
      escrowInsuranceFee: 0,
      totalAmount: 2935000
    },
    countdownSeconds: null,
    timeline: [
      { step: 1, key: 'PENDING_PAYMENT', title: 'Đã tạo đơn', time: '08:45 - 19/10/2026', completed: true },
      { step: 2, key: 'PAID_HELD', title: 'Tiền đã vào Escrow', time: '08:50 - 19/10/2026', completed: true },
      { step: 3, key: 'SHIPPED', title: 'Đang vận chuyển (GHTK)', time: '15:20 - 19/10/2026', completed: true, current: true },
      { step: 4, key: 'DELIVERED', title: 'Giao hàng & 48h kiểm tra', time: 'Dự kiến hôm nay', completed: false },
      { step: 5, key: 'COMPLETED', title: 'Giải ngân & Hoàn tất', time: 'Sau khi nhận hàng', completed: false }
    ]
  },
  {
    id: 'ORD-5120-VN',
    orderCode: 'ORD-5120-VN',
    status: 'COMPLETED',
    createdAt: '11:00 - 12/10/2026',
    product: {
      id: 'prod_102',
      title: 'MacBook Air M2 16GB / 256GB Midnight 99%',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      price: 21500000,
      originalPrice: 28990000,
      conditionLabel: 'Như mới (99%)'
    },
    seller: {
      id: 'seller_103',
      name: 'Quốc Đạt Camera & Tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '0903 888 777',
      rating: 5.0
    },
    shipping: {
      method: 'Hẹn gặp trực tiếp',
      carrier: 'Gặp mặt đối soát',
      trackingCode: 'DIRECT-HANDOVER',
      shippingFee: 0,
      receiverName: 'Nguyễn Xuân Sơn',
      receiverPhone: '0988 888 287',
      address: 'Quán Highlands Coffee, Landmark 81'
    },
    payment: {
      gateway: 'PayOS (VietQR)',
      subtotal: 21500000,
      shippingFee: 0,
      escrowInsuranceFee: 0,
      totalAmount: 21500000
    },
    countdownSeconds: null,
    timeline: [
      { step: 1, key: 'PENDING_PAYMENT', title: 'Đã tạo đơn', time: '11:00 - 12/10/2026', completed: true },
      { step: 2, key: 'PAID_HELD', title: 'Tiền đã vào Escrow', time: '11:02 - 12/10/2026', completed: true },
      { step: 3, key: 'SHIPPED', title: 'Gặp mặt bàn giao', time: '14:30 - 12/10/2026', completed: true },
      { step: 4, key: 'DELIVERED', title: 'Kiểm tra máy trực tiếp', time: '14:45 - 12/10/2026', completed: true },
      { step: 5, key: 'COMPLETED', title: 'Đã giải ngân cho người bán', time: '15:00 - 12/10/2026', completed: true, current: true }
    ]
  }
];
