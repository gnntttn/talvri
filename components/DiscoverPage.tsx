import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Movie, TVShow, Genre } from '../types';
import { discoverMedia } from '../services/tmdbService';
import { Loader } from './Loader';
import { MovieListSkeleton } from './MovieListSkeleton';
import { useTranslation } from '../contexts/LanguageContext';
import { MovieGrid } from './MovieGrid';
import { TvShowGrid } from './TvShowGrid';
import { SearchFilters } from './SearchFilters';
import { ErrorDisplay } from './ErrorDisplay';

interface DiscoverPageProps {
  movieGenres: Genre[];
  tvGenres: Genre[];
  onSelectMovie: (movie: Movie) => void;
  onSelectTvShow: (tvShow: TVShow) => void;
  favoriteMovieIds: Set<number>;
  onToggleFavoriteMovie: (movie: Movie) => void;
  watchlistMovieIds: Set<number>;
  onToggleWatchlistMovie: (movie: Movie) => void;
  favoriteTvShowIds: Set<number>;
  onToggleFavoriteTvShow: (tvShow: TVShow) => void;
  watchlistTvShowIds: Set<number>;
  onToggleWatchlistTvShow: (tvShow: TVShow) => void;
}

const MediaToggle: React.FC<{
    mediaType: 'movie' | 'tv';
    setMediaType: (type: 'movie' | 'tv') => void;
}> = ({ mediaType, setMediaType }) => {
    const { t } = useTranslation();
    const baseClasses = "px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900";
    const activeClasses = "bg-indigo-600 text-white";
    const inactiveClasses = "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700";

    return (
        <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-8">
            <button onClick={() => setMediaType('movie')} className={`${baseClasses} ${mediaType === 'movie' ? activeClasses : inactiveClasses}`}>{t('movies')}</button>
            <button onClick={() => setMediaType('tv')} className={`${baseClasses} ${mediaType === 'tv' ? activeClasses : inactiveClasses}`}>{t('tvShows')}</button>
        </div>
    );
}

export const DiscoverPage: React.FC<DiscoverPageProps> = (props) => {
    const { language, t } = useTranslation();
    const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
    const [filters, setFilters] = useState<{ genre: number | null, year: number | null, rating: number | null }>({ genre: null, year: null, rating: null });
    
    const [results, setResults] = useState<(Movie | TVShow)[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const loadResults = useCallback(async (page: number, shouldAppend: boolean) => {
        setIsLoading(true);
        if (!shouldAppend) setError(null);
        try {
            const data = await discoverMedia(mediaType, filters, page, language);
            setResults(prev => (shouldAppend ? [...prev, ...data.results] : data.results));
            setTotalPages(data.total_pages);
        } catch (err) {
            const error = err as Error;
            if (!shouldAppend) setError(error.message);
            console.error(`Failed to discover ${mediaType}`, err);
        } finally {
            setIsLoading(false);
        }
    }, [language, mediaType, filters]);

    useEffect(() => {
        setResults([]);
        setCurrentPage(1);
        setTotalPages(1);
        loadResults(1, false);
    }, [language, mediaType, filters, loadResults]);
  
    const loadMoreRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && currentPage < totalPages) {
                const nextPage = currentPage + 1;
                setCurrentPage(nextPage);
                loadResults(nextPage, true);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, currentPage, totalPages, loadResults]);

    const onFilterChange = {
        setGenre: (genre: number | null) => setFilters(f => ({ ...f, genre })),
        setYear: (year: number | null) => setFilters(f => ({ ...f, year })),
        setRating: (rating: number | null) => setFilters(f => ({ ...f, rating })),
    };

    const onResetFilters = () => setFilters({ genre: null, year: null, rating: null });

    const noResults = !isLoading && results.length === 0 && !error;
    
    const renderGrid = () => {
        if (error) {
            return <ErrorDisplay message={error} onRetry={() => loadResults(1, false)} />;
        }
        if (isLoading && results.length === 0) {
            return <MovieListSkeleton count={20} />;
        }
        if (noResults) {
            return <p className="text-center mt-8 text-slate-500 dark:text-slate-400">{t('noMoviesFound')}</p>;
        }
        if (results.length > 0) {
            return mediaType === 'movie' ? (
                <MovieGrid 
                    movies={results as Movie[]}
                    onSelectMovie={props.onSelectMovie}
                    favoriteIds={props.favoriteMovieIds}
                    onToggleFavorite={props.onToggleFavoriteMovie}
                    watchlistIds={props.watchlistMovieIds}
                    onToggleWatchlist={props.onToggleWatchlistMovie}
                />
            ) : (
                <TvShowGrid 
                    tvShows={results as TVShow[]}
                    onSelectTvShow={props.onSelectTvShow}
                    favoriteIds={props.favoriteTvShowIds}
                    onToggleFavorite={props.onToggleFavoriteTvShow}
                    watchlistIds={props.watchlistTvShowIds}
                    onToggleWatchlist={props.onToggleWatchlistTvShow}
                />
            );
        }
        return null;
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{t('discover')}</h2>
            <MediaToggle mediaType={mediaType} setMediaType={setMediaType} />
            <SearchFilters
                genres={mediaType === 'movie' ? props.movieGenres : props.tvGenres}
                filters={filters}
                onFilterChange={onFilterChange}
                onResetFilters={onResetFilters}
            />

            {renderGrid()}
            
            <div ref={loadMoreRef} className="h-10">
                {isLoading && results.length > 0 && <Loader />}
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};