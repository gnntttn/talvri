
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Movie, Genre, TmdbApiPopularResponse, PersonDetails, TVShow, TmdbApiTvResponse } from './types';
import { 
  getPopularMovies, searchMovies, getMovieDetails, getMovieGenres, getTvGenres, 
  getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies, getPersonDetails, 
  getPersonMovieCredits, getPopularTvShows, getTopRatedTvShows, getAiringTodayTvShows, 
  getTvShowDetails, discoverMovies, searchTvShows
} from './services/tmdbService';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { Footer } from './components/Footer';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { BottomNavBar } from './components/BottomNavBar';
import { TvShowDetailsModal } from './components/TvShowDetailsModal';
import { useTranslation } from './contexts/LanguageContext';
import { PersonDetailsModal } from './components/PersonDetailsModal';
import { PersonDetailsModalSkeleton } from './components/PersonDetailsModalSkeleton';
import { CategoryGridPage } from './components/CategoryGridPage';
import { TvShowCategoryGridPage } from './components/TvShowCategoryGridPage';
import { ListSubTabs } from './components/ListSubTabs';
import { MovieGrid } from './components/MovieGrid';
import { TvShowGrid } from './components/TvShowGrid';
import { HeroSlider } from './components/HeroSlider';
import { SearchBar } from './components/SearchBar';
import { InfiniteMovieSection } from './components/InfiniteMovieSection';
import { InfiniteTvShowSection } from './components/InfiniteTvShowSection';

export type Theme = 'light' | 'dark';
// Fix: Export the ActiveTab type so it can be imported by other components and add new tabs.
export type ActiveTab = 'movies' | 'tvshows' | 'search' | 'favorites' | 'watchlist' | 'trending' | 'live_broadcasts';
type ActiveView = 'home' | 'movies_category' | 'tv_category';

