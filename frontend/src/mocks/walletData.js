// Mock data for Reown Escrow Wallet & Ledger
export const WALLET_OVERVIEW = {
  availableBalance: 8450000, // Số dư khả dụng (có thể mua đồ hoặc rút về bank)
  heldInEscrowBalance: 17835000, // Tiền đang khóa an toàn tại Escrow
  totalInflowMonth: 54200000, // Tổng dòng tiền vào tháng này
  totalOutflowMonth: 21500000, // Tổng dòng tiền rút/chi tiêu tháng này
  bankAccounts: [
    {
      id: 'bank-1',
      bankName: 'Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)',
      shortName: 'VCB',
      accountNumber: '1018828787',
      accountHolder: 'NGUYEN XUAN SON',
      isDefault: true,
      logoColor: '#00602F'
    },
    {
      id: 'bank-2',
      bankName: 'Ngân hàng Quân Đội (MB Bank)',
      shortName: 'MB',
      accountNumber: '0988888287',
      accountHolder: 'NGUYEN XUAN SON',
      isDefault: false,
      logoColor: '#1B357F'
    },
    {
      id: 'bank-3',
      bankName: 'Ngân hàng Kỹ Thương (Techcombank)',
      shortName: 'TCB',
      accountNumber: '190382718910',
      accountHolder: 'NGUYEN XUAN SON',
      isDefault: false,
      logoColor: '#EB1C24'
    }
  ]
};

// Chi tiết các khoản đang tạm giữ tại Escrow (Breakdown of held balance)
export const HELD_ESCROW_ITEMS = [
  {
    id: 'ESC-HOLD-901',
    type: 'BUYER_HELD', // Tiền người mua đã thanh toán, giữ chờ nhận hàng kiểm tra 48h
    productTitle: 'iPhone 14 Pro Max 128GB Tím Deep Purple',
    orderCode: 'ORD-882910',
    amount: 17835000,
    statusText: 'Đang giữ 48h kiểm hàng',
    counterpart: 'Nguyễn Văn Minh (Người bán)',
    heldSince: '14:20 - 20/10/2026',
    autoReleaseIn: '36 giờ 45 phút',
    note: 'Tiền được khóa an toàn tại Escrow. Chỉ giải ngân khi bạn bấm "Xác nhận hàng chuẩn" hoặc sau 48h nhận hàng không khiếu nại.'
  },
  {
    id: 'ESC-HOLD-902',
    type: 'SELLER_PENDING', // Tiền bán hàng khách đã nộp, chờ người bán giao xong khách xác nhận
    productTitle: 'Tai nghe Sony WH-1000XM5 Chống Ồn',
    orderCode: 'ORD-882903',
    amount: 4850000,
    statusText: 'Khách đã thanh toán, chờ bạn giao',
    counterpart: 'Trần Bảo Ngọc (Người mua)',
    heldSince: '09:15 - 21/10/2026',
    autoReleaseIn: 'Chờ giao hàng & 48h kiểm tra',
    note: 'Khách đã thanh toán đủ vào ví Escrow. Bạn giao hàng yên tâm, không lo bom hàng.'
  }
];

