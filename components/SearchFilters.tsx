import React, { useMemo } from 'react';
import type { Genre } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface SearchFiltersProps {
  genres: Genre[];
  filters: {
    genre: number | null;
    year: number | null;
    rating: number | null;
  };
  onFilterChange: {
    setGenre: (id: number | null) => void;
    setYear: (year: number | null) => void;
    setRating: (rating: number | null) => void;
  };
  onResetFilters: () => void;
}

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year);
  }
  return years;
};

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  genres,
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const { t } = useTranslation();
  const years = useMemo(() => generateYearOptions(), []);

  return (
    <>
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg mb-8 border border-slate-200 dark:border-slate-700 text-left rtl:text-right animate-filters-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        {/* Genre Filter */}
        <div>
          <label htmlFor="genre-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('genre')}</label>
          <select
            id="genre-filter"
            value={filters.genre || ''}
            onChange={(e) => onFilterChange.setGenre(e.target.value ? Number(e.target.value) : null)}
            className="block w-full rounded-md border-0 bg-white dark:bg-slate-700 py-1.5 pl-3 pr-10 rtl:pr-3 rtl:pl-10 text-slate-900 dark:text-slate-200 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all duration-200 ease-in-out hover:shadow-md focus:shadow-lg hover:-translate-y-0.5"
            aria-label={t('genre')}
          >
            <option value="">{t('allGenres')}</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>
        
        {/* Year Filter */}
        <div>
          <label htmlFor="year-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('releaseYear')}</label>
          <select
            id="year-filter"
            value={filters.year || ''}
            onChange={(e) => onFilterChange.setYear(e.target.value ? Number(e.target.value) : null)}
            className="block w-full rounded-md border-0 bg-white dark:bg-slate-700 py-1.5 pl-3 pr-10 rtl:pr-3 rtl:pl-10 text-slate-900 dark:text-slate-200 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all duration-200 ease-in-out hover:shadow-md focus:shadow-lg hover:-translate-y-0.5"
             aria-label={t('releaseYear')}
          >
            <option value="">{t('anyYear')}</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label htmlFor="rating-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {filters.rating ? t('minRating', { rating: filters.rating.toFixed(1) }) : t('anyRating')}
          </label>
          <input
            id="rating-filter"
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.rating || 0}
            onChange={(e) => onFilterChange.setRating(Number(e.target.value) > 0 ? Number(e.target.value) : null)}
            className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
            aria-label={t('minRating', { rating: '' })}
          />
        </div>
        
        {/* Reset Button */}
        <div>
          <button
            onClick={onResetFilters}
            className="w-full px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 transition-all duration-200 sm:text-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            {t('resetFilters')}
          </button>
        </div>
      </div>
    </div>
     <style>{`
        @keyframes fade-in-slide-up {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-filters-in {
          animation: fade-in-slide-up 0.4s ease-out forwards;
        }

        #rating-filter {
            --thumb-color: #4f46e5; /* indigo-600 */
        }
        
        #rating-filter::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background: var(--thumb-color);
            cursor: pointer;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            margin-top: -6px; /* Center thumb on track */
        }

        #rating-filter::-moz-range-thumb {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background: var(--thumb-color);
            cursor: pointer;
            border: none;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        #rating-filter:active::-webkit-slider-thumb,
        #rating-filter:focus::-webkit-slider-thumb {
            transform: scale(1.25);
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.4);
        }

        #rating-filter:active::-moz-range-thumb,
        #rating-filter:focus::-moz-range-thumb {
            transform: scale(1.25);
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.4);
        }
    `}</style>
    </>
  );
};