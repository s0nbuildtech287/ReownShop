export const SELLER_METRICS = {
  monthlyRevenue: 48500000,
  monthlyRevenueGrowth: 18.2, // %
  activeListingsCount: 6,
  pendingOffersCount: 3,
  ordersToShipCount: 2,
  completedOrdersCount: 24,
  revenueChartDays: [
    { label: 'T2 (14/10)', revenue: 4500000, orders: 1 },
    { label: 'T3 (15/10)', revenue: 17800000, orders: 1 },
    { label: 'T4 (16/10)', revenue: 2900000, orders: 1 },
    { label: 'T5 (17/10)', revenue: 0, orders: 0 },
    { label: 'T6 (18/10)', revenue: 5200000, orders: 1 },
    { label: 'T7 (19/10)', revenue: 9900000, orders: 2 },
    { label: 'CN (20/10)', revenue: 8200000, orders: 1 }
  ],
  revenueChartWeeks: [
    { label: 'Tuần 1', revenue: 28500000, orders: 4 },
    { label: 'Tuần 2', revenue: 34200000, orders: 6 },
    { label: 'Tuần 3', revenue: 41800000, orders: 7 },
    { label: 'Tuần 4', revenue: 48500000, orders: 8 }
  ]
};

export const SELLER_LISTINGS = [
  {
    id: 'prod_101',
    title: 'iPhone 14 Pro Max 128GB Tím Deep Purple',
    price: 17800000,
    originalPrice: 29990000,
    category: 'Điện thoại',
    conditionLabel: 'Rất tốt (95%)',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    status: 'HELD', // AVAILABLE | HELD | SOLD | HIDDEN
    statusText: 'Đang giữ hàng (Đơn chờ gửi)',
    views: 420,
    likes: 38,
    postedDate: '20/10/2026'
  },
  {
    id: 'prod_102',
    title: 'MacBook Air M2 16GB / 256GB Midnight 99%',
    price: 21500000,
    originalPrice: 28990000,
    category: 'Laptop',
    conditionLabel: 'Như mới (99%)',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    status: 'SOLD',
    statusText: 'Đã bán thành công',
    views: 680,
    likes: 54,
    postedDate: '12/10/2026'
  },
  {
    id: 'prod_103',
    title: 'Tai nghe Sony WH-1000XM5 Chống Ồn Màu Đen',
    price: 5200000,
    originalPrice: 8490000,
    category: 'Tai nghe',
    conditionLabel: 'Như mới (99%)',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    status: 'AVAILABLE',
    statusText: 'Đang bán',
    views: 290,
    likes: 26,
    postedDate: '18/10/2026'
  },
  {
    id: 'prod_104',
    title: 'Sony Alpha A7 Mark III Body (12k shot sensor sạch)',
    price: 24500000,
    originalPrice: 32000000,
    category: 'Máy ảnh',
    conditionLabel: 'Rất tốt (95%)',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    status: 'AVAILABLE',
    statusText: 'Đang bán',
    views: 512,
    likes: 47,
    postedDate: '19/10/2026'
  },
  {
    id: 'prod_105',
    title: 'Apple Watch Series 8 45mm GPS Nhôm Đen',
    price: 4900000,
    originalPrice: 8900000,
    category: 'Đồng hồ',
    conditionLabel: 'Rất tốt (95%)',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    status: 'AVAILABLE',
    statusText: 'Đang bán',
    views: 180,
    likes: 19,
    postedDate: '19/10/2026'
  },
  {
    id: 'prod_106',
    title: 'Bàn phím cơ Keychron Q1 Pro RGB Wireless Knob',
    price: 2900000,
    originalPrice: 4200000,
    category: 'Phụ kiện',
    conditionLabel: 'Rất tốt (95%)',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    status: 'HIDDEN',
    statusText: 'Đang ẩn',
    views: 95,
    likes: 12,
    postedDate: '15/10/2026'
  }
];

export const SELLER_OFFERS = [
  {
    id: 'off_101',
    productId: 'prod_103',
    productTitle: 'Tai nghe Sony WH-1000XM5 Chống Ồn',
    productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format&fit=crop&q=80',
    originalPrice: 5200000,
    offerAmount: 4800000,
    discountPercent: 8,
    buyer: {
      name: 'Trần Văn Mạnh',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating: 4.8
    },
    message: 'Mình ở Bình Thạnh qua lấy trực tiếp luôn trong chiều nay được không shop?',
    expiresIn: 'Còn 4 giờ 20 phút',
    status: 'PENDING'
  },
  {
    id: 'off_102',
    productId: 'prod_105',
    productTitle: 'Apple Watch Series 8 45mm GPS',
    productImage: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&auto=format&fit=crop&q=80',
    originalPrice: 4900000,
    offerAmount: 4500000,
    discountPercent: 8,
    buyer: {
      name: 'Lê Thuỳ Linh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      rating: 5.0
    },
    message: 'Bớt cho em 400k tiền ship em cọc giữ tiền Escrow luôn ạ!',
    expiresIn: 'Còn 11 giờ 45 phút',
    status: 'PENDING'
  },
  {
    id: 'off_103',
    productId: 'prod_104',
    productTitle: 'Sony Alpha A7 Mark III Body',
    productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80',
    originalPrice: 24500000,
    offerAmount: 23000000,
    discountPercent: 6,
    buyer: {
      name: 'Phạm Đức Huy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.9
    },
    message: 'Em lấy body không kèm thẻ nhớ 23tr chốt nhé anh.',
    expiresIn: 'Còn 1 ngày',
    status: 'PENDING'
  }
];

export const SELLER_SALES_ORDERS = [
  {
    id: 'ORD-8829-VN',
    productTitle: 'iPhone 14 Pro Max 128GB Tím Deep Purple',
    productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80',
    totalPrice: 17835000,
    netPayout: 17800000,
    status: 'PAID_HELD',
    statusText: 'Chờ gửi hàng (Tiền đã vào Escrow)',
    carrier: 'Giao Hàng Tiết Kiệm',
    buyer: {
      name: 'Nguyễn Xuân Sơn',
      phone: '0988 888 287',
      address: 'Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM'
    },
    paidAt: '10:20 - 20/10/2026',
    mustShipBefore: '18:00 - 21/10/2026'
  },
  {
    id: 'ORD-7712-VN',
    productTitle: 'Bàn phím cơ Keychron Q1 Pro RGB Wireless Knob',
    productImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80',
    totalPrice: 2935000,
    netPayout: 2900000,
    status: 'SHIPPED',
    statusText: 'Đã gửi bưu cục (Đang giao)',
    carrier: 'Giao Hàng Tiết Kiệm',
    trackingCode: 'GHTK-99210-VN',
    buyer: {
      name: 'Nguyễn Xuân Sơn',
      phone: '0988 888 287',
      address: 'Landmark 81, Bình Thạnh, TP.HCM'
    },
    paidAt: '08:50 - 19/10/2026'
  },
  {
    id: 'ORD-4491-VN',
    productTitle: 'Apple Watch Series 7 45mm Xanh Midnight',
    productImage: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&auto=format&fit=crop&q=80',
    totalPrice: 4235000,
    netPayout: 4200000,
    status: 'DISPUTED',
    statusText: 'Đang khiếu nại (Khoản tiền bị giữ)',
    disputeReason: 'Người mua báo pin tụt nhanh hơn mô tả (dưới 80%).',
    buyer: {
      name: 'Đoàn Minh Khang',
      phone: '0933 111 222',
      address: 'Quận 7, TP.HCM'
    },
    paidAt: '16:00 - 16/10/2026'
  },
  {
    id: 'ORD-5120-VN',
    productTitle: 'MacBook Air M2 16GB / 256GB Midnight 99%',
    productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80',
    totalPrice: 21500000,
    netPayout: 21500000,
    status: 'COMPLETED',
    statusText: 'Đã hoàn tất & Giải ngân về ví',
    buyer: {
      name: 'Nguyễn Xuân Sơn',
      phone: '0988 888 287',
      address: 'Quán Highlands Coffee, Landmark 81'
    },
    paidAt: '11:00 - 12/10/2026'
  }
];