// Lịch sử biến động số dư theo chuẩn Ledger Escrow: HOLD / RELEASE / REFUND / FEE / WITHDRAW / TOPUP
export const WALLET_TRANSACTIONS = [
  {
    id: 'TXN-9021',
    type: 'WITHDRAW',
    typeText: 'Rút tiền về ngân hàng',
    direction: 'OUT',
    amount: 5000000,
    fee: 0,
    netAmount: 5000000,
    balanceAfter: 8450000,
    bankInfo: 'Vietcombank •••• 8787',
    createdAt: '10:15 - 21/10/2026',
    status: 'COMPLETED',
    statusText: 'Thành công (Đã chuyển khoản)',
    refCode: 'VCB-FT262940192',
    description: 'Rút số dư ví về tài khoản Vietcombank chính chủ NGUYEN XUAN SON'
  },
  {
    id: 'TXN-9020',
    type: 'RELEASE',
    typeText: 'Giải ngân bán hàng Escrow',
    direction: 'IN',
    amount: 15500000,
    fee: 310000, // Phí bảo chứng Escrow 2%
    netAmount: 15190000,
    balanceAfter: 13450000,
    orderCode: 'ORD-882740',
    productTitle: 'MacBook Air M2 16GB 256GB Silver (Like New)',
    createdAt: '16:40 - 20/10/2026',
    status: 'COMPLETED',
    statusText: 'Đã giải ngân về ví',
    refCode: 'ESC-REL-77401',
    description: 'Người mua Lê Hoàng Long đã xác nhận máy chuẩn và hài lòng. Hệ thống tự động giải ngân tiền bán hàng.'
  },
  {
    id: 'TXN-9019',
    type: 'FEE',
    typeText: 'Phí bảo chứng giao dịch',
    direction: 'OUT',
    amount: 310000,
    fee: 0,
    netAmount: 310000,
    balanceAfter: 28260000,
    orderCode: 'ORD-882740',
    createdAt: '16:40 - 20/10/2026',
    status: 'COMPLETED',
    statusText: 'Đã trừ phí sàn',
    refCode: 'FEE-28274',
    description: 'Phí bảo vệ giao dịch và trọng tài Escrow (2% giá trị sản phẩm)'
  },
  {
    id: 'TXN-9018',
    type: 'HOLD',
    typeText: 'Khóa tiền mua hàng Escrow',
    direction: 'HOLD',
    amount: 17835000,
    fee: 0,
    netAmount: 17835000,
    balanceAfter: 8450000,
    orderCode: 'ORD-882910',
    productTitle: 'iPhone 14 Pro Max 128GB Tím Deep Purple',
    createdAt: '14:20 - 20/10/2026',
    status: 'HELD',
    statusText: 'Đang tạm giữ Escrow',
    refCode: 'ESC-HLD-88291',
    description: 'Tạm giữ an toàn tiền mua máy. Tiền chỉ chuyển cho người bán sau 48h kiểm hàng hoặc khi bạn ấn duyệt.'
  },
  {
    id: 'TXN-9017',
    type: 'REFUND',
    typeText: 'Hoàn tiền khiếu nại Escrow',
    direction: 'IN',
    amount: 3450000,
    fee: 0,
    netAmount: 3450000,
    balanceAfter: 26285000,
    orderCode: 'ORD-881920',
    productTitle: 'Bàn phím cơ Custom Keychron Q1 Pro',
    createdAt: '11:05 - 19/10/2026',
    status: 'COMPLETED',
    statusText: 'Đã hoàn 100% tiền',
    refCode: 'ESC-RFD-88192',
    description: 'Người bán gửi sai switch và không trùng mô tả. Trọng tài Reown Escrow phán quyết hoàn tiền 100% cho người mua.'
  },
  {
    id: 'TXN-9016',
    type: 'TOPUP',
    typeText: 'Nạp tiền vào ví',
    direction: 'IN',
    amount: 20000000,
    fee: 0,
    netAmount: 20000000,
    balanceAfter: 22835000,
    bankInfo: 'PayOS QR • VietinBank',
    createdAt: '14:00 - 20/10/2026',
    status: 'COMPLETED',
    statusText: 'Thành công',
    refCode: 'PAYOS-2849102',
    description: 'Nạp tiền tức thì qua quét mã QR VietQR / PayOS tự động 24/7'
  },
  {
    id: 'TXN-9015',
    type: 'WITHDRAW',
    typeText: 'Rút tiền về ngân hàng',
    direction: 'OUT',
    amount: 10000000,
    fee: 0,
    netAmount: 10000000,
    balanceAfter: 2835000,
    bankInfo: 'MB Bank •••• 8287',
    createdAt: '08:30 - 15/10/2026',
    status: 'COMPLETED',
    statusText: 'Thành công (Đã chuyển khoản)',
    refCode: 'MB-TRF-90291',
    description: 'Rút số dư ví về tài khoản MB Bank chính chủ NGUYEN XUAN SON'
  }
];
