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
  Cable 
} from 'lucide-react';
import { CATEGORIES } from '../mocks/categories';

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

export default function CategoryChips({ activeCategory, onSelectCategory }) {
  return (
    <div className="categories-container hide-scrollbar">
      {CATEGORIES.map((cat) => {
        const IconComponent = ICON_MAP[cat.icon] || Sparkles;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            className={`category-chip ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <IconComponent size={15} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