function App() {
  const { language, t } = useTranslation();
  
  // UI State
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'dark'; // Default to dark theme
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('movies');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  
  // Movie Page State (only for Hero Slider)
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);

  // Search Page State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [searchedTvShows, setSearchedTvShows] = useState<TVShow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Modal State
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTvShow, setSelectedTvShow] = useState<TVShow | null>(null);
  const [personDetails, setPersonDetails] = useState<(PersonDetails & { movies: Movie[] }) | null>(null);
  const [isPersonLoading, setIsPersonLoading] = useState(false);
  const [isSurpriseLoading, setIsSurpriseLoading] = useState(false);

  // User Lists State (Favorites, Watchlist)
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [favoriteTvShowIds, setFavoriteTvShowIds] = useState<Set<number>>(new Set());
  const [watchlistTvShowIds, setWatchlistTvShowIds] = useState<Set<number>>(new Set());
  const [favoriteTvShows, setFavoriteTvShows] = useState<TVShow[]>([]);
  const [watchlistTvShows, setWatchlistTvShows] = useState<TVShow[]>([]);
  const [activeListSubTab, setActiveListSubTab] = useState<'movies' | 'tvshows'>('movies');
  const [isListLoading, setIsListLoading] = useState(false);
  
  // "View All" Page State
  const [viewAllConfig, setViewAllConfig] = useState<{ title: string; fetcher: (page: number, lang: string) => Promise<TmdbApiPopularResponse | TmdbApiTvResponse>; type: 'movie' | 'tv' } | null>(null);
  

  // --- Effects ---

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteMovies');
    if (storedFavorites) setFavoriteIds(new Set(JSON.parse(storedFavorites)));
    const storedWatchlist = localStorage.getItem('watchlistMovies');
    if (storedWatchlist) setWatchlistIds(new Set(JSON.parse(storedWatchlist)));
    const storedTvFavorites = localStorage.getItem('favoriteTvShows');
    if (storedTvFavorites) setFavoriteTvShowIds(new Set(JSON.parse(storedTvFavorites)));
    const storedTvWatchlist = localStorage.getItem('watchlistTvShows');
    if (storedTvWatchlist) setWatchlistTvShowIds(new Set(JSON.parse(storedTvWatchlist)));
  }, []);

  const fetchAllInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [movGenres, tvGen, nowMov] = await Promise.all([
        getMovieGenres(language),
        getTvGenres(language),
        getNowPlayingMovies(1, language),
      ]);
      setMovieGenres(movGenres.genres);
      setTvGenres(tvGen.genres);
      setNowPlayingMovies(nowMov.results);
    } catch (err) {
      setError(t('failedToLoadMovies'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);
  
  useEffect(() => {
    fetchAllInitialData();
  }, [fetchAllInitialData]);

  // Search effect with debounce
  useEffect(() => {
    if (activeTab !== 'search') return;

    if (searchQuery.trim().length < 2) {
      setSearchedMovies([]);
      setSearchedTvShows([]);
      setIsSearching(false);
      return;
    }

    const searchTimer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [movieResults, tvShowResults] = await Promise.all([
          searchMovies(searchQuery, 1, language),
          searchTvShows(searchQuery, 1, language)
        ]);
        setSearchedMovies(movieResults.results);
        setSearchedTvShows(tvShowResults.results);
      } catch (err) {
        setError(t('failedToFetchDetails'));
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(searchTimer);
  }, [searchQuery, activeTab, language, t]);

  // Effect to fetch details for list pages (Favorites, Watchlist)
  useEffect(() => {
    const fetchListDetails = async (movieIds: Set<number>, tvShowIds: Set<number>, type: 'favorites' | 'watchlist') => {
      setIsListLoading(true);
      try {
        const moviePromises = Array.from(movieIds).map(id => getMovieDetails(id, language));
        const tvShowPromises = Array.from(tvShowIds).map(id => getTvShowDetails(id, language));
        
        const [movieDetails, tvShowDetails] = await Promise.all([
          Promise.all(moviePromises),
          Promise.all(tvShowPromises)
        ]);

        if (type === 'favorites') {
          setFavoriteMovies(movieDetails);
          setFavoriteTvShows(tvShowDetails);
        } else {
          setWatchlistMovies(movieDetails);
          setWatchlistTvShows(tvShowDetails);
        }
      } catch (err) {
        setError(t('failedToFetchList'));
      } finally {
        setIsListLoading(false);
      }
    };

    if (activeTab === 'favorites') {
      setActiveListSubTab('movies');
      fetchListDetails(favoriteIds, favoriteTvShowIds, 'favorites');
    } else if (activeTab === 'watchlist') {
      setActiveListSubTab('movies');
      fetchListDetails(watchlistIds, watchlistTvShowIds, 'watchlist');
    }
  }, [activeTab, favoriteIds, watchlistIds, favoriteTvShowIds, watchlistTvShowIds, language, t]);

  // Reset search when leaving search tab
  useEffect(() => {
    if (activeTab !== 'search') {
      setSearchQuery('');
      setSearchedMovies([]);
      setSearchedTvShows([]);
    }
  }, [activeTab]);

  // --- Handlers ---
  const toggleFavorite = (movie: Movie) => {
    const newFavorites = new Set(favoriteIds);
    if (newFavorites.has(movie.id)) newFavorites.delete(movie.id); else newFavorites.add(movie.id);
    setFavoriteIds(newFavorites);
    localStorage.setItem('favoriteMovies', JSON.stringify(Array.from(newFavorites)));
  };
  const toggleWatchlist = (movie: Movie) => {
    const newWatchlist = new Set(watchlistIds);
    if (newWatchlist.has(movie.id)) newWatchlist.delete(movie.id); else newWatchlist.add(movie.id);
    setWatchlistIds(newWatchlist);
    localStorage.setItem('watchlistMovies', JSON.stringify(Array.from(newWatchlist)));
  };
  const toggleFavoriteTvShow = (tvShow: TVShow) => {
    const newFavorites = new Set(favoriteTvShowIds);
    if (newFavorites.has(tvShow.id)) newFavorites.delete(tvShow.id); else newFavorites.add(tvShow.id);
    setFavoriteTvShowIds(newFavorites);
    localStorage.setItem('favoriteTvShows', JSON.stringify(Array.from(newFavorites)));
  };
  const toggleWatchlistTvShow = (tvShow: TVShow) => {
    const newWatchlist = new Set(watchlistTvShowIds);
    if (newWatchlist.has(tvShow.id)) newWatchlist.delete(tvShow.id); else newWatchlist.add(tvShow.id);
    setWatchlistTvShowIds(newWatchlist);
    localStorage.setItem('watchlistTvShows', JSON.stringify(Array.from(newWatchlist)));
  };

  const handleSelectMovie = async (movie: Movie, options?: { playTrailer: boolean }) => {
    try {
      const details = await getMovieDetails(movie.id, language);
      setSelectedMovie({ ...details, playOnMount: options?.playTrailer });
    } catch(err) {
      setError(t('failedToFetchDetails'));
      setSelectedMovie({ ...movie, playOnMount: options?.playTrailer });
    }
  };

  const handleSelectTvShow = async (tvShow: TVShow) => {
    try {
      const details = await getTvShowDetails(tvShow.id, language);
      setSelectedTvShow(details);
    } catch(err) {
      setError(t('failedToFetchDetails'));
      setSelectedTvShow(tvShow); 
    }
  };
  
  const handleSelectSimilarMovie = async (movie: Movie) => {
    setSelectedMovie(null);
    setTimeout(() => handleSelectMovie(movie), 300);
  };
  const handleSelectSimilarTvShow = async (tvShow: TVShow) => {
    setSelectedTvShow(null);
    setTimeout(() => handleSelectTvShow(tvShow), 300);
  };

  const handleSelectPerson = async (personId: number) => {
    if (selectedMovie) setSelectedMovie(null);
    if (selectedTvShow) setSelectedTvShow(null);
    setIsPersonLoading(true); setPersonDetails(null); document.body.style.overflow = 'hidden';
    try {
      const [details, credits] = await Promise.all([ getPersonDetails(personId, language), getPersonMovieCredits(personId, language) ]);
      const allMovies = [...credits.cast, ...credits.crew].filter(m => m.poster_path).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      setPersonDetails({ ...details, movies: Array.from(new Map(allMovies.map(m => [m.id, m])).values()) });
    } catch (err) {
      setError(t('failedToFetchDetails')); document.body.style.overflow = 'auto';
    } finally {
      setIsPersonLoading(false);
    }
  };
  const handleClosePersonModal = () => { setPersonDetails(null); document.body.style.overflow = 'auto'; };
  const handleSelectMovieFromPerson = (movie: Movie) => { handleClosePersonModal(); setTimeout(() => handleSelectMovie(movie), 300); };
  
  const handleViewAll = (title: string, fetcher: any, type: 'movie' | 'tv') => {
    setViewAllConfig({ title, fetcher, type });
  };
  const handleBackFromViewAll = () => setViewAllConfig(null);

  const handleSurpriseMe = async () => {
    setIsSurpriseLoading(true);
    setError(null);
    try {
      // Fetch the first page to get total_pages
      const initialData = await getPopularMovies(1, language);
      const totalPages = Math.min(initialData.total_pages, 500); // TMDB recommends not going over 500
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      
      const data = await getPopularMovies(randomPage, language);
      if (data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomMovie = data.results[randomIndex];
        await handleSelectMovie(randomMovie);
      } else {
        setError(t('couldNotFetchRandom'));
      }
    } catch (err) {
      setError(t('couldNotFetchRandom'));
      console.error(err);
    } finally {
      setIsSurpriseLoading(false);
    }
  };

  // --- Content Rendering ---
  const renderMoviesPage = () => (
    <>
      <HeroSlider movies={nowPlayingMovies.slice(0, 10)} onSelectMovie={handleSelectMovie} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12">
        <InfiniteMovieSection title={t('popular')} fetcher={getPopularMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
        <InfiniteMovieSection title={t('topRated')} fetcher={getTopRatedMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
        <InfiniteMovieSection title={t('nowPlaying')} fetcher={getNowPlayingMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
        <InfiniteMovieSection title={t('upcoming')} fetcher={getUpcomingMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
      </div>
    </>
  );
  
  const renderTvShowsPage = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 space-y-12">
        <InfiniteTvShowSection title={t('popularTvShows')} fetcher={getPopularTvShows} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />
        <InfiniteTvShowSection title={t('topRatedTvShows')} fetcher={getTopRatedTvShows} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />
        <InfiniteTvShowSection title={t('airingToday')} fetcher={getAiringTodayTvShows} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />
    </div>
  );

  const renderSearchPage = () => {
    const noResults = !isSearching && searchQuery.trim().length > 1 && searchedMovies.length === 0 && searchedTvShows.length === 0;
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        <SearchBar searchTerm={searchQuery} setSearchTerm={setSearchQuery} />
        {isSearching && <div className="mt-8"><Loader /></div>}
        {noResults && <p className="text-center mt-8 text-slate-500 dark:text-slate-400">{t('noMoviesFound', { searchTerm: searchQuery })}</p>}
        {!isSearching && (
          <div className="mt-8 space-y-12">
            {searchedMovies.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">{t('movies')}</h2>
                <MovieGrid movies={searchedMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
              </section>
            )}
            {searchedTvShows.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">{t('tvShows')}</h2>
                <TvShowGrid tvShows={searchedTvShows} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />
              </section>
            )}
          </div>
        )}
      </div>
    );
  };
  
  const renderListPage = (type: 'favorites' | 'watchlist') => {
    const isFavorites = type === 'favorites';
    const title = isFavorites ? t('myFavorites') : t('myWatchlist');
    
    const moviesToList = isFavorites ? favoriteMovies : watchlistMovies;
    const tvShowsToList = isFavorites ? favoriteTvShows : watchlistTvShows;

    const noMovies = activeListSubTab === 'movies' && moviesToList.length === 0;
    const noTvShows = activeListSubTab === 'tvshows' && tvShowsToList.length === 0;
    const emptyMessage = isFavorites ? t('noFavorites') : t('emptyWatchlist');
    const emptyTvMessage = isFavorites ? t('noFavoriteTvShows') : t('emptyTvShowWatchlist');

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        <ListSubTabs activeTab={activeListSubTab} setActiveTab={setActiveListSubTab} />
        
        {isListLoading ? <Loader /> : (
          <>
            {activeListSubTab === 'movies' && (
              noMovies ? <p className="text-center mt-8 text-slate-500 dark:text-slate-400">{emptyMessage}</p> : 
              <MovieGrid movies={moviesToList} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
            )}
            {activeListSubTab === 'tvshows' && (
              noTvShows ? <p className="text-center mt-8 text-slate-500 dark:text-slate-400">{emptyTvMessage}</p> :
              <TvShowGrid tvShows={tvShowsToList} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />
            )}
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (viewAllConfig) {
        if(viewAllConfig.type === 'movie') {
            return <div className="pt-28"><CategoryGridPage title={viewAllConfig.title} fetcher={viewAllConfig.fetcher as any} onBack={handleBackFromViewAll} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} /></div>
        } else {
            return <div className="pt-28"><TvShowCategoryGridPage title={viewAllConfig.title} fetcher={viewAllConfig.fetcher as any} onBack={handleBackFromViewAll} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} /></div>
        }
    }
    // Fix: Add cases for new tabs to prevent showing the default page.
    switch (activeTab) {
      case 'movies': return renderMoviesPage();
      case 'tvshows': return renderTvShowsPage();
      case 'search': return renderSearchPage();
      case 'favorites': return renderListPage('favorites');
      case 'watchlist': return renderListPage('watchlist');
      case 'trending':
        return (
          <div className="text-center py-20 pt-28">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Trending Coming Soon</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">This section is under construction.</p>
          </div>
        );
      case 'live_broadcasts':
        return (
          <div className="text-center py-20 pt-28">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Live Broadcasts Coming Soon</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">This section is under construction.</p>
          </div>
        );
      default: return renderMoviesPage();
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-[#0F172A] min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header 
        theme={theme} 
        setTheme={setTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSurpriseMe={handleSurpriseMe}
        isSurpriseLoading={isSurpriseLoading}
      />
      
      <main className="pb-24 sm:pb-8">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {renderContent()}
      </main>

      <Footer />

      {selectedMovie && (
        <MovieDetailsModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
          isFavorite={favoriteIds.has(selectedMovie.id)}
          onToggleFavorite={toggleFavorite}
          isWatchlisted={watchlistIds.has(selectedMovie.id)}
          onToggleWatchlist={toggleWatchlist}
          onSelectSimilarMovie={handleSelectSimilarMovie}
          onSelectPerson={handleSelectPerson}
          playOnMount={selectedMovie.playOnMount}
        />
      )}

      {selectedTvShow && (
        <TvShowDetailsModal 
          tvShow={selectedTvShow} 
          onClose={() => setSelectedTvShow(null)}
          isFavorite={favoriteTvShowIds.has(selectedTvShow.id)}
          onToggleFavorite={toggleFavoriteTvShow}
          isWatchlisted={watchlistTvShowIds.has(selectedTvShow.id)}
          onToggleWatchlist={toggleWatchlistTvShow}
          onSelectSimilarTvShow={handleSelectSimilarTvShow}
          onSelectPerson={handleSelectPerson}
        />
      )}
      
      {(isPersonLoading && !personDetails) && <PersonDetailsModalSkeleton />}
      {personDetails && !isPersonLoading && (
        <PersonDetailsModal
          person={personDetails}
          movies={personDetails.movies}
          onClose={handleClosePersonModal}
          onSelectMovie={handleSelectMovieFromPerson}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          watchlistIds={watchlistIds}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollToTopButton />
    </div>
  );
}

export default App;
