import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Movie, Genre, TmdbApiPopularResponse, PersonDetails, TVShow, TmdbApiTvResponse } from './types';
import { 
  getPopularMovies, searchMovies, getMovieDetails, getMovieGenres, getTvGenres, 
  getNowPlayingMovies, getPersonDetails, 
  getPersonMovieCredits, getPopularTvShows,
  getTvShowDetails, searchTvShows,
  getTopRatedMovies, getUpcomingMovies, getTopRatedTvShows, getAiringTodayTvShows,
  discoverMovies,
  discoverTvShows
} from './services/tmdbService';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { Footer } from './components/Footer';
import { HeroSlider } from './components/HeroSlider';
import { MovieSlider } from './components/MovieSlider';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { BottomNavBar } from './components/BottomNavBar';
import { TvShowDetailsModal } from './components/TvShowDetailsModal';
import { useTranslation } from './contexts/LanguageContext';
import { PersonDetailsModal } from './components/PersonDetailsModal';
import { PersonDetailsModalSkeleton } from './components/PersonDetailsModalSkeleton';
import { ListSubTabs } from './components/ListSubTabs';
import { CategoryGridPage } from './components/CategoryGridPage';
import { MovieGrid } from './components/MovieGrid';
import { TvShowGrid } from './components/TvShowGrid';
import { TvShowSlider } from './components/TvShowSlider';
import { TvShowCategoryGridPage } from './components/TvShowCategoryGridPage';
import { SearchBar } from './components/SearchBar';
import { HeroSliderSkeleton } from './components/HeroSliderSkeleton';
import { MovieSliderSkeleton } from './components/MovieSliderSkeleton';
import { TvShowHeroSlider } from './components/TvShowHeroSlider';
import { DiscoverPage } from './components/DiscoverPage';
import { TrendingPage } from './components/TrendingPage';
import { SideMenu } from './components/SideMenu';
import { GenreSuggestionGrid } from './components/GenreSuggestionGrid';
import { NoResultsDisplay } from './components/NoResultsDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';

export type Theme = 'light' | 'dark';
export type ActiveTab = 'movies' | 'tvshows' | 'search' | 'favorites' | 'watchlist' | 'trending' | 'discover';
type ActiveView = 
  | { type: 'main' }
  | { type: 'view_all_movies'; title: string; fetcher: (page: number, language: string) => Promise<TmdbApiPopularResponse> }
  | { type: 'view_all_tv'; title: string; fetcher: (page: number, language: string) => Promise<TmdbApiTvResponse> };

