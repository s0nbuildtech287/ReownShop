export const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: 'Sparkles' },
  { id: 'phones', name: 'Điện thoại', icon: 'Smartphone' },
  { id: 'laptops', name: 'Laptop & Mac', icon: 'Laptop' },
  { id: 'audio', name: 'Tai nghe & Loa', icon: 'Headphones' },
  { id: 'cameras', name: 'Máy ảnh & Lens', icon: 'Camera' },
  { id: 'watches', name: 'Đồng hồ', icon: 'Watch' },
  { id: 'tablets', name: 'Máy tính bảng', icon: 'Tablet' },
  { id: 'gaming', name: 'Console & Game', icon: 'Gamepad2' },
  { id: 'accessories', name: 'Phụ kiện', icon: 'Cable' }
];

export const CONDITION_OPTIONS = [
  { id: 'ALL', label: 'Tất cả tình trạng' },
  { id: 'LIKE_NEW', label: 'Like New (99%)', color: '#16A34A', bg: '#DCFCE7' },
  { id: 'EXCELLENT', label: 'Rất tốt (95%)', color: '#0891B2', bg: '#CFFAFE' },
  { id: 'GOOD', label: 'Tốt (85-90%)', color: '#D97706', bg: '#FEF3C7' },
  { id: 'FAIR', label: 'Có trầy xước nhẹ', color: '#64748B', bg: '#F1F5F9' }
];

export const DISTANCE_OPTIONS = [
  { value: 0, label: 'Toàn quốc' },
  { value: 3, label: 'Dưới 3 km' },
  { value: 5, label: 'Dưới 5 km' },
  { value: 10, label: 'Dưới 10 km' },
  { value: 20, label: 'Dưới 20 km' }
];

export const PRICE_RANGES = [
  { min: 0, max: 0, label: 'Tất cả giá' },
  { min: 0, max: 2000000, label: 'Dưới 2 triệu' },
  { min: 2000000, max: 5000000, label: '2 - 5 triệu' },
  { min: 5000000, max: 15000000, label: '5 - 15 triệu' },
  { min: 15000000, max: 0, label: 'Trên 15 triệu' }
];
