// Mock data for Make Offer Screen & Market Benchmarks
export const MAKE_OFFER_BENCHMARK = {
  productId: 'prod-ip14prm',
  title: 'iPhone 14 Pro Max 128GB Tím Deep Purple VN/A',
  category: 'Điện thoại / iPhone',
  condition: 'Như mới 99%',
  originalPrice: 20500000,
  listingPrice: 17800000,
  minAcceptableEstimate: 16500000, // Ước tính giá sàn
  marketAveragePrice: 17500000,
  seller: {
    name: 'Nguyễn Văn Minh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 4.9,
    responseRate: 99,
    responseTime: 'trong 5 phút'
  },
  images: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80'
  ],
  quickDiscounts: [
    { percent: 5, label: '-5% (Dễ chốt)' },
    { percent: 8, label: '-8% (Hợp lý)' },
    { percent: 10, label: '-10% (Cân nhắc)' },
    { percent: 15, label: '-15% (Khó hơn)' }
  ],
  quickMessages: [
    'Mình ở gần có thể qua test máy và lấy ngay trong ngày.',
    'Chốt giá này mình thanh toán khóa tiền vào ví Escrow luôn nhé.',
    'Học sinh sinh viên thiện chí mua dùng, bạn bớt chút lộc nhé!',
    'Máy fullbox nguyên zin đúng mô tả không bạn?'
  ]
};