function App() {
  const { language, t } = useTranslation();
  
  // UI State
  const [theme, setTheme] = useState<Theme>(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return 'dark';
    }
    return 'light';
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('movies');
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'main' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // Data State
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [adventureMovies, setAdventureMovies] = useState<Movie[]>([]);
  
  const [popularTvShows, setPopularTvShows] = useState<TVShow[]>([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState<TVShow[]>([]);
  const [airingTodayTvShows, setAiringTodayTvShows] = useState<TVShow[]>([]);
  const [actionAdventureTvShows, setActionAdventureTvShows] = useState<TVShow[]>([]);
  const [sciFiFantasyTvShows, setSciFiFantasyTvShows] = useState<TVShow[]>([]);
  
  // Search Page State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [searchedTvShows, setSearchedTvShows] = useState<TVShow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
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
  
  const popularGenreSuggestions = useMemo(() => {
    // Use genre IDs for language-independent filtering.
    // These IDs correspond to: Action, Comedy, Science Fiction, Horror, Romance, Animation, Drama, Thriller
    const popularGenreIds = new Set([28, 35, 878, 27, 10749, 16, 18, 53]);
    const genreOrder = [28, 35, 878, 27, 10749, 16, 18, 53];

    return movieGenres
      .filter(g => popularGenreIds.has(g.id))
      .sort((a, b) => genreOrder.indexOf(a.id) - genreOrder.indexOf(b.id)); // Maintain a consistent order
  }, [movieGenres]);

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
      const [pop, top, now, upc, movGenres, tvGen, popTv, topTv, airTv, actMov, advMov, actAdvTv, sciFiTv] = await Promise.all([
        getPopularMovies(1, language),
        getTopRatedMovies(1, language),
        getNowPlayingMovies(1, language),
        getUpcomingMovies(1, language),
        getMovieGenres(language),
        getTvGenres(language),
        getPopularTvShows(1, language),
        getTopRatedTvShows(1, language),
        getAiringTodayTvShows(1, language),
        discoverMovies(28, 1, language), // Action
        discoverMovies(12, 1, language), // Adventure
        discoverTvShows(10759, 1, language), // Action & Adventure
        discoverTvShows(10765, 1, language), // Sci-Fi & Fantasy
      ]);
      setPopularMovies(pop.results);
      setTopRatedMovies(top.results);
      setNowPlayingMovies(now.results);
      setUpcomingMovies(upc.results);
      setMovieGenres(movGenres.genres);
      setTvGenres(tvGen.genres);
      setPopularTvShows(popTv.results);
      setTopRatedTvShows(topTv.results);
      setAiringTodayTvShows(airTv.results);
      setActionMovies(actMov.results);
      setAdventureMovies(advMov.results);
      setActionAdventureTvShows(actAdvTv.results);
      setSciFiFantasyTvShows(sciFiTv.results);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [language]);
  
  useEffect(() => {
    fetchAllInitialData();
  }, [fetchAllInitialData]);

  const performSearch = useCallback(async () => {
    if (searchQuery.trim().length < 2) {
      setSearchedMovies([]);
      setSearchedTvShows([]);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const [movieResults, tvShowResults] = await Promise.all([
        searchMovies(searchQuery, 1, language),
        searchTvShows(searchQuery, 1, language)
      ]);
      setSearchedMovies(movieResults.results);
      setSearchedTvShows(tvShowResults.results);
    } catch (err) {
      const error = err as Error;
      setSearchError(error.message || t('failedToFetchDetails'));
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, language, t]);

  // Search effect with debounce
  useEffect(() => {
    if (activeTab !== 'search') return;
    
    if (searchQuery.trim().length < 2) {
      setSearchedMovies([]);
      setSearchedTvShows([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    const searchTimer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [searchQuery, activeTab, performSearch]);

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
        console.error(err);
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

  // Reset search and view all when leaving search tab
  useEffect(() => {
    if (activeTab !== 'search') {
      setSearchQuery('');
      setSearchedMovies([]);
      setSearchedTvShows([]);
      setSearchError(null);
    }
     if (activeTab !== 'movies' && activeTab !== 'tvshows') {
      setActiveView({ type: 'main' });
    }
  }, [activeTab]);

  // --- Handlers ---
  const handleViewAllMovies = (title: string, fetcher: (page: number, language: string) => Promise<TmdbApiPopularResponse>) => {
    setActiveView({ type: 'view_all_movies', title, fetcher });
  };
  const handleViewAllTvShows = (title: string, fetcher: (page: number, language: string) => Promise<TmdbApiTvResponse>) => {
    setActiveView({ type: 'view_all_tv', title, fetcher });
  };
  const handleBackFromViewAll = () => setActiveView({ type: 'main' });

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
      console.error(err);
      setSelectedMovie({ ...movie, playOnMount: options?.playTrailer });
    }
  };

  const handleSelectTvShow = async (tvShow: TVShow, options?: { playTrailer: boolean }) => {
    try {
      const details = await getTvShowDetails(tvShow.id, language);
      setSelectedTvShow({ ...details, playOnMount: options?.playTrailer });
    } catch(err) {
      console.error(err);
      setSelectedTvShow({ ...tvShow, playOnMount: options?.playTrailer }); 
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
      console.error(err);
      document.body.style.overflow = 'auto';
    } finally {
      setIsPersonLoading(false);
    }
  };
  const handleClosePersonModal = () => { setPersonDetails(null); document.body.style.overflow = 'auto'; };
  const handleSelectMovieFromPerson = (movie: Movie) => { handleClosePersonModal(); setTimeout(() => handleSelectMovie(movie), 300); };
  
  const handleSurpriseMe = async () => {
    setIsSurpriseLoading(true);
    try {
      const movieFetchers = [
        getPopularMovies,
        getTopRatedMovies,
        getNowPlayingMovies,
        getUpcomingMovies,
      ];
      const randomFetcher = movieFetchers[Math.floor(Math.random() * movieFetchers.length)];

      // Fetch first page to get total pages
      const initialData = await randomFetcher(1, language);
      const totalPages = Math.min(initialData.total_pages, 500);
      
      if (totalPages === 0) {
        throw new Error('No movies found in the selected random category.');
      }

      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      
      const data = await randomFetcher(randomPage, language);
      if (data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomMovie = data.results[randomIndex];
        await handleSelectMovie(randomMovie, { playTrailer: true });
      } else {
        throw new Error('Randomly selected page had no movies.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSurpriseLoading(false);
    }
  };

  const handleSetActiveTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsSideMenuOpen(false);
  };

  const onHeroPage = (activeTab === 'movies' || activeTab === 'tvshows') && activeView.type === 'main';

  // --- Content Rendering ---
  const renderMoviesPage = () => {
    if (activeView.type === 'view_all_movies') {
        return (
             <div className="pt-28">
                <CategoryGridPage
                    title={activeView.title}
                    fetcher={activeView.fetcher}
                    onBack={handleBackFromViewAll}
                    onSelectMovie={handleSelectMovie}
                    favoriteIds={favoriteIds}
                    onToggleFavorite={toggleFavorite}
                    watchlistIds={watchlistIds}
                    onToggleWatchlist={toggleWatchlist}
                />
            </div>
        );
    }
    
    return (
        <>
        {isLoading ? <HeroSliderSkeleton /> : <HeroSlider movies={nowPlayingMovies} onSelectMovie={handleSelectMovie} />}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {isLoading ? <MovieSliderSkeleton /> : (
                <>
                    <MovieSlider title={t('popular')} movies={popularMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} onViewAll={() => handleViewAllMovies(t('popular'), getPopularMovies)} />
                    <MovieSlider title={t('action')} movies={actionMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} onViewAll={() => handleViewAllMovies(t('action'), (page, lang) => discoverMovies(28, page, lang))} />
                    <MovieSlider title={t('topRated')} movies={topRatedMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} onViewAll={() => handleViewAllMovies(t('topRated'), getTopRatedMovies)} />
                     <MovieSlider title={t('adventure')} movies={adventureMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} onViewAll={() => handleViewAllMovies(t('adventure'), (page, lang) => discoverMovies(12, page, lang))} />
                    <MovieSlider title={t('upcoming')} movies={upcomingMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} onViewAll={() => handleViewAllMovies(t('upcoming'), getUpcomingMovies)} />
                </>
            )}
        </div>
        </>
    );
  };
  
  const renderTvShowsPage = () => {
     if (activeView.type === 'view_all_tv') {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28">
                <TvShowCategoryGridPage
                    title={activeView.title}
                    fetcher={activeView.fetcher}
                    onBack={handleBackFromViewAll}
                    onSelectTvShow={handleSelectTvShow}
                    favoriteIds={favoriteTvShowIds}
                    onToggleFavorite={toggleFavoriteTvShow}
                    watchlistIds={watchlistTvShowIds}
                    onToggleWatchlist={toggleWatchlistTvShow}
                />
            </div>
        );
    }

    return (
        <>
            {isLoading ? <HeroSliderSkeleton /> : <TvShowHeroSlider tvShows={airingTodayTvShows} onSelectTvShow={handleSelectTvShow} />}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-12">
                {isLoading ? <MovieSliderSkeleton /> : (
                    <>
                        <TvShowSlider title={t('popularTvShows')} tvShows={popularTvShows} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} onViewAll={() => handleViewAllTvShows(t('popularTvShows'), getPopularTvShows)} />
                        <TvShowSlider title={t('actionAdventure')} tvShows={actionAdventureTvShows} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} onViewAll={() => handleViewAllTvShows(t('actionAdventure'), (page, lang) => discoverTvShows(10759, page, lang))} />
                        <TvShowSlider title={t('topRatedTvShows')} tvShows={topRatedTvShows} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} onViewAll={() => handleViewAllTvShows(t('topRatedTvShows'), getTopRatedTvShows)} />
                        <TvShowSlider title={t('sciFiFantasy')} tvShows={sciFiFantasyTvShows} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} onViewAll={() => handleViewAllTvShows(t('sciFiFantasy'), (page, lang) => discoverTvShows(10765, page, lang))} />
                    </>
                )}
            </div>
        </>
    );
  };

  const renderSearchPage = () => {
    const hasSearchQuery = searchQuery.trim().length > 1;
    const hasResults = searchedMovies.length > 0 || searchedTvShows.length > 0;
    const noResultsFound = hasSearchQuery && !isSearching && !hasResults && !searchError;
    const showInitialState = !searchQuery.trim() && !isSearching && !hasResults;

    const handleGenreSuggestionClick = (genreName: string) => {
        setSearchQuery(genreName);
    };

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-3xl mx-auto">
            <SearchBar searchTerm={searchQuery} setSearchTerm={setSearchQuery} />
            
            {showInitialState && (
                <div className="text-center mt-12 animate-fade-in">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('findYourNextFavorite')}</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">{t('exploreThousandsOfTitles')}</p>
                    <GenreSuggestionGrid genres={popularGenreSuggestions} onGenreClick={handleGenreSuggestionClick} />
                </div>
            )}
            
            {isSearching && <div className="mt-8"><Loader /></div>}

            {searchError && <div className="mt-8"><ErrorDisplay message={searchError} onRetry={performSearch} /></div>}
            
            {noResultsFound && (
                <NoResultsDisplay 
                    query={searchQuery} 
                    onDiscoverClick={() => setActiveTab('discover')} 
                />
            )}
            
            {hasResults && !isSearching && (
              <div className="mt-8 space-y-12 animate-fade-in">
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
        <style>{`
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
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

  const renderDiscoverPage = () => {
    return (
      <DiscoverPage
        movieGenres={movieGenres}
        tvGenres={tvGenres}
        onSelectMovie={handleSelectMovie}
        onSelectTvShow={handleSelectTvShow}
        favoriteMovieIds={favoriteIds}
        onToggleFavoriteMovie={toggleFavorite}
        watchlistMovieIds={watchlistIds}
        onToggleWatchlistMovie={toggleWatchlist}
        favoriteTvShowIds={favoriteTvShowIds}
        onToggleFavoriteTvShow={toggleFavoriteTvShow}
        watchlistTvShowIds={watchlistTvShowIds}
        onToggleWatchlistTvShow={toggleWatchlistTvShow}
      />
    );
  };

  const renderTrendingPage = () => {
    return (
      <TrendingPage
        onSelectMovie={handleSelectMovie}
        onSelectTvShow={handleSelectTvShow}
        favoriteMovieIds={favoriteIds}
        onToggleFavoriteMovie={toggleFavorite}
        watchlistMovieIds={watchlistIds}
        onToggleWatchlistMovie={toggleWatchlist}
        favoriteTvShowIds={favoriteTvShowIds}
        onToggleFavoriteTvShow={toggleFavoriteTvShow}
        watchlistTvShowIds={watchlistTvShowIds}
        onToggleWatchlistTvShow={toggleWatchlistTvShow}
      />
    );
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'movies': return renderMoviesPage();
      case 'tvshows': return renderTvShowsPage();
      case 'discover': return renderDiscoverPage();
      case 'trending': return renderTrendingPage();
      case 'search': return renderSearchPage();
      case 'favorites': return renderListPage('favorites');
      case 'watchlist': return renderListPage('watchlist');
      default: return renderMoviesPage();
    }
  };

  const backgroundPattern = "dark:bg-[url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3e%3cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%231e293b' fill-opacity='0.3'/%3e%3c/svg%3e\")]";
  const initialLoadFailed = error && !isLoading && popularMovies.length === 0 && popularTvShows.length === 0;

  return (
    <div className={`bg-slate-100 dark:bg-[#0F172A] min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300 ${backgroundPattern}`}>
      <Header 
        theme={theme} 
        setTheme={setTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSurpriseMe={handleSurpriseMe}
        isSurpriseLoading={isSurpriseLoading}
        onHeroPage={onHeroPage}
        onMenuClick={() => setIsSideMenuOpen(true)}
      />

      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
      />
      
      <main className="pb-24 sm:pb-8">
        {initialLoadFailed ? (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28">
            <ErrorDisplay message={error} onRetry={fetchAllInitialData} />
          </div>
        ) : (
          renderContent()
        )}
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
          playOnMount={selectedTvShow.playOnMount}
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
