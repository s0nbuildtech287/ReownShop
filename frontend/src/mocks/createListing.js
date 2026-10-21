export const CONDITION_DETAILS_GUIDE = [
  {
    id: 'LIKE_NEW',
    title: 'Như mới (99%)',
    tag: 'Like New',
    color: '#16A34A',
    bg: '#DCFCE7',
    description: 'Hàng gần như chưa sử dụng, ngoại hình hoàn hảo không tỳ vết, pin còn rất cao hoặc 100%, đầy đủ hộp/phụ kiện zin.'
  },
  {
    id: 'EXCELLENT',
    title: 'Rất tốt (95%)',
    tag: 'Rất tốt',
    color: '#0891B2',
    bg: '#CFFAFE',
    description: 'Chỉ có xước lông mèo siêu nhẹ nhìn kỹ mới thấy, không cấn móp, mọi chức năng hoạt động hoàn hảo, chưa từng bung sửa.'
  },
  {
    id: 'GOOD',
    title: 'Tốt (85% - 90%)',
    tag: 'Tốt',
    color: '#D97706',
    bg: '#FEF3C7',
    description: 'Đã qua sử dụng một thời gian, có xước viền hoặc nắp lưng nhẹ, màn hình đẹp, phần cứng nguyên bản chưa sửa chữa lớn.'
  },
  {
    id: 'FAIR',
    title: 'Trầy xước nhẹ (80%)',
    tag: 'Trầy xước',
    color: '#64748B',
    bg: '#F1F5F9',
    description: 'Có vết cấn góc hoặc xước dăm rõ ràng, không ảnh hưởng đến màn hình hiển thị và hiệu năng hoạt động của máy.'
  }
];

export const MOCK_AI_SUGGESTIONS = [
  {
    triggerKeywords: ['iphone', 'apple', 'dien thoai'],
    suggestedTitle: 'iPhone 14 Pro Max 128GB Tím Deep Purple Bản VN/A',
    suggestedCategory: 'phones',
    suggestedCondition: 'EXCELLENT',
    suggestedPrice: 17500000,
    priceBenchmark: { min: 16800000, max: 18500000, avg: 17400000 },
    suggestedDescription: 'Máy chính chủ mua đập hộp tại CellphoneS, zin nguyên bản 100% chưa từng tháo mở sửa chữa. Pin còn 88%, viền bóng đẹp có xước lông mèo nhẹ không đáng kể. Tặng kèm củ sạc nhanh 20W và 3 ốp lưng cao cấp. Giao dịch qua Escrow Reown để hai bên đều yên tâm kiểm hàng 48 giờ.',
    tags: ['iPhone', 'Apple', '14 Pro Max', 'VN/A']
  },
  {
    triggerKeywords: ['macbook', 'laptop', 'mac'],
    suggestedTitle: 'MacBook Air M2 16GB / 256GB Màu Midnight Đẹp 99%',
    suggestedCategory: 'laptops',
    suggestedCondition: 'LIKE_NEW',
    suggestedPrice: 21800000,
    priceBenchmark: { min: 20500000, max: 22900000, avg: 21500000 },
    suggestedDescription: 'Bản 16GB RAM đa nhiệm mượt mà phục vụ code và đồ hoạ. Ngoại hình như mới vì dán full JCPAL từ ngày đầu. Sạc 35 lần, pin 99%. Đầy đủ củ sạc Magsafe zin và hộp zin trùng serial.',
    tags: ['MacBook Air', 'M2', 'Apple', 'Laptop']
  },
  {
    triggerKeywords: ['sony', 'tai nghe', 'audio', 'wh-1000xm5'],
    suggestedTitle: 'Tai nghe Sony WH-1000XM5 Chống Ồn Màu Đen Fullbox',
    suggestedCategory: 'audio',
    suggestedCondition: 'LIKE_NEW',
    suggestedPrice: 6200000,
    priceBenchmark: { min: 5800000, max: 6600000, avg: 6200000 },
    suggestedDescription: 'Tai nghe mua chính hãng Sony VN, đeo rất ít chủ yếu làm việc văn phòng máy lạnh. Đệm da còn nguyên vẹn êm ái, chống ồn đỉnh cao, pin nghe liên tục trên 30 tiếng. Đủ túi đựng, cáp sạc, jack 3.5mm.',
    tags: ['Sony', 'WH-1000XM5', 'Chống ồn', 'Tai nghe']
  }
];

export const PHOTO_TIPS = [
  {
    icon: 'Sun',
    title: 'Đủ ánh sáng tự nhiên',
    desc: 'Chụp gần cửa sổ hoặc đèn sáng rõ, tránh ngược sáng để khách thấy trung thực màu sắc.'
  },
  {
    icon: 'Maximize',
    title: 'Đa góc chụp (4 mặt + màn hình)',
    desc: 'Chụp mặt trước, mặt lưng, các cạnh viền, cổng kết nối và bật sáng màn hình để khách xem.'
  },
  {
    icon: 'AlertTriangle',
    title: 'Chụp cận cảnh khuyết điểm (nếu có)',
    desc: 'Minh bạch vết xước nhỏ giúp tạo uy tín cao và tránh bị từ chối/khiếu nại khi đối soát Escrow.'
  },
  {
    icon: 'ShieldCheck',
    title: 'Chụp kèm phụ kiện hoặc hoá đơn',
    desc: 'Nếu có hộp, sạc zin hoặc hoá đơn mua hàng, hãy đặt cùng khung hình để tăng giá trị món đồ.'
  }
];

export const INITIAL_DRAFT_STATE = {
  images: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
  ],
  title: 'iPhone 14 Pro Max 128GB Tím Deep Purple VN/A',
  category: 'phones',
  condition: 'EXCELLENT',
  description: 'Máy chính chủ mua mới tại CellphoneS, ngoại hình đẹp 98%, pin 89%. Mọi tính năng FaceID, camera chụp nét căng hoạt động hoàn hảo. Đầy đủ phụ kiện cáp sạc nhanh. Đảm bảo giao dịch qua Escrow Reown, bao test 48h thoải mái.',
  location: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
  price: 17800000,
  allowOffer: true,
  minAcceptPrice: 16500000
};
