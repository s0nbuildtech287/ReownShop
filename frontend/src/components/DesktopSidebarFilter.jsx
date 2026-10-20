import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Camera, 
  Watch, 
  Tablet, 
  Gamepad2, 
  Cable, 
  RotateCcw, 
  Check, 
  MapPin, 
  SlidersHorizontal 
} from 'lucide-react';
import { CATEGORIES } from '../mocks/categories';
import { formatVND } from '../utils/formatters';

const ICON_MAP = {
  Sparkles,
  Smartphone,
  Laptop,
  Headphones,
  Camera,
  Watch,
  Tablet,
  Gamepad2,
  Cable
};

export const DESKTOP_CONDITIONS = [
  { id: 'LIKE_NEW', label: 'Như mới (99%)', color: '#16A34A', bg: '#DCFCE7' },
  { id: 'EXCELLENT', label: 'Rất tốt (95%)', color: '#0891B2', bg: '#CFFAFE' },
  { id: 'GOOD', label: 'Tốt (85-90%)', color: '#D97706', bg: '#FEF3C7' },
  { id: 'FAIR', label: 'Có trầy xước', color: '#64748B', bg: '#F1F5F9' }
];

export default function DesktopSidebarFilter({
  activeCategory,
  onSelectCategory,
  categoryCounts = {},
  filters,
  onFilterChange,
  onResetFilters
}) {
  const handleConditionChange = (condId) => {
    const current = filters.conditions || [];
    const updated = current.includes(condId)
      ? current.filter((c) => c !== condId)
      : [...current, condId];
    onFilterChange({ ...filters, conditions: updated });
  };

  const handleMinPriceChange = (val) => {
    onFilterChange({ ...filters, minPrice: Number(val) || 0 });
  };

  const handleMaxPriceChange = (val) => {
    onFilterChange({ ...filters, maxPrice: Number(val) || 0 });
  };

  const handlePriceRangeSlider = (e) => {
    const val = Number(e.target.value);
    onFilterChange({ ...filters, maxPrice: val });
  };

  const handleDistanceSlider = (e) => {
    const val = Number(e.target.value);
    onFilterChange({ ...filters, maxDistance: val });
  };

  const hasActiveFilters = 
    activeCategory !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice > 0 ||
    (filters.conditions && filters.conditions.length > 0) ||
    filters.maxDistance > 0;

  return (
    <aside className="desktop-sidebar-filter">
      <div className="sidebar-filter-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={18} color="#0D9488" />
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
            Bộ lọc tìm kiếm
          </h2>
        </div>
        {hasActiveFilters && (
          <button 
            type="button" 
            className="sidebar-reset-btn-mini"
            onClick={onResetFilters}
            title="Xóa tất cả bộ lọc"
          >
            <RotateCcw size={13} />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      <div className="sidebar-filter-content hide-scrollbar">
        {/* KHỐI 1: DANH MỤC DẠNG DANH SÁCH DỌC KÈM SỐ LƯỢNG */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Danh mục sản phẩm</h3>
          <div className="sidebar-category-list">
            {CATEGORIES.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Sparkles;
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] ?? 0;

              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`sidebar-cat-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat.id)}
                >
                  <div className="sidebar-cat-left">
                    <IconComp size={16} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="sidebar-cat-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* KHỐI 2: KHOẢNG GIÁ */}
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <h3 className="sidebar-section-title">Khoảng giá</h3>
            {(filters.minPrice > 0 || filters.maxPrice > 0) && (
              <span className="sidebar-filter-highlight">
                {filters.maxPrice > 0 ? `< ${formatVND(filters.maxPrice)}` : 'Đã lọc'}
              </span>
            )}
          </div>

          <div className="sidebar-price-inputs">
            <div className="sidebar-input-box">
              <span className="sidebar-input-label">Từ</span>
              <input
                type="number"
                placeholder="0 ₫"
                value={filters.minPrice || ''}
                onChange={(e) => handleMinPriceChange(e.target.value)}
              />
            </div>
            <span style={{ color: '#94A3B8', fontWeight: 600 }}>–</span>
            <div className="sidebar-input-box">
              <span className="sidebar-input-label">Đến</span>
              <input
                type="number"
                placeholder="Tối đa"
                value={filters.maxPrice || ''}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
              />
            </div>
          </div>

          {/* Thanh kéo khoảng giá */}
          <div style={{ marginTop: '12px' }}>
            <input
              type="range"
              min="0"
              max="30000000"
              step="500000"
              value={filters.maxPrice || 30000000}
              onChange={handlePriceRangeSlider}
              className="sidebar-range-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>0 ₫</span>
              <span>15 triệu</span>
              <span>30 triệu+</span>
            </div>
          </div>
        </div>

        {/* KHỐI 3: TÌNH TRẠNG (CHECKBOX) */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Tình trạng máy</h3>
          <div className="sidebar-condition-list">
            {DESKTOP_CONDITIONS.map((cond) => {
              const isChecked = filters.conditions && filters.conditions.includes(cond.id);
              return (
                <label key={cond.id} className="sidebar-checkbox-row">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleConditionChange(cond.id)}
                  />
                  <span className="sidebar-custom-check">
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="sidebar-condition-dot" style={{ backgroundColor: cond.color }} />
                  <span className="sidebar-condition-text">{cond.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* KHỐI 4: KHOẢNG CÁCH (THANH KÉO 1 ĐẾN 50 KM) */}
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <h3 className="sidebar-section-title">Bán kính vị trí</h3>
            <span className="sidebar-filter-highlight">
              {filters.maxDistance > 0 ? `${filters.maxDistance} km` : 'Tất cả'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <MapPin size={15} color="#0369A1" />
            <span style={{ fontSize: '12.5px', color: 'var(--text-main)', fontWeight: 600 }}>
              {filters.maxDistance > 0 ? `Trong vòng ${filters.maxDistance} km` : 'Toàn quốc (không giới hạn)'}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={filters.maxDistance || 0}
            onChange={handleDistanceSlider}
            className="sidebar-range-slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Toàn quốc</span>
            <span>10 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* NÚT XÓA BỘ LỌC Ở CUỐI */}
        <div style={{ marginTop: '20px', paddingBottom: '16px' }}>
          <button
            type="button"
            className="sidebar-clear-all-btn"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
          >
            <RotateCcw size={15} />
            <span>Xóa bộ lọc</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
