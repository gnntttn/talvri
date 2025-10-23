import React, { useRef } from 'react';
import type { TVShow } from '../types';
import { TvShowCard } from './TvShowCard';
import { useTranslation } from '../contexts/LanguageContext';

interface TvShowSliderProps {
  title: string;
  tvShows: TVShow[];
  onSelectTvShow: (tvShow: TVShow, options?: { playTrailer: boolean }) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (tvShow: TVShow) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (tvShow: TVShow) => void;
  onViewAll: () => void;
}

export const TvShowSlider: React.FC<TvShowSliderProps> = ({ title, tvShows, onSelectTvShow, favoriteIds, onToggleFavorite, watchlistIds, onToggleWatchlist, onViewAll }) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  if (tvShows.length === 0) return null;

  return (
    <div className="slider-container">
        <div className="flex justify-between items-center mb-4">
            <h2 className="slider-title">{title}</h2>
            <button onClick={onViewAll} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">{t('viewAll')}</button>
        </div>
        {/* Fix: Corrected the vendor-prefixed CSS property to its camelCase version for React inline styles. */}
        <div
            ref={scrollRef}
            className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            .slider-content::-webkit-scrollbar {
              display: none;
            }
          `}</style>
            {tvShows.map((tvShow) => (
                <div key={tvShow.id} className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
                    <TvShowCard 
                        tvShow={tvShow} 
                        onSelectTvShow={onSelectTvShow}
                        isFavorite={favoriteIds.has(tvShow.id)}
                        onToggleFavorite={onToggleFavorite}
                        isWatchlisted={watchlistIds.has(tvShow.id)}
                        onToggleWatchlist={onToggleWatchlist}
                    />
                </div>
            ))}
        </div>
    </div>
  );
};