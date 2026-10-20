import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onOpenFilter,
  activeFilterCount = 0
}) {
  return (
    <section className="search-section">
      <div className="search-bar-wrapper">
        <div className="search-input-box">
          <Search size={18} color="#64748B" />
          <input
            type="text"
            placeholder="Tìm kiếm iPhone, MacBook, tai nghe..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={onClearSearch}
              aria-label="Xoá tìm kiếm"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`filter-trigger-btn ${activeFilterCount > 0 ? 'has-filters' : ''}`}
          onClick={onOpenFilter}
          aria-label="Bộ lọc"
        >
          <SlidersHorizontal size={17} />
          <span>Lọc</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>
    </section>
  );
}
