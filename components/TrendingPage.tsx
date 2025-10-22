

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { TrendingItem, Movie, TVShow } from '../types';
import { getTrendingAllWeek } from '../services/tmdbService';
import { Loader } from './Loader';
import { MovieListSkeleton } from './MovieListSkeleton';
import { useTranslation } from '../contexts/LanguageContext';
import { MediaGrid } from './MediaGrid';
import { ErrorDisplay } from './ErrorDisplay';

interface TrendingPageProps {
  onSelectMovie: (movie: Movie, options?: { playTrailer: boolean }) => void;
  onSelectTvShow: (tvShow: TVShow, options?: { playTrailer: boolean }) => void;
  favoriteMovieIds: Set<number>;
  onToggleFavoriteMovie: (movie: Movie) => void;
  watchlistMovieIds: Set<number>;
  onToggleWatchlistMovie: (movie: Movie) => void;
  favoriteTvShowIds: Set<number>;
  onToggleFavoriteTvShow: (tvShow: TVShow) => void;
  watchlistTvShowIds: Set<number>;
  onToggleWatchlistTvShow: (tvShow: TVShow) => void;
}

export const TrendingPage: React.FC<TrendingPageProps> = (props) => {
  const { language, t } = useTranslation();
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadTrendingItems = useCallback(async (page: number) => {
    setIsLoading(true);
    if (page === 1) setError(null);
    try {
      const data = await getTrendingAllWeek(page, language);
      setItems(prev => (page === 1 ? data.results.filter(item => item.poster_path) : [...prev, ...data.results.filter(item => item.poster_path)]));
      setTotalPages(data.total_pages);
    } catch (err) {
      const error = err as Error;
      if (page === 1) setError(error.message);
      console.error("Failed to fetch trending items", err);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    setItems([]);
    setCurrentPage(1);
    loadTrendingItems(1);
  }, [language, loadTrendingItems]);
  
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
  
  useEffect(() => {
    if (currentPage > 1) {
        loadTrendingItems(currentPage);
    }
  }, [currentPage, loadTrendingItems]);

  const renderContent = () => {
    if (error && items.length === 0) {
      return <ErrorDisplay message={error} onRetry={() => loadTrendingItems(1)} />;
    }
    if (isLoading && items.length === 0) {
      return <MovieListSkeleton count={20} />;
    }
    if (items.length > 0) {
      return <MediaGrid {...props} items={items} />;
    }
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-8">{t('trending')}</h2>
        
        {renderContent()}
        
        <div ref={loadMoreRef} className="h-10">
            {isLoading && items.length > 0 && <Loader />}
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
