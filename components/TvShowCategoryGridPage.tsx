


import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { TVShow, TmdbApiTvResponse } from '../types';
import { Loader } from './Loader';
import { MovieListSkeleton } from './MovieListSkeleton';
import { useTranslation } from '../contexts/LanguageContext';
import { TvShowGrid } from './TvShowGrid';
import { ErrorDisplay } from './ErrorDisplay';

interface TvShowCategoryGridPageProps {
  title: string;
  fetcher: (page: number, language: string) => Promise<TmdbApiTvResponse>;
  onBack: () => void;
  onSelectTvShow: (tvShow: TVShow, options?: { playTrailer: boolean }) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (tvShow: TVShow) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (tvShow: TVShow) => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 4.158a.75.75 0 1 1-1.06 1.06l-5.5-5.5a.75.75 0 0 1 0-1.06l5.5-5.5a.75.75 0 0 1 1.06 1.06L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
  </svg>
);


export const TvShowCategoryGridPage: React.FC<TvShowCategoryGridPageProps> = ({
  title,
  fetcher,
  onBack,
  onSelectTvShow,
  favoriteIds,
  onToggleFavorite,
  watchlistIds,
  onToggleWatchlist,
}) => {
  const { language } = useTranslation();
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadTvShows = useCallback(async (page: number) => {
    setIsLoading(true);
    if (page === 1) setError(null);
    try {
      const data = await fetcher(page, language);
      setTvShows(prev => (page === 1 ? data.results : [...prev, ...data.results]));
      setTotalPages(data.total_pages);
    } catch (err) {
      const error = err as Error;
      if (page === 1) setError(error.message);
      console.error("Failed to fetch category tv shows", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, language]);

  useEffect(() => {
    setTvShows([]);
    setCurrentPage(1);
    loadTvShows(1);
  }, [fetcher, language, loadTvShows]);

  useEffect(() => {
    if (currentPage > 1) {
      loadTvShows(currentPage);
    }
  }, [currentPage, loadTvShows]);
  
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
            <h2 className="text-xl sm:text-2xl font-bold mx-4">{title}</h2>
        </div>
        
        {error && tvShows.length === 0 ? (
          <ErrorDisplay message={error} onRetry={() => loadTvShows(1)} />
        ) : isLoading && tvShows.length === 0 ? (
          <MovieListSkeleton />
        ) : (
          <TvShowGrid
              tvShows={tvShows}
              onSelectTvShow={onSelectTvShow}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              watchlistIds={watchlistIds}
              onToggleWatchlist={onToggleWatchlist}
          />
        )}
        
        <div ref={loadMoreRef} className="h-10">
            {isLoading && tvShows.length > 0 && <Loader />}
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