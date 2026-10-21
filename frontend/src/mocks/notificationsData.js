export const MOCK_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    category: 'WALLET',
    title: 'Tiền Escrow đang được bảo chứng an toàn',
    content: 'Khoản thanh toán 17.800.000 ₫ cho đơn hàng REOWN-2025-8829 (iPhone 14 Pro Max) đã vào ví bảo chứng trung gian.',
    time: '5 phút trước',
    isRead: false,
    actionType: 'VIEW_WALLET',
    targetId: 'REOWN-2025-8829'
  },
  {
    id: 'NOTIF-02',
    category: 'OFFER',
    title: 'Có người mua gửi đề xuất trả giá mới',
    content: 'Người mua Trần Quốc Tuấn vừa gửi đề xuất mua 16.000.000 ₫ cho tin đăng iPhone 14 Pro Max của bạn.',
    time: '35 phút trước',
    isRead: false,
    actionType: 'VIEW_SELLER_OFFERS',
    targetId: 'OFFER-6699'
  },
  {
    id: 'NOTIF-03',
    category: 'ORDER',
    title: 'Đơn hàng đang trên đường giao đến bạn',
    content: 'Kiện hàng REOWN-2025-8829 đã rời bưu cục Viettel Post Hà Nội. Dự kiến phát thành công trong 24h tới.',
    time: '2 giờ trước',
    isRead: true,
    actionType: 'VIEW_ORDER',
    targetId: 'REOWN-2025-8829'
  },
  {
    id: 'NOTIF-04',
    category: 'WALLET',
    title: 'Giải ngân thành công 6.300.000 ₫ về số dư',
    content: 'Người mua đơn hàng REOWN-2025-8812 (Sony WH-1000XM5) đã xác nhận hài lòng. Tiền Escrow đã được chuyển sang Số dư khả dụng.',
    time: 'Hôm qua, 15:30',
    isRead: true,
    actionType: 'VIEW_WALLET',
    targetId: 'TXN-8812'
  },
  {
    id: 'NOTIF-05',
    category: 'PROMOTION',
    title: 'Tin đăng yêu thích của bạn vừa hạ giá!',
    content: 'Sản phẩm "MacBook Air M2 16GB" mà bạn thả tim vừa giảm giá từ 21.500.000 ₫ xuống 19.900.000 ₫ (-7%).',
    time: '2 ngày trước',
    isRead: true,
    actionType: 'VIEW_PRODUCT',
    targetId: 'PROD-MACBOOK-M2'
  }
];
