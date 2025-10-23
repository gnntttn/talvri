import React, { useState } from 'react';
import type { Movie, TVShow } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { MovieGrid } from './MovieGrid';
import { TvShowGrid } from './TvShowGrid';
import { Loader } from './Loader';

interface MyLibraryPageProps {
  favoriteMovies: Movie[];
  watchlistMovies: Movie[];
  favoriteTvShows: TVShow[];
  watchlistTvShows: TVShow[];
  isListLoading: boolean;
  onSelectMovie: (movie: Movie) => void;
  onSelectTvShow: (tvShow: TVShow) => void;
  favoriteIds: Set<number>;
  watchlistIds: Set<number>;
  favoriteTvShowIds: Set<number>;
  watchlistTvShowIds: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  onToggleFavoriteTvShow: (tvShow: TVShow) => void;
  onToggleWatchlistTvShow: (tvShow: TVShow) => void;
}

const EmptyFavoritesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

const EmptyWatchlistIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
);

const EmptyState: React.FC<{
    icon: React.ReactNode;
    title: string;
    message: string;
}> = ({ icon, title, message }) => (
    <div className="flex flex-col items-center justify-center text-center py-16 animate-fade-in">
        <div className="w-24 h-24 text-slate-300 dark:text-slate-600 mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{message}</p>
    </div>
);


const PrimaryTab: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full py-3 text-lg font-bold transition-colors duration-200 relative ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
    >
        {label}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full" />}
    </button>
);

const SecondaryTab: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => {
    const activeClasses = "bg-indigo-600 text-white";
    const inactiveClasses = "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700";
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${isActive ? activeClasses : inactiveClasses}`}
        >
            {label}
        </button>
    );
};


export const MyLibraryPage: React.FC<MyLibraryPageProps> = (props) => {
  const { t } = useTranslation();
  const [activePrimaryTab, setActivePrimaryTab] = useState<'favorites' | 'watchlist'>('favorites');
  const [activeSecondaryTab, setActiveSecondaryTab] = useState<'movies' | 'tvshows'>('movies');

  const renderContent = () => {
    if (props.isListLoading) {
        return <Loader />;
    }
    
    const isFavorites = activePrimaryTab === 'favorites';
    const isMovies = activeSecondaryTab === 'movies';

    if (isMovies) {
        const movies = isFavorites ? props.favoriteMovies : props.watchlistMovies;
        if (movies.length === 0) {
            return isFavorites ? (
                <EmptyState 
                    icon={<EmptyFavoritesIcon />}
                    title={t('emptyFavoritesTitle')}
                    message={t('emptyFavoritesMessageMovies')}
                />
            ) : (
                <EmptyState 
                    icon={<EmptyWatchlistIcon />}
                    title={t('emptyWatchlistTitle')}
                    message={t('emptyWatchlistMessageMovies')}
                />
            );
        }
        return (
            <MovieGrid 
                movies={movies} 
                onSelectMovie={props.onSelectMovie}
                favoriteIds={props.favoriteIds}
                onToggleFavorite={props.onToggleFavorite}
                watchlistIds={props.watchlistIds}
                onToggleWatchlist={props.onToggleWatchlist}
            />
        );
    } else { // TV Shows
        const tvShows = isFavorites ? props.favoriteTvShows : props.watchlistTvShows;
        if (tvShows.length === 0) {
            return isFavorites ? (
                <EmptyState
                    icon={<EmptyFavoritesIcon />}
                    title={t('emptyFavoritesTitle')}
                    message={t('emptyFavoritesMessageTvShows')}
                />
            ) : (
                <EmptyState
                    icon={<EmptyWatchlistIcon />}
                    title={t('emptyWatchlistTitle')}
                    message={t('emptyWatchlistMessageTvShows')}
                />
            );
        }
        return (
            <TvShowGrid
                tvShows={tvShows}
                onSelectTvShow={props.onSelectTvShow}
                favoriteIds={props.favoriteTvShowIds}
                onToggleFavorite={props.onToggleFavoriteTvShow}
                watchlistIds={props.watchlistTvShowIds}
                onToggleWatchlist={props.onToggleWatchlistTvShow}
            />
        );
    }
  };

  return (
    <div className="min-h-screen py-8 animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{t('myLibrary')}</h2>

        <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
            <div className="flex max-w-md mx-auto">
                <PrimaryTab label={t('favorites')} isActive={activePrimaryTab === 'favorites'} onClick={() => setActivePrimaryTab('favorites')} />
                <PrimaryTab label={t('watchlist')} isActive={activePrimaryTab === 'watchlist'} onClick={() => setActivePrimaryTab('watchlist')} />
            </div>
        </div>
        
        <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-8">
            <SecondaryTab label={t('movies')} isActive={activeSecondaryTab === 'movies'} onClick={() => setActiveSecondaryTab('movies')} />
            <SecondaryTab label={t('tvShows')} isActive={activeSecondaryTab === 'tvshows'} onClick={() => setActiveSecondaryTab('tvshows')} />
        </div>
        
        {renderContent()}
    </div>
  );
};
