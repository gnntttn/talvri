import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Movie, Genre, TmdbApiPopularResponse, PersonDetails, TVShow, TmdbApiTvResponse, Person } from './types';
import { 
  getPopularMovies, getMovieDetails, getMovieGenres, getTvGenres, 
  getNowPlayingMovies, getPersonDetails, 
  getPersonMovieCredits, getPopularTvShows,
  getTvShowDetails, 
  getTopRatedMovies, getUpcomingMovies, getTopRatedTvShows, getAiringTodayTvShows,
  discoverMovies,
  discoverTvShows,
  getPopularPeople,
  getPersonTvCredits,
  searchMulti,
  getCollectionDetails
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
import { MovieGrid, PeopleGrid } from './components/MovieGrid';
import { TvShowGrid } from './components/TvShowGrid';
import { TvShowSlider } from './components/TvShowSlider';
import { TvShowCategoryGridPage } from './components/TvShowCategoryGridPage';
import { HeroSliderSkeleton } from './components/HeroSliderSkeleton';
import { MovieSliderSkeleton } from './components/MovieSliderSkeleton';
import { TvShowHeroSlider } from './components/TvShowHeroSlider';
import { DiscoverPage } from './components/DiscoverPage';
import { TrendingPage } from './components/TrendingPage';
import { SideMenu } from './components/SideMenu';
import { GenreSuggestionGrid } from './components/GenreSuggestionGrid';
import { NoResultsDisplay } from './components/NoResultsDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { InfinitePeopleSection } from './components/InfiniteMovieSection';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';

export type Theme = 'light' | 'dark';
export type ActiveTab = 'movies' | 'tvshows' | 'people' | 'search' | 'favorites' | 'watchlist' | 'trending' | 'discover';
export type MobileActiveTab = 'home' | 'discover' | 'my_lists' | 'profile';

type ActiveView = 
  | { type: 'main' }
  | { type: 'view_all_movies'; title: string; fetcher: (page: number, language: string) => Promise<TmdbApiPopularResponse> }
  | { type: 'view_all_tv'; title: string; fetcher: (page: number, language: string) => Promise<TmdbApiTvResponse> };

function App() {
  const { language, t } = useTranslation();
  
  // UI State
    const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileActiveTab>('home');
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'main' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth >= 1024);

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
  const [searchedPeople, setSearchedPeople] = useState<Person[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Modal State
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTvShow, setSelectedTvShow] = useState<TVShow | null>(null);
  const [personDetails, setPersonDetails] = useState<(PersonDetails & { movie_credits: Movie[], tv_credits: TVShow[] }) | null>(null);
  const [isPersonLoading, setIsPersonLoading] = useState(false);
  
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
    const popularGenreIds = new Set([28, 35, 878, 27, 10749, 16, 18, 53]);
    const genreOrder = [28, 35, 878, 27, 10749, 16, 18, 53];
    return movieGenres.filter(g => popularGenreIds.has(g.id)).sort((a, b) => genreOrder.indexOf(a.id) - genreOrder.indexOf(b.id));
  }, [movieGenres]);

  // --- Effects ---

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => setIsDesktopView(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        getPopularMovies(1, language), getTopRatedMovies(1, language), getNowPlayingMovies(1, language), getUpcomingMovies(1, language),
        getMovieGenres(language), getTvGenres(language),
        getPopularTvShows(1, language), getTopRatedTvShows(1, language), getAiringTodayTvShows(1, language),
        discoverMovies(28, 1, language), discoverMovies(12, 1, language),
        discoverTvShows(10759, 1, language), discoverTvShows(10765, 1, language),
      ]);
      setPopularMovies(pop.results); setTopRatedMovies(top.results); setNowPlayingMovies(now.results); setUpcomingMovies(upc.results);
      setMovieGenres(movGenres.genres); setTvGenres(tvGen.genres);
      setPopularTvShows(popTv.results); setTopRatedTvShows(topTv.results); setAiringTodayTvShows(airTv.results);
      setActionMovies(actMov.results); setAdventureMovies(advMov.results);
      setActionAdventureTvShows(actAdvTv.results); setSciFiFantasyTvShows(sciFiTv.results);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [language]);
  
  useEffect(() => { fetchAllInitialData(); }, [fetchAllInitialData]);

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
    const isSearchActive = activeTab === 'search' || (!isDesktopView && mobileActiveTab === 'discover');
    if (!isSearchActive || searchQuery.trim().length < 2) {
      if (searchQuery.trim().length === 0) {
        setSearchedMovies([]); setSearchedTvShows([]); setSearchedPeople([]); setIsSearching(false); setSearchError(null);
      }
      return;
    }
    const timer = setTimeout(() => performSearch(), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, mobileActiveTab, isDesktopView, performSearch]);

  useEffect(() => {
    const fetchListDetails = async (movieIds: Set<number>, tvShowIds: Set<number>, type: 'favorites' | 'watchlist') => {
      setIsListLoading(true);
      try {
        const [movieDetails, tvShowDetails] = await Promise.all([
          Promise.all(Array.from(movieIds).map(id => getMovieDetails(id, language))),
          Promise.all(Array.from(tvShowIds).map(id => getTvShowDetails(id, language)))
        ]);
        if (type === 'favorites') { setFavoriteMovies(movieDetails); setFavoriteTvShows(tvShowDetails); }
        else { setWatchlistMovies(movieDetails); setWatchlistTvShows(tvShowDetails); }
      } catch (err) {
        setError(t('failedToFetchList'));
      } finally {
        setIsListLoading(false);
      }
    };
    if (activeTab === 'favorites' || activeTab === 'watchlist' || (!isDesktopView && mobileActiveTab === 'my_lists')) {
      setActiveListSubTab('movies');
      fetchListDetails(favoriteIds, favoriteTvShowIds, 'favorites');
      fetchListDetails(watchlistIds, watchlistTvShowIds, 'watchlist');
    }
  }, [activeTab, mobileActiveTab, isDesktopView, favoriteIds, watchlistIds, favoriteTvShowIds, watchlistTvShowIds, language, t]);

  useEffect(() => {
    if (activeTab !== 'search') {
      setSearchQuery('');
    }
    if (activeTab !== 'movies' && activeTab !== 'tvshows') {
      setActiveView({ type: 'main' });
    }
  }, [activeTab]);
  
  useEffect(() => {
      if(searchQuery.length > 0) setActiveTab('search');
  }, [searchQuery]);

  // --- Handlers ---
  const handleViewAllMovies = (title: string, fetcher: (page: number, language: string) => Promise<TmdbApiPopularResponse>) => setActiveView({ type: 'view_all_movies', title, fetcher });
  const handleViewAllTvShows = (title: string, fetcher: (page: number, language: string) => Promise<TmdbApiTvResponse>) => setActiveView({ type: 'view_all_tv', title, fetcher });
  const handleBackFromViewAll = () => setActiveView({ type: 'main' });

  const toggleFavorite = (movie: Movie) => { const ids = new Set(favoriteIds); if (ids.has(movie.id)) ids.delete(movie.id); else ids.add(movie.id); setFavoriteIds(ids); localStorage.setItem('favoriteMovies', JSON.stringify(Array.from(ids))); };
  const toggleWatchlist = (movie: Movie) => { const ids = new Set(watchlistIds); if (ids.has(movie.id)) ids.delete(movie.id); else ids.add(movie.id); setWatchlistIds(ids); localStorage.setItem('watchlistMovies', JSON.stringify(Array.from(ids))); };
  const toggleFavoriteTvShow = (tv: TVShow) => { const ids = new Set(favoriteTvShowIds); if (ids.has(tv.id)) ids.delete(tv.id); else ids.add(tv.id); setFavoriteTvShowIds(ids); localStorage.setItem('favoriteTvShows', JSON.stringify(Array.from(ids))); };
  const toggleWatchlistTvShow = (tv: TVShow) => { const ids = new Set(watchlistTvShowIds); if (ids.has(tv.id)) ids.delete(tv.id); else ids.add(tv.id); setWatchlistTvShowIds(ids); localStorage.setItem('watchlistTvShows', JSON.stringify(Array.from(ids))); };

  const handleSelectMovie = async (movie: Movie, options?: { playTrailer: boolean }) => {
    try {
      setSelectedMovie({ ...movie, playOnMount: !!options?.playTrailer }); // Show basic info immediately
      const detailedMovie = await getMovieDetails(movie.id, language);
      if (detailedMovie.belongs_to_collection) {
        const collectionDetails = await getCollectionDetails(detailedMovie.belongs_to_collection.id, language);
        detailedMovie.collection = collectionDetails;
      }
      setSelectedMovie({ ...detailedMovie, playOnMount: !!options?.playTrailer });
    } catch (err) {
      setError(t('failedToFetchDetails'));
      console.error(err);
    }
  };

  const handleSelectTvShow = async (tvShow: TVShow, options?: { playTrailer: boolean }) => {
    try {
      setSelectedTvShow({ ...tvShow, playOnMount: !!options?.playTrailer }); // Show basic info immediately
      const detailedTvShow = await getTvShowDetails(tvShow.id, language);
      setSelectedTvShow({ ...detailedTvShow, playOnMount: !!options?.playTrailer });
    } catch (err) {
      setError(t('failedToFetchDetails'));
      console.error(err);
    }
  };

  const handleSelectPerson = async (personId: number) => {
    setIsPersonLoading(true);
    setPersonDetails(null);
    try {
      const [details, movieCredits, tvCredits] = await Promise.all([
        getPersonDetails(personId, language),
        getPersonMovieCredits(personId, language),
        getPersonTvCredits(personId, language)
      ]);
      const uniqueMovieCredits = Array.from(new Map([...movieCredits.cast, ...movieCredits.crew].map(item => [item.id, item])).values())
        .sort((a,b) => b.popularity - a.popularity);
      const uniqueTvCredits = Array.from(new Map([...tvCredits.cast, ...tvCredits.crew].map(item => [item.id, item])).values())
        .sort((a,b) => b.popularity - a.popularity);
      
      setPersonDetails({ ...details, movie_credits: uniqueMovieCredits, tv_credits: uniqueTvCredits });
    } catch (err) {
      setError(t('failedToFetchDetails'));
      console.error(err);
    } finally {
      setIsPersonLoading(false);
    }
  };

  const renderMainContent = () => {
    if (error && !isLoading) return <ErrorDisplay message={error} onRetry={fetchAllInitialData} />;

    const moviesPageContent = () => (
      <>
        {isLoading ? <HeroSliderSkeleton /> : <HeroSlider movies={popularMovies.slice(0, 10)} onSelectMovie={handleSelectMovie} />}
        <div className="space-y-4 md:space-y-8 lg:space-y-12 mt-8">
          {isLoading ? <MovieSliderSkeleton /> : <MovieSlider title={t('nowPlaying')} movies={nowPlayingMovies} onSelectMovie={handleSelectMovie} onViewAll={() => handleViewAllMovies(t('nowPlaying'), getNowPlayingMovies)} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />}
          {isLoading ? <MovieSliderSkeleton /> : <MovieSlider title={t('topRated')} movies={topRatedMovies} onSelectMovie={handleSelectMovie} onViewAll={() => handleViewAllMovies(t('topRated'), getTopRatedMovies)} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />}
          {isLoading ? <MovieSliderSkeleton /> : <MovieSlider title={t('upcoming')} movies={upcomingMovies} onSelectMovie={handleSelectMovie} onViewAll={() => handleViewAllMovies(t('upcoming'), getUpcomingMovies)} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />}
          {isLoading ? <MovieSliderSkeleton /> : <MovieSlider title={t('action')} movies={actionMovies} onSelectMovie={handleSelectMovie} onViewAll={() => handleViewAllMovies(t('action'), (page, lang) => discoverMovies(28, page, lang))} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />}
          {isLoading ? <MovieSliderSkeleton /> : <MovieSlider title={t('adventure')} movies={adventureMovies} onSelectMovie={handleSelectMovie} onViewAll={() => handleViewAllMovies(t('adventure'), (page, lang) => discoverMovies(12, page, lang))} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />}
        </div>
      </>
    );

    const tvShowsPageContent = () => (
      <>
        {isLoading ? <HeroSliderSkeleton /> : <TvShowHeroSlider tvShows={popularTvShows.slice(0, 10)} onSelectTvShow={handleSelectTvShow} />}
        <div className="space-y-4 md:space-y-8 lg:space-y-12 mt-8">
            {isLoading ? <MovieSliderSkeleton /> : <TvShowSlider title={t('popularTvShows')} tvShows={popularTvShows} onSelectTvShow={handleSelectTvShow} onViewAll={() => handleViewAllTvShows(t('popularTvShows'), getPopularTvShows)} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />}
            {isLoading ? <MovieSliderSkeleton /> : <TvShowSlider title={t('topRatedTvShows')} tvShows={topRatedTvShows} onSelectTvShow={handleSelectTvShow} onViewAll={() => handleViewAllTvShows(t('topRatedTvShows'), getTopRatedTvShows)} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />}
            {isLoading ? <MovieSliderSkeleton /> : <TvShowSlider title={t('airingToday')} tvShows={airingTodayTvShows} onSelectTvShow={handleSelectTvShow} onViewAll={() => handleViewAllTvShows(t('airingToday'), getAiringTodayTvShows)} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />}
            {isLoading ? <MovieSliderSkeleton /> : <TvShowSlider title={t('actionAdventure')} tvShows={actionAdventureTvShows} onSelectTvShow={handleSelectTvShow} onViewAll={() => handleViewAllTvShows(t('actionAdventure'), (page, lang) => discoverTvShows(10759, page, lang))} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />}
            {isLoading ? <MovieSliderSkeleton /> : <TvShowSlider title={t('sciFiFantasy')} tvShows={sciFiFantasyTvShows} onSelectTvShow={handleSelectTvShow} onViewAll={() => handleViewAllTvShows(t('sciFiFantasy'), (page, lang) => discoverTvShows(10765, page, lang))} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />}
        </div>
      </>
    );

    const peoplePageContent = () => (
      <div className="py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t('popularPeople')}</h2>
        <InfinitePeopleSection fetcher={getPopularPeople} onSelectPerson={handleSelectPerson} />
      </div>
    );
    
    const searchPageContent = () => (
      <div className="min-h-screen">
          {searchError && <ErrorDisplay message={searchError} onRetry={performSearch} />}
          {isSearching && searchQuery.length > 0 && searchedMovies.length === 0 && searchedTvShows.length === 0 && searchedPeople.length === 0 && <Loader />}
          {!isSearching && searchQuery.length > 2 && searchedMovies.length === 0 && searchedTvShows.length === 0 && searchedPeople.length === 0 && !searchError && (
              <NoResultsDisplay query={searchQuery} onDiscoverClick={() => { setActiveTab('discover'); setSearchQuery('')} } />
          )}
          
          {searchQuery.length === 0 && (
            <div className="text-center pt-8 md:pt-16">
              <h1 className="text-4xl font-bold mb-2">{t('findYourNextFavorite')}</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-8">{t('exploreThousandsOfTitles')}</p>
              <GenreSuggestionGrid genres={popularGenreSuggestions} onGenreClick={(genreName) => setSearchQuery(genreName)} />
            </div>
          )}

          {searchedMovies.length > 0 && <section className="mb-12"><h2 className="text-2xl font-bold mb-4">{t('movies')}</h2><MovieGrid movies={searchedMovies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} /></section>}
          {searchedTvShows.length > 0 && <section className="mb-12"><h2 className="text-2xl font-bold mb-4">{t('tvShows')}</h2><TvShowGrid tvShows={searchedTvShows} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} /></section>}
          {searchedPeople.length > 0 && <section className="mb-12"><h2 className="text-2xl font-bold mb-4">{t('people')}</h2><PeopleGrid people={searchedPeople} onSelectPerson={handleSelectPerson} /></section>}
      </div>
    );
    
    const listsPageContent = (listType: 'favorites' | 'watchlist') => {
        const movies = listType === 'favorites' ? favoriteMovies : watchlistMovies;
        const tvShows = listType === 'favorites' ? favoriteTvShows : watchlistTvShows;
        const noMovies = movies.length === 0;
        const noTvShows = tvShows.length === 0;
        const noMoviesMsg = listType === 'favorites' ? t('noFavorites') : t('emptyWatchlist');
        const noTvShowsMsg = listType === 'favorites' ? t('noFavoriteTvShows') : t('emptyTvShowWatchlist');

        return (
            <div className="min-h-screen py-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{listType === 'favorites' ? t('myFavorites') : t('myWatchlist')}</h2>
                <ListSubTabs activeTab={activeListSubTab} setActiveTab={setActiveListSubTab} />
                {isListLoading ? <Loader /> : (
                    <>
                        {activeListSubTab === 'movies' && (noMovies ? <p className="text-center text-slate-500">{noMoviesMsg}</p> : <MovieGrid movies={movies} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />)}
                        {activeListSubTab === 'tvshows' && (noTvShows ? <p className="text-center text-slate-500">{noTvShowsMsg}</p> : <TvShowGrid tvShows={tvShows} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />)}
                    </>
                )}
            </div>
        );
    };
    
    let currentTab: ActiveTab = isDesktopView ? activeTab : 'movies'; // Default for mobile's "home"
    if (!isDesktopView) {
        if (mobileActiveTab === 'home') {
            currentTab = 'movies';
            if (activeView.type !== 'main') handleBackFromViewAll();
        }
        else if (mobileActiveTab === 'discover') currentTab = 'search';
        else if (mobileActiveTab === 'my_lists') currentTab = 'watchlist'; // Or favorites, just needs to trigger the list view
        else if (mobileActiveTab === 'profile') currentTab = 'people';
    }
    
    if (activeView.type === 'view_all_movies') return <CategoryGridPage title={activeView.title} fetcher={activeView.fetcher} onBack={handleBackFromViewAll} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />;
    if (activeView.type === 'view_all_tv') return <TvShowCategoryGridPage title={activeView.title} fetcher={activeView.fetcher} onBack={handleBackFromViewAll} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />;

    switch (currentTab) {
      case 'movies': return moviesPageContent();
      case 'tvshows': return tvShowsPageContent();
      case 'people': return peoplePageContent();
      case 'search': return searchPageContent();
      case 'favorites': return listsPageContent('favorites');
      case 'watchlist': return listsPageContent('watchlist');
      case 'trending': return <TrendingPage onSelectMovie={handleSelectMovie} onSelectTvShow={handleSelectTvShow} favoriteMovieIds={favoriteIds} onToggleFavoriteMovie={toggleFavorite} watchlistMovieIds={watchlistIds} onToggleWatchlistMovie={toggleWatchlist} favoriteTvShowIds={favoriteTvShowIds} onToggleFavoriteTvShow={toggleFavoriteTvShow} watchlistTvShowIds={watchlistTvShowIds} onToggleWatchlistTvShow={toggleWatchlistTvShow} />;
      case 'discover': return <DiscoverPage movieGenres={movieGenres} tvGenres={tvGenres} onSelectMovie={handleSelectMovie} onSelectTvShow={handleSelectTvShow} favoriteMovieIds={favoriteIds} onToggleFavoriteMovie={toggleFavorite} watchlistMovieIds={watchlistIds} onToggleWatchlistMovie={toggleWatchlist} favoriteTvShowIds={favoriteTvShowIds} onToggleFavoriteTvShow={toggleFavoriteTvShow} watchlistTvShowIds={watchlistTvShowIds} onToggleWatchlistTvShow={toggleWatchlistTvShow} />;
      default: return moviesPageContent();
    }
  };

  return (
    <>
      <div className="app-container">
        {isDesktopView && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
        
        <div className="content-wrapper">
          {isDesktopView ? (
            <TopBar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              theme={theme}
              setTheme={setTheme}
            />
          ) : (
            <Header onMenuClick={() => setIsSideMenuOpen(true)} />
          )}
          
          <main className="main-content">
            {renderMainContent()}
          </main>
          
          {isDesktopView && <Footer />}
        </div>
        
        <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />
        {!isDesktopView && <BottomNavBar activeTab={mobileActiveTab} setActiveTab={setMobileActiveTab} />}
      </div>

      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFavorite={favoriteIds.has(selectedMovie.id)}
          onToggleFavorite={toggleFavorite}
          isWatchlisted={watchlistIds.has(selectedMovie.id)}
          onToggleWatchlist={toggleWatchlist}
          onSelectSimilarMovie={handleSelectMovie}
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
          onSelectSimilarTvShow={handleSelectTvShow}
          onSelectPerson={handleSelectPerson}
          playOnMount={selectedTvShow.playOnMount}
        />
      )}

      {(isPersonLoading || personDetails) && (
        isPersonLoading ? <PersonDetailsModalSkeleton /> : personDetails && (
          <PersonDetailsModal
            person={personDetails}
            movie_credits={personDetails.movie_credits}
            tv_credits={personDetails.tv_credits}
            onClose={() => setPersonDetails(null)}
            onSelectMovie={handleSelectMovie}
            onSelectTvShow={handleSelectTvShow}
            favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist}
            favoriteTvShowIds={favoriteTvShowIds} onToggleFavoriteTvShow={toggleFavoriteTvShow} watchlistTvShowIds={watchlistTvShowIds} onToggleWatchlistTvShow={toggleWatchlistTvShow}
          />
        )
      )}

      <ScrollToTopButton />
    </>
  );
}

export default App;