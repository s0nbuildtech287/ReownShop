/**
 * Currency and display formatters for ReownShop
 */
export function formatVND(amount) {
  if (typeof amount !== 'number') return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount).replace('VND', '₫');
}

export function formatDistance(distanceKm) {
  if (distanceKm === undefined || distanceKm === null) return '';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

export function getConditionStyle(conditionKey) {
  switch (conditionKey) {
    case 'LIKE_NEW':
      return { label: 'Like New (99%)', color: '#16A34A', bg: '#DCFCE7' };
    case 'EXCELLENT':
      return { label: 'Rất tốt (95%)', color: '#0891B2', bg: '#CFFAFE' };
    case 'GOOD':
      return { label: 'Tốt (85-90%)', color: '#D97706', bg: '#FEF3C7' };
    case 'FAIR':
      return { label: 'Trầy nhẹ', color: '#64748B', bg: '#F1F5F9' };
    default:
      return { label: 'Đã qua sử dụng', color: '#475569', bg: '#F1F5F9' };
  }
}
