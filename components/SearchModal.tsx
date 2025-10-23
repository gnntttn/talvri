import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { searchMulti } from '../services/tmdbService';
import { Movie, TVShow, Person, Genre } from '../types';
import { SearchBar } from './SearchBar';
import { Loader } from './Loader';
import { ErrorDisplay } from './ErrorDisplay';
import { NoResultsDisplay } from './NoResultsDisplay';
import { MovieGrid, PeopleGrid } from './MovieGrid';
import { TvShowGrid } from './TvShowGrid';
import { GenreSuggestionGrid } from './GenreSuggestionGrid';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  popularMovieGenres: Genre[];
  onSelectMovie: (movie: Movie, options?: { playTrailer: boolean }) => void;
  onSelectTvShow: (tvShow: TVShow, options?: { playTrailer: boolean }) => void;
  onSelectPerson: (personId: number) => void;
  favoriteMovieIds: Set<number>;
  onToggleFavoriteMovie: (movie: Movie) => void;
  watchlistMovieIds: Set<number>;
  onToggleWatchlistMovie: (movie: Movie) => void;
  favoriteTvShowIds: Set<number>;
  onToggleFavoriteTvShow: (tvShow: TVShow) => void;
  watchlistTvShowIds: Set<number>;
  onToggleWatchlistTvShow: (tvShow: TVShow) => void;
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);


export const SearchModal: React.FC<SearchModalProps> = (props) => {
  const { isOpen, onClose, popularMovieGenres } = props;
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [searchedTvShows, setSearchedTvShows] = useState<TVShow[]>([]);
  const [searchedPeople, setSearchedPeople] = useState<Person[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performSearch = useCallback(async () => {
    if (searchQuery.trim().length < 2) {
      setSearchedMovies([]); setSearchedTvShows([]); setSearchedPeople([]); return;
    }
    setIsSearching(true); setSearchError(null);
    try {
      const results = await searchMulti(searchQuery, 1, language);
      setSearchedMovies(results.results.filter((i): i is Movie & { media_type: 'movie' } => i.media_type === 'movie'));
      setSearchedTvShows(results.results.filter((i): i is TVShow & { media_type: 'tv' } => i.media_type === 'tv'));
      setSearchedPeople(results.results.filter((i): i is Person & { media_type: 'person' } => i.media_type === 'person'));
    } catch (err) {
      setSearchError((err as Error).message || t('failedToFetchDetails'));
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, language, t]);

  useEffect(() => {
    if (!isOpen) {
        setSearchQuery('');
        setSearchedMovies([]);
        setSearchedTvShows([]);
        setSearchedPeople([]);
        setIsSearching(false);
        setSearchError(null);
        return;
    }
    if (searchQuery.trim().length < 2) {
      if (searchQuery.trim().length === 0) {
        setSearchedMovies([]); setSearchedTvShows([]); setSearchedPeople([]); setIsSearching(false); setSearchError(null);
      }
      return;
    }
    const timer = setTimeout(() => performSearch(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, performSearch]);

  const renderContent = () => {
      if (searchError) return <ErrorDisplay message={searchError} onRetry={performSearch} />;
      if (isSearching) return <div className="pt-20"><Loader /></div>;
      
      const noResults = !isSearching && searchQuery.length > 2 && searchedMovies.length === 0 && searchedTvShows.length === 0 && searchedPeople.length === 0;
      if (noResults) return <NoResultsDisplay query={searchQuery} onDiscoverClick={onClose} />;

      if (searchQuery.length === 0) {
        return (
          <div className="text-center pt-8 md:pt-16">
            <h1 className="text-4xl font-bold mb-2">{t('findYourNextFavorite')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{t('exploreThousandsOfTitles')}</p>
            <GenreSuggestionGrid genres={popularMovieGenres} onGenreClick={(genreName) => setSearchQuery(genreName)} />
          </div>
        )
      }

      return (
        <div className="space-y-12">
            {searchedMovies.length > 0 && <section><h2 className="text-2xl font-bold mb-4">{t('movies')}</h2><MovieGrid movies={searchedMovies} onSelectMovie={props.onSelectMovie} favoriteIds={props.favoriteMovieIds} onToggleFavorite={props.onToggleFavoriteMovie} watchlistIds={props.watchlistMovieIds} onToggleWatchlist={props.onToggleWatchlistMovie} /></section>}
            {searchedTvShows.length > 0 && <section><h2 className="text-2xl font-bold mb-4">{t('tvShows')}</h2><TvShowGrid tvShows={searchedTvShows} onSelectTvShow={props.onSelectTvShow} favoriteIds={props.favoriteTvShowIds} onToggleFavorite={props.onToggleFavoriteTvShow} watchlistIds={props.watchlistTvShowIds} onToggleWatchlist={props.onToggleWatchlistTvShow} /></section>}
            {searchedPeople.length > 0 && <section><h2 className="text-2xl font-bold mb-4">{t('people')}</h2><PeopleGrid people={searchedPeople} onSelectPerson={props.onSelectPerson} /></section>}
        </div>
      );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 animate-fadeIn" role="dialog" aria-modal="true">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-grow">
            <SearchBar searchTerm={searchQuery} setSearchTerm={setSearchQuery} />
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label={t('closeModal')}
          >
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>
        
        <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};
