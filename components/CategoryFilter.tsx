
import React from 'react';

export type Category = 'popular' | 'top_rated' | 'now_playing' | 'upcoming';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const categories: { id: Category; name: string }[] = [
    { id: 'popular', name: 'Popular' },
    { id: 'top_rated', name: 'Top Rated' },
    { id: 'now_playing', name: 'Now Playing' },
    { id: 'upcoming', name: 'Upcoming' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 flex-shrink-0";
  const activeClasses = "bg-indigo-600 text-white shadow";
  const inactiveClasses = "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700";

  return (
    <div className="pb-4 overflow-x-auto">
      <div className="flex items-center space-x-2 whitespace-nowrap py-2">
        {categories.map(category => (
          <button 
            key={category.id} 
            onClick={() => onSelectCategory(category.id)}
            className={`${baseClasses} ${selectedCategory === category.id ? activeClasses : inactiveClasses}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};
