import React, { useState, useMemo } from 'react';
import { 
  PackageOpen, 
  X, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  ChevronDown 
} from 'lucide-react';
import EscrowTrustBanner from '../components/EscrowTrustBanner';
import SearchBar from '../components/SearchBar';
import CategoryChips from '../components/CategoryChips';
import ProductCard from '../components/ProductCard';
import BottomSheetFilter from '../components/BottomSheetFilter';
import DesktopSidebarFilter from '../components/DesktopSidebarFilter';
import DesktopRightSidebar from '../components/DesktopRightSidebar';
import { MOCK_PRODUCTS } from '../mocks/products';
import { formatVND } from '../utils/formatters';

export default function HomeScreen({ 
  onSelectProduct, 
  onViewOrder, 
  onViewMessages, 
  onOpenAboutEscrow 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest | price_asc | price_desc | distance
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    conditions: [],
    maxDistance: 0
  });

  // Calculate dynamic category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: MOCK_PRODUCTS.length };
    MOCK_PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Calculate active filter count for mobile badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minPrice > 0 || filters.maxPrice > 0) count++;
    if (filters.conditions && filters.conditions.length > 0) count++;
    if (filters.maxDistance > 0) count++;
    return count;
  }, [filters]);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    // 1. Filtering
    const filtered = MOCK_PRODUCTS.filter((product) => {
      // Category
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // Search query (case-insensitive across title, description, tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = product.title.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchTag = product.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTag) {
          return false;
        }
      }

      // Price
      if (filters.minPrice > 0 && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice > 0 && product.price > filters.maxPrice) {
        return false;
      }

      // Condition
      if (
        filters.conditions &&
        filters.conditions.length > 0 &&
        !filters.conditions.includes(product.condition)
      ) {
        return false;
      }

      // Distance
      if (filters.maxDistance > 0 && product.distanceKm > filters.maxDistance) {
        return false;
      }

      return true;
    });

    // 2. Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      // Default: newest
      return 0;
    });
  }, [searchQuery, activeCategory, filters, sortBy]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setFilters({
      minPrice: 0,
      maxPrice: 0,
      conditions: [],
      maxDistance: 0
    });
  };

  const handleRemovePriceFilter = () => {
    setFilters((prev) => ({ ...prev, minPrice: 0, maxPrice: 0 }));
  };

  const handleRemoveConditionFilter = (cond) => {
    setFilters((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((c) => c !== cond)
    }));
  };

  const handleRemoveDistanceFilter = () => {
    setFilters((prev) => ({ ...prev, maxDistance: 0 }));
  };

  return (
    <div className="home-screen-layout">
      {/* Escrow Guarantee Banner */}
      <EscrowTrustBanner onLearnMore={onOpenAboutEscrow} />

      {/* Big Search Bar Area (Universal) */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={handleClearSearch}
        onOpenFilter={() => setIsFilterOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Horizontal Category Chips (Only on mobile/tablet < 1024px) */}
      <div className="mobile-only-categories">
        <CategoryChips
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      {/* 3-COLUMN DESKTOP LAYOUT (>= 1024px) */}
      <div className="home-main-columns">
        {/* SIDEBAR TRÁI: BỘ LỌC (260px, Sticky) */}
        <DesktopSidebarFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categoryCounts={categoryCounts}
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetAllFilters}
        />

        {/* CỘT GIỮA: NỘI DUNG SẢN PHẨM (Chiếm toàn bộ không gian còn lại) */}
        <section className="home-center-column">
          {/* Active Filter Chips Bar (mobile & desktop) */}
          {activeFilterCount > 0 && (
            <div className="active-filters-bar hide-scrollbar">
              {(filters.minPrice > 0 || filters.maxPrice > 0) && (
                <div className="active-filter-pill">
                  <span>
                    {filters.minPrice > 0 ? formatVND(filters.minPrice) : '0 ₫'} –{' '}
                    {filters.maxPrice > 0 ? formatVND(filters.maxPrice) : 'Max'}
                  </span>
                  <button type="button" onClick={handleRemovePriceFilter} aria-label="Xoá lọc giá">
                    <X size={13} />
                  </button>
                </div>
              )}

              {filters.conditions &&
                filters.conditions.map((cond) => (
                  <div key={cond} className="active-filter-pill">
                    <span>{cond}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveConditionFilter(cond)}
                      aria-label={`Xoá lọc ${cond}`}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}

              {filters.maxDistance > 0 && (
                <div className="active-filter-pill">
                  <span>&le; {filters.maxDistance} km</span>
                  <button type="button" onClick={handleRemoveDistanceFilter} aria-label="Xoá lọc khoảng cách">
                    <X size={13} />
                  </button>
                </div>
              )}

              <button 
                type="button" 
                className="clear-all-filters-btn" 
                onClick={handleResetAllFilters}
              >
                Xoá tất cả
              </button>
            </div>
          )}

          {/* Results Bar: Title + Sắp xếp + Grid/List toggle */}
          <div className="section-meta-header-desktop">
            <div className="section-results-count">
              Tìm thấy <strong>{processedProducts.length}</strong> món đồ gần bạn
            </div>

            <div className="section-toolbar-right">
              {/* Dropdown sắp xếp */}
              <div className="sort-dropdown-wrapper">
                <span className="sort-label">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select-box"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                  <option value="distance">Gần tôi nhất</option>
                </select>
                <ChevronDown size={14} className="sort-chevron-icon" />
              </div>

              {/* Chuyển đổi Lưới / Danh sách (Grid / List) */}
              <div className="view-mode-toggle">
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Xem dạng lưới"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Xem dạng danh sách"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid or List or Empty State */}
          {processedProducts.length > 0 ? (
            <div className={viewMode === 'grid' ? 'product-grid' : 'product-list-view'}>
              {processedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={onSelectProduct}
                  isListView={viewMode === 'list'}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon-circle">
                <PackageOpen size={30} />
              </div>
              <div className="empty-title">Không tìm thấy món đồ phù hợp</div>
              <div className="empty-desc">
                Hãy thử tìm bằng từ khoá khác hoặc điều chỉnh lại các tiêu chí lọc giá, khoảng cách.
              </div>
              <button
                type="button"
                className="btn-reset-filter"
                onClick={handleResetAllFilters}
              >
                Thiết lập lại bộ lọc
              </button>
            </div>
          )}
        </section>

        {/* CỘT PHẢI: "ĐANG THEO DÕI" (300px, Sticky, chỉ hiện trên breakpoint xl >= 1280px) */}
        <DesktopRightSidebar
          onViewOrders={onViewOrder}
          onViewMessages={onViewMessages}
          onSelectProduct={onSelectProduct}
        />
      </div>

      {/* Bottom Sheet Filter Modal (Dành cho Mobile khi bấm nút Lọc) */}
      <BottomSheetFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
        totalMatchingCount={processedProducts.length}
      />
    </div>
  );
}
