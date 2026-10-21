// Mock data for Public Seller Profile
export const PUBLIC_SELLER_PROFILE = {
  id: 'seller-minh-nguyen',
  name: 'Nguyễn Văn Minh',
  username: '@minhnguyen_tech',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  coverPhoto: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  joinedDate: 'Tháng 3, 2024 (2 năm gắn bó)',
  location: 'Quận 1, TP. Hồ Chí Minh',
  bio: 'Chuyên đồ Apple, Sony, ThinkPad lướt chính hãng. Đam mê công nghệ, mô tả máy chuẩn 100% từng vết xước, hỗ trợ giao dịch qua Reown Escrow bảo đảm đôi bên.',
  isVerifiedCCCD: true,
  isTopRatedSeller: true,
  
  // Chỉ số uy tín & phản hồi
  metrics: {
    trustScore: 98, // Điểm uy tín / 100
    ratingAverage: 4.9,
    totalReviews: 148,
    responseRate: 99, // % phản hồi
    responseTimeText: 'Trong vòng 5 phút',
    successOrdersCount: 215, // Đã giao dịch qua Escrow
    disputeRate: 0.4, // % khiếu nại (cực thấp)
    followersCount: 1420
  },

  // Phân bố số sao đánh giá
  ratingDistribution: [
    { stars: 5, count: 130, percent: 88 },
    { stars: 4, count: 14, percent: 10 },
    { stars: 3, count: 4, percent: 2 },
    { stars: 2, count: 0, percent: 0 },
    { stars: 1, count: 0, percent: 0 }
  ],

  // Danh sách sản phẩm đang bán
  activeListings: [
    {
      id: 'prod-ip14prm',
      title: 'iPhone 14 Pro Max 128GB Tím Deep Purple VN/A',
      price: 17800000,
      originalPrice: 20500000,
      condition: 'Như mới 99%',
      category: 'Điện thoại',
      location: 'Quận 1, TP.HCM',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      views: 342,
      likes: 28,
      postedDaysAgo: '2 ngày trước'
    },
    {
      id: 'prod-sony-xm5',
      title: 'Tai nghe Sony WH-1000XM5 Chống Ồn Màu Đen (Fullbox)',
      price: 4850000,
      originalPrice: 6200000,
      condition: 'Rất tốt (98%)',
      category: 'Âm thanh',
      location: 'Quận 1, TP.HCM',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
      views: 210,
      likes: 19,
      postedDaysAgo: '3 ngày trước'
    },
    {
      id: 'prod-mac-m2',
      title: 'MacBook Air M2 16GB / 256GB Midnight (Pin 96%)',
      price: 19200000,
      originalPrice: 24000000,
      condition: 'Như mới 99%',
      category: 'Laptop',
      location: 'Quận 1, TP.HCM',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      views: 520,
      likes: 45,
      postedDaysAgo: 'Hôm qua'
    },
    {
      id: 'prod-aw-s8',
      title: 'Apple Watch Series 8 45mm Midnight Nhôm GPS',
      price: 5200000,
      originalPrice: 6800000,
      condition: 'Tốt (95%)',
      category: 'Đồng hồ thông minh',
      location: 'Quận 1, TP.HCM',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      views: 180,
      likes: 14,
      postedDaysAgo: '5 ngày trước'
    }
  ],

  // Danh sách sản phẩm đã bán thành công
  soldListings: [
    {
      id: 'sold-1',
      title: 'Bàn phím cơ Keychron Q1 Pro Wireless Carbon',
      soldPrice: 3200000,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
      soldDate: '18/10/2026',
      buyerName: 'Trần Long'
    },
    {
      id: 'sold-2',
      title: 'iPad Pro 11 inch M1 128GB Wifi Space Gray',
      soldPrice: 14200000,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      soldDate: '10/10/2026',
      buyerName: 'Lê Thùy Dung'
    },
    {
      id: 'sold-3',
      title: 'Chuột Logitech MX Master 3S Graphite',
      soldPrice: 1350000,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
      soldDate: '02/10/2026',
      buyerName: 'Hoàng Anh'
    }
  ],

  // Danh sách đánh giá từ người mua thực tế
  reviews: [
    {
      id: 'rev-1',
      buyer: {
        name: 'Lê Hoàng Long',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
      },
      stars: 5,
      createdAt: '20/10/2026',
      productBought: 'MacBook Air M2 16GB 256GB Silver',
      isEscrowVerified: true,
      comment: 'Anh Minh đóng gói cực kỳ cẩn thận, có quay clip test máy đầy đủ trước khi gửi. Máy đẹp đúng như mô tả, pin còn 98%, qua 48h kiểm hàng của Escrow rất yên tâm. 10/10 sẽ ủng hộ tiếp!',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'rev-2',
      buyer: {
        name: 'Đặng Mai Phương',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
      },
      stars: 5,
      createdAt: '15/10/2026',
      productBought: 'Tai nghe Sony WH-1000XM4',
      isEscrowVerified: true,
      comment: 'Shop tư vấn siêu nhiệt tình, phản hồi chỉ sau 2 phút. Tai nghe chống ồn đỉnh cao, đệm tai còn mới tinh. Mua hàng chợ 2hand có Escrow giữ tiền thế này an tâm thật sự.',
      images: []
    },
    {
      id: 'rev-3',
      buyer: {
        name: 'Phạm Quốc Bảo',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
      },
      stars: 5,
      createdAt: '08/10/2026',
      productBought: 'Apple Watch Series 7 45mm',
      isEscrowVerified: true,
      comment: 'Hàng chuẩn chỉ, giao dịch nhanh chóng. Người bán uy tín nhất từng gặp trên các sàn 2hand.',
      images: []
    },
    {
      id: 'rev-4',
      buyer: {
        name: 'Vũ Thanh Hằng',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80'
      },
      stars: 4,
      createdAt: '28/09/2026',
      productBought: 'Bàn phím cơ Keychron K2 V2',
      isEscrowVerified: true,
      comment: 'Bàn phím gõ rất mượt, chỉ tiếc là hộp giấy bên ngoài hơi cấn góc do đơn vị vận chuyển. Người bán hỗ trợ giải đáp rất chu đáo.',
      images: []
    }
  ]
};
