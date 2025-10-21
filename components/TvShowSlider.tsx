
import React from 'react';
import type { TVShow } from '../types';
import { TvShowCard } from './TvShowCard';
import { useTranslation } from '../contexts/LanguageContext';

interface TvShowSliderProps {
  title: string;
  tvShows: TVShow[];
  onSelectTvShow: (tvShow: TVShow) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (tvShow: TVShow) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (tvShow: TVShow) => void;
  onViewAll: () => void;
}

export const TvShowSlider: React.FC<TvShowSliderProps> = ({ title, tvShows, onSelectTvShow, favoriteIds, onToggleFavorite, watchlistIds, onToggleWatchlist, onViewAll }) => {
  const { t } = useTranslation();
  if (tvShows.length === 0) return null;

  return (
    <section>
        <div className="flex justify-between items-center mb-4 text-left rtl:text-right">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
            <button 
              onClick={onViewAll}
              className="px-4 py-1.5 text-sm font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              {t('viewAll')}
            </button>
        </div>
        <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-4 -ml-4 sm:-ml-6 rtl:-mr-4 rtl:ml-0 sm:rtl:-mr-6 pl-4 sm:pl-6 rtl:pr-4 rtl:pl-0 sm:rtl:pr-6 custom-scrollbar">
            {tvShows.map((tvShow) => (
                <div key={tvShow.id} className="flex-shrink-0 w-36 sm:w-48">
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
            <div className="flex-shrink-0 w-1 h-1"></div>
        </div>
        <style>{`
            .custom-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .custom-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
    </section>
  );
};
