
import React from 'react';
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
  if (movies.length === 0) return null;

  return (
    <section>
        <div className="flex justify-between items-center mb-4 text-left rtl:text-right">
            <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
            <button 
              onClick={onViewAll}
              className="px-4 py-1.5 text-sm font-semibold rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              {t('viewAll')}
            </button>
        </div>
        <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-4 -ml-4 sm:-ml-6 rtl:-mr-4 rtl:ml-0 sm:rtl:-mr-6 pl-4 sm:pl-6 rtl:pr-4 rtl:pl-0 sm:rtl:pr-6 custom-scrollbar">
            {movies.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-40 sm:w-48">
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
            <div className="flex-shrink-0 w-1 h-1"></div>
        </div>
        <style>{`
            .custom-scrollbar::-webkit-scrollbar {
                height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #1e293b;
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #334155;
            }
            .custom-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: thin;
                scrollbar-color: #1e293b transparent;
            }
        `}</style>
    </section>
  );
};