import React, { useRef } from 'react';
import type { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { useTranslation } from '../contexts/LanguageContext';

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie, options?: { playTrailer: boolean }) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (movie: Movie) => void;
  onViewAll: () => void;
}

export const MovieSlider: React.FC<MovieSliderProps> = ({ title, movies, onSelectMovie, favoriteIds, onToggleFavorite, watchlistIds, onToggleWatchlist, onViewAll }) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  if (movies.length === 0) return null;

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
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
            <MovieCard 
                movie={movie} 
                onSelectMovie={onSelectMovie} 
                isFavorite={favoriteIds.has(movie.id)}
                onToggleFavorite={onToggleFavorite}
                isWatchlisted={watchlistIds.has(movie.id)}
                onToggleWatchlist={onToggleWatchlist}
            />
          </div>
        ))}
      </div>
    </div>
  );
};