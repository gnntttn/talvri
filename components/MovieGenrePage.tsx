import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Movie, Genre } from '../types';
import { discoverMovies } from '../services/tmdbService';
import { MovieGrid } from './MovieGrid';
import { Loader } from './Loader';
import { MovieListSkeleton } from './MovieListSkeleton';
import { useTranslation } from '../contexts/LanguageContext';
import { ErrorDisplay } from './ErrorDisplay';

interface MovieGenrePageProps {
  genre: Genre;
  onBack: () => void;
  onSelectMovie: (movie: Movie) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (movie: Movie) => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 4.158a.75.75 0 1 1-1.06 1.06l-5.5-5.5a.75.75 0 0 1 0-1.06l5.5-5.5a.75.75 0 0 1 1.06 1.06L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
  </svg>
);

export const MovieGenrePage: React.FC<MovieGenrePageProps> = ({
  genre,
  onBack,
  onSelectMovie,
  favoriteIds,
  onToggleFavorite,
  watchlistIds,
  onToggleWatchlist,
}) => {
  const { language, t } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetcher = useCallback((page: number, lang: string) => {
    return discoverMovies(genre.id, page, lang);
  }, [genre.id]);

  const loadMovies = useCallback(async (page: number) => {
    setIsLoading(true);
    if (page === 1) setError(null);
    try {
      const data = await fetcher(page, language);
      setMovies(prev => (page === 1 ? data.results : [...prev, ...data.results]));
      setTotalPages(data.total_pages);
    } catch (err) {
      const error = err as Error;
      if (page === 1) setError(error.message);
      console.error("Failed to fetch genre movies", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, language]);

  useEffect(() => {
    setMovies([]);
    setCurrentPage(1);
    loadMovies(1);
  }, [fetcher, language, loadMovies]);

  useEffect(() => {
    if (currentPage > 1) {
      loadMovies(currentPage);
    }
  }, [currentPage, loadMovies]);
  
  const loadMoreRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, currentPage, totalPages]);

  return (
    <div className="animate-fade-in">
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors rtl:rotate-180" aria-label="Go back">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold mx-4">{t('genreMoviesTitle', { genreName: genre.name })}</h2>
        </div>

        {error && movies.length === 0 ? (
          <ErrorDisplay message={error} onRetry={() => loadMovies(1)} />
        ) : isLoading && movies.length === 0 ? (
          <MovieListSkeleton />
        ) : (
          <MovieGrid
              movies={movies}
              onSelectMovie={onSelectMovie}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              watchlistIds={watchlistIds}
              onToggleWatchlist={onToggleWatchlist}
          />
        )}
        
        <div ref={loadMoreRef} className="h-10">
            {isLoading && movies.length > 0 && <Loader />}
        </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        `}</style>
    </div>
  );
};
