import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Check, MapPin } from 'lucide-react';
import { CONDITION_OPTIONS, DISTANCE_OPTIONS, PRICE_RANGES } from '../mocks/categories';
import { formatVND } from '../utils/formatters';

export default function BottomSheetFilter({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  totalMatchingCount
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync when bottom sheet opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const handlePricePresetSelect = (preset) => {
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: preset.min,
      maxPrice: preset.max
    }));
  };

  const handleConditionToggle = (conditionId) => {
    setLocalFilters((prev) => {
      if (conditionId === 'ALL') {
        return { ...prev, conditions: [] };
      }
      const exists = prev.conditions.includes(conditionId);
      const updated = exists
        ? prev.conditions.filter((c) => c !== conditionId)
        : [...prev.conditions, conditionId];
      return { ...prev, conditions: updated };
    });
  };

  const handleDistanceSelect = (distVal) => {
    setLocalFilters((prev) => ({
      ...prev,
      maxDistance: distVal
    }));
  };

  const handleReset = () => {
    setLocalFilters({
      minPrice: 0,
      maxPrice: 0,
      conditions: [],
      maxDistance: 0
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className="bottomsheet-overlay" onClick={onClose}>
      <div 
        className="bottomsheet-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bottomsheet-drag-handle" />

        <div className="bottomsheet-header">
          <h2 className="bottomsheet-title">Bộ lọc tìm kiếm</h2>
          <button 
            type="button" 
            className="bottomsheet-close-btn"
            onClick={onClose}
            aria-label="Đóng bộ lọc"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bottomsheet-body hide-scrollbar">
          {/* Lọc theo khoảng giá */}
          <div className="filter-group">
            <div className="filter-group-title">
              <span>Khoảng giá</span>
              {(localFilters.minPrice > 0 || localFilters.maxPrice > 0) && (
                <span className="filter-group-value-text">
                  {localFilters.minPrice > 0 ? formatVND(localFilters.minPrice) : '0 ₫'}
                  {' - '}
                  {localFilters.maxPrice > 0 ? formatVND(localFilters.maxPrice) : 'Tối đa'}
                </span>
              )}
            </div>

            <div className="price-inputs-row">
              <div className="price-input-wrapper">
                <input
                  type="number"
                  placeholder="Từ (₫)"
                  value={localFilters.minPrice || ''}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      minPrice: Number(e.target.value) || 0
                    }))
                  }
                />
                <span className="price-input-unit">₫</span>
              </div>
              <span style={{ color: '#94A3B8', fontWeight: 600 }}>–</span>
              <div className="price-input-wrapper">
                <input
                  type="number"
                  placeholder="Đến (₫)"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      maxPrice: Number(e.target.value) || 0
                    }))
                  }
                />
                <span className="price-input-unit">₫</span>
              </div>
            </div>

            <div className="price-presets-grid">
              {PRICE_RANGES.map((preset, index) => {
                const isActive =
                  localFilters.minPrice === preset.min &&
                  localFilters.maxPrice === preset.max;
                return (
                  <button
                    key={index}
                    type="button"
                    className={`preset-chip-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handlePricePresetSelect(preset)}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lọc theo tình trạng */}
          <div className="filter-group">
            <div className="filter-group-title">
              <span>Tình trạng hàng</span>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                {localFilters.conditions.length === 0
                  ? 'Tất cả'
                  : `Đã chọn ${localFilters.conditions.length}`}
              </span>
            </div>

            <div className="condition-chips-list">
              {/* Option Tất cả */}
              <div
                className={`condition-select-card ${
                  localFilters.conditions.length === 0 ? 'active' : ''
                }`}
                onClick={() => handleConditionToggle('ALL')}
              >
                <span style={{ fontWeight: 600, fontSize: '13.5px' }}>
                  Tất cả tình trạng
                </span>
                {localFilters.conditions.length === 0 && (
                  <Check size={16} color="#0D9488" strokeWidth={2.5} />
                )}
              </div>

              {/* Các mức cụ thể */}
              {CONDITION_OPTIONS.filter((c) => c.id !== 'ALL').map((c) => {
                const isSelected = localFilters.conditions.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className={`condition-select-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleConditionToggle(c.id)}
                  >
                    <div className="condition-pill-indicator">
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: c.color
                        }}
                      />
                      <span>{c.label}</span>
                    </div>
                    {isSelected && (
                      <Check size={16} color="#0D9488" strokeWidth={2.5} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lọc theo khoảng cách */}
          <div className="filter-group">
            <div className="filter-group-title">
              <span>Bán kính vị trí</span>
              {localFilters.maxDistance > 0 ? (
                <span className="filter-group-value-text">
                  Dưới {localFilters.maxDistance} km
                </span>
              ) : (
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                  Toàn quốc
                </span>
              )}
            </div>

            <div className="distance-pill-row">
              {DISTANCE_OPTIONS.map((dist) => {
                const isActive = localFilters.maxDistance === dist.value;
                return (
                  <button
                    key={dist.value}
                    type="button"
                    className={`distance-pill ${isActive ? 'active' : ''}`}
                    onClick={() => handleDistanceSelect(dist.value)}
                  >
                    <MapPin size={13} />
                    <span>{dist.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bottomsheet-footer">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleReset}
          >
            <RotateCcw size={15} style={{ marginRight: '6px' }} />
            <span>Đặt lại</span>
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={handleApply}
          >
            <span>Áp dụng</span>
            {totalMatchingCount !== undefined && (
              <span>({totalMatchingCount} tin)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
