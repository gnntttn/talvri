
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { TVShow, TmdbApiTvResponse } from '../types';
import { TvShowGrid } from './TvShowGrid';
import { Loader } from './Loader';
import { useTranslation } from '../contexts/LanguageContext';
import { MovieListSkeleton } from './MovieListSkeleton';

interface InfiniteTvShowSectionProps {
  title: string;
  fetcher: (page: number, language: string) => Promise<TmdbApiTvResponse>;
  onSelectTvShow: (tvShow: TVShow) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (tvShow: TVShow) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (tvShow: TVShow) => void;
}

export const InfiniteTvShowSection: React.FC<InfiniteTvShowSectionProps> = ({
  title,
  fetcher,
  onSelectTvShow,
  favoriteIds,
  onToggleFavorite,
  watchlistIds,
  onToggleWatchlist,
}) => {
  const { language } = useTranslation();
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const isMounted = useRef(true);

  const loadTvShows = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const data = await fetcher(page, language);
      if (isMounted.current) {
        setTvShows(prev => (page === 1 ? data.results : [...prev, ...data.results]));
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error(`Failed to fetch ${title} TV shows`, err);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher, language, title]);
  
  useEffect(() => {
    isMounted.current = true;
    loadTvShows(1);
    return () => {
      isMounted.current = false;
    };
  }, [loadTvShows]);
  
  const loadMoreRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage(prev => {
          const nextPage = prev + 1;
          loadTvShows(nextPage);
          return nextPage;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, currentPage, totalPages, loadTvShows]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-100 mb-4">{title}</h2>
      {isLoading && tvShows.length === 0 && <MovieListSkeleton count={6} />}
      {tvShows.length > 0 && (
        <TvShowGrid
          tvShows={tvShows}
          onSelectTvShow={onSelectTvShow}
          favoriteIds={favoriteIds}
          onToggleFavorite={onToggleFavorite}
          watchlistIds={watchlistIds}
          onToggleWatchlist={onToggleWatchlist}
        />
      )}
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isLoading && tvShows.length > 0 && <Loader />}
      </div>
    </section>
  );
};
