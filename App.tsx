import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Movie, Genre, TmdbApiPopularResponse, PersonDetails, TVShow, TmdbApiTvResponse } from './types';
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
  getCollectionDetails
} from './services/tmdbService';
import { Header } from './components/Header';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { Footer } from './components/Footer';
import { HeroSlider } from './components/HeroSlider';
import { MovieSlider } from './components/MovieSlider';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { TvShowDetailsModal } from './components/TvShowDetailsModal';
import { useTranslation } from './contexts/LanguageContext';
import { PersonDetailsModal } from './components/PersonDetailsModal';
import { PersonDetailsModalSkeleton } from './components/PersonDetailsModalSkeleton';
import { CategoryGridPage } from './components/CategoryGridPage';
import { TvShowCategoryGridPage } from './components/TvShowCategoryGridPage';
import { HeroSliderSkeleton } from './components/HeroSliderSkeleton';
import { MovieSliderSkeleton } from './components/MovieSliderSkeleton';
import { TvShowHeroSlider } from './components/TvShowHeroSlider';
import { DiscoverPage } from './components/DiscoverPage';
import { TrendingPage } from './components/TrendingPage';
import { SideMenu } from './components/SideMenu';
import { ErrorDisplay } from './components/ErrorDisplay';
import { InfinitePeopleSection } from './components/InfiniteMovieSection';
import { MovieGenrePage } from './components/MovieGenrePage';
import { MyLibraryPage } from './components/MyLibraryPage';
import { TvShowSlider } from './components/TvShowSlider';
import { SearchModal } from './components/SearchModal';

export type Theme = 'light' | 'dark';
// FIX: Add 'search' for search-related components and export MobileActiveTab for BottomNavBar.
export type ActiveTab = 'movies' | 'tvshows' | 'people' | 'my_library' | 'trending' | 'discover' | 'search';
export type MobileActiveTab = 'home' | 'discover' | 'my_library' | 'profile';

type ActiveView = 
  | { type: 'main' }
  | { type: 'view_all_movies'; title: string; fetcher: (page: number, language: string) => Promise<TmdbApiPopularResponse> }
  | { type: 'view_all_tv'; title: string; fetcher: (page: number, language: string) => Promise<TmdbApiTvResponse> }
  | { type: 'view_all_genre'; genre: Genre };

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
  const [activeTab, setActiveTab] = useState<ActiveTab>('movies');
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'main' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    
  // Modal State
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTvShow, setSelectedTvShow] = useState<TVShow | null>(null);
  const [personDetails, setPersonDetails] = useState<(PersonDetails & { movie_credits: Movie[], tv_credits: TVShow[] }) | null>(null);
  const [isPersonLoading, setIsPersonLoading] = useState(false);
  
  // User Lists State
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [favoriteTvShowIds, setFavoriteTvShowIds] = useState<Set<number>>(new Set());
  const [watchlistTvShowIds, setWatchlistTvShowIds] = useState<Set<number>>(new Set());
  const [favoriteTvShows, setFavoriteTvShows] = useState<TVShow[]>([]);
  const [watchlistTvShows, setWatchlistTvShows] = useState<TVShow[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  
  // --- Effects ---

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
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
    if (activeTab === 'my_library') {
      fetchListDetails(favoriteIds, favoriteTvShowIds, 'favorites');
      fetchListDetails(watchlistIds, watchlistTvShowIds, 'watchlist');
    }
  }, [activeTab, favoriteIds, watchlistIds, favoriteTvShowIds, watchlistTvShowIds, language, t]);

  useEffect(() => {
    if (activeTab !== 'movies' && activeTab !== 'tvshows') {
      setActiveView({ type: 'main' });
    }
  }, [activeTab]);
  
  // --- Handlers ---
  const handleViewAllMovies = (title: string, fetcher: (page: number, language: string) => Promise<TmdbApiPopularResponse>) => setActiveView({ type: 'view_all_movies', title, fetcher });
  const handleViewAllTvShows = (title: string, fetcher: (page: number, language: string) => Promise<TmdbApiTvResponse>) => setActiveView({ type: 'view_all_tv', title, fetcher });
  const handleViewAllGenre = (genre: Genre) => setActiveView({ type: 'view_all_genre', genre });
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
  
  const handleItemSelectionAndCloseModals = (selectionFn: () => void) => {
    setIsSearchOpen(false);
    selectionFn();
  };

  const renderMainContent = () => {
    if (error && !isLoading) return <ErrorDisplay message={error} onRetry={fetchAllInitialData} />;

    const actionGenre = useMemo(() => movieGenres.find(g => g.id === 28), [movieGenres]);
    const adventureGenre = useMemo(() => movieGenres.find(g => g.id === 12), [movieGenres]);
    
    const moviesPageContent = () => (
      <>
        {isLoading ? <HeroSliderSkeleton /> : <HeroSlider movies={popularMovies.slice(0, 10)} onSelectMovie={handleSelectMovie} />}
        <div className="space-y-4 md:space-y-8 lg:space-y-12 mt-8">
          {isLoading ? <MovieSliderSkeleton /> : <MovieSlider title={t('nowPlaying')} movies={nowPlayingMovies} onSelectMovie={handleSelectMovie} onViewAll={() => handleViewAllMovies(t('nowPlaying'), getNowPlayingMovies)} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />}
          {isLoading ? <MovieSliderSkeleton /> : <MovieSlider title={t('topRated')} movies={topRatedMovies} onSelectMovie={handleSelectMovie} onViewAll={() => handleViewAllMovies(t('topRated'), getTopRatedMovies)} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />}
          {isLoading ? <MovieSliderSkeleton /> : <MovieSlider title={t('upcoming')} movies={upcomingMovies} onSelectMovie={handleSelectMovie} onViewAll={() => handleViewAllMovies(t('upcoming'), getUpcomingMovies)} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />}
          {isLoading ? <MovieSliderSkeleton /> : <MovieSlider title={t('action')} movies={actionMovies} onSelectMovie={handleSelectMovie} onViewAll={() => actionGenre && handleViewAllGenre(actionGenre)} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />}
          {isLoading ? <MovieSliderSkeleton /> : <MovieSlider title={t('adventure')} movies={adventureMovies} onSelectMovie={handleSelectMovie} onViewAll={() => adventureGenre && handleViewAllGenre(adventureGenre)} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />}
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
        
    if (activeView.type === 'view_all_movies') return <CategoryGridPage title={activeView.title} fetcher={activeView.fetcher} onBack={handleBackFromViewAll} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />;
    if (activeView.type === 'view_all_tv') return <TvShowCategoryGridPage title={activeView.title} fetcher={activeView.fetcher} onBack={handleBackFromViewAll} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />;
    if (activeView.type === 'view_all_genre') return <MovieGenrePage genre={activeView.genre} onBack={handleBackFromViewAll} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />;

    switch (activeTab) {
      case 'movies': return moviesPageContent();
      case 'tvshows': return tvShowsPageContent();
      case 'people': return peoplePageContent();
      case 'my_library': return (
        <MyLibraryPage
          favoriteMovies={favoriteMovies}
          watchlistMovies={watchlistMovies}
          favoriteTvShows={favoriteTvShows}
          watchlistTvShows={watchlistTvShows}
          isListLoading={isListLoading}
          onSelectMovie={handleSelectMovie}
          onSelectTvShow={handleSelectTvShow}
          favoriteIds={favoriteIds}
          watchlistIds={watchlistIds}
          favoriteTvShowIds={favoriteTvShowIds}
          watchlistTvShowIds={watchlistTvShowIds}
          onToggleFavorite={toggleFavorite}
          onToggleWatchlist={toggleWatchlist}
          onToggleFavoriteTvShow={toggleFavoriteTvShow}
          onToggleWatchlistTvShow={toggleWatchlistTvShow}
        />
      );
      case 'trending': return <TrendingPage onSelectMovie={handleSelectMovie} onSelectTvShow={handleSelectTvShow} favoriteMovieIds={favoriteIds} onToggleFavoriteMovie={toggleFavorite} watchlistMovieIds={watchlistIds} onToggleWatchlistMovie={toggleWatchlist} favoriteTvShowIds={favoriteTvShowIds} onToggleFavoriteTvShow={toggleFavoriteTvShow} watchlistTvShowIds={watchlistTvShowIds} onToggleWatchlistTvShow={toggleWatchlistTvShow} />;
      case 'discover': return <DiscoverPage movieGenres={movieGenres} tvGenres={tvGenres} onSelectMovie={handleSelectMovie} onSelectTvShow={handleSelectTvShow} favoriteMovieIds={favoriteIds} onToggleFavoriteMovie={toggleFavorite} watchlistMovieIds={watchlistIds} onToggleWatchlistMovie={toggleWatchlist} favoriteTvShowIds={favoriteTvShowIds} onToggleFavoriteTvShow={toggleFavoriteTvShow} watchlistTvShowIds={watchlistTvShowIds} onToggleWatchlistTvShow={toggleWatchlistTvShow} />;
      default: return moviesPageContent();
    }
  };

  return (
    <>
      <Header 
        onMenuClick={() => setIsSideMenuOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
        theme={theme}
        setTheme={setTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main className="main-content">
        {renderMainContent()}
      </main>
      
      <Footer />
      
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        popularMovieGenres={movieGenres.slice(0, 8)}
        onSelectMovie={(movie, options) => handleItemSelectionAndCloseModals(() => handleSelectMovie(movie, options))}
        onSelectTvShow={(tvShow, options) => handleItemSelectionAndCloseModals(() => handleSelectTvShow(tvShow, options))}
        onSelectPerson={(personId) => handleItemSelectionAndCloseModals(() => handleSelectPerson(personId))}
        favoriteMovieIds={favoriteIds}
        onToggleFavoriteMovie={toggleFavorite}
        watchlistMovieIds={watchlistIds}
        onToggleWatchlistMovie={toggleWatchlist}
        favoriteTvShowIds={favoriteTvShowIds}
        onToggleFavoriteTvShow={toggleFavoriteTvShow}
        watchlistTvShowIds={watchlistTvShowIds}
        onToggleWatchlistTvShow={toggleWatchlistTvShow}
      />

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