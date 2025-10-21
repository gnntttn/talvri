import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Movie, Genre, TmdbApiPopularResponse, PersonDetails, TVShow, TmdbApiTvResponse } from './types';
import { getPopularMovies, searchMovies, getMovieDetails, getMovieGenres, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies, getPersonDetails, getPersonMovieCredits, getPopularTvShows, getTopRatedTvShows, getAiringTodayTvShows, getTvShowDetails, getSimilarTvShows } from './services/tmdbService';
import { Header } from './components/Header';
import { MovieGrid } from './components/MovieGrid';
import { Loader } from './components/Loader';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { Footer } from './components/Footer';
import { MovieGridSkeleton } from './components/MovieGridSkeleton';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { SearchFilters } from './components/SearchFilters';
import { BottomNavBar } from './components/BottomNavBar';
import { MovieSlider } from './components/MovieSlider';
import { MovieSliderSkeleton } from './components/MovieSliderSkeleton';
import { SearchBar } from './components/SearchBar';
import { useTranslation } from './contexts/LanguageContext';
import { CategoryGridPage } from './components/CategoryGridPage';
import { HeroSlider } from './components/HeroSlider';
import { HeroSliderSkeleton } from './components/HeroSliderSkeleton';
import { PersonDetailsModal } from './components/PersonDetailsModal';
import { PersonDetailsModalSkeleton } from './components/PersonDetailsModalSkeleton';
import { TvShowSlider } from './components/TvShowSlider';
import { TvShowDetailsModal } from './components/TvShowDetailsModal';
import { DesktopNav } from './components/DesktopNav';
import { TvShowCategoryGridPage } from './components/TvShowCategoryGridPage';
import { ListSubTabs } from './components/ListSubTabs';
import { TvShowGrid } from './components/TvShowGrid';


export type Theme = 'light' | 'dark';
export type ActiveTab = 'movies' | 'tvshows' | 'search' | 'favorites' | 'watchlist';

function App() {
  const { language, t } = useTranslation();

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  // Movies screen state
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [isMoviesLoading, setIsMoviesLoading] = useState(true);
  const [categoryView, setCategoryView] = useState<{
    title: string;
    fetcher: (page: number, language: string) => Promise<TmdbApiPopularResponse>;
  } | null>(null);

  // TV Shows screen state
  const [popularTvShows, setPopularTvShows] = useState<TVShow[]>([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState<TVShow[]>([]);
  const [airingTodayTvShows, setAiringTodayTvShows] = useState<TVShow[]>([]);
  const [isTvShowsLoading, setIsTvShowsLoading] = useState(true);
  const [tvCategoryView, setTvCategoryView] = useState<{
    title: string;
    fetcher: (page: number, language: string) => Promise<TmdbApiTvResponse>;
  } | null>(null);
  
  // Search screen state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // General state
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTvShow, setSelectedTvShow] = useState<TVShow | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('movies');
  const [listSubTab, setListSubTab] = useState<'movies' | 'tvshows'>('movies');
  
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());

  const [favoriteTvShowIds, setFavoriteTvShowIds] = useState<Set<number>>(new Set());
  const [watchlistTvShowIds, setWatchlistTvShowIds] = useState<Set<number>>(new Set());
  
  const [filterGenre, setFilterGenre] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Person Details State
  const [personDetails, setPersonDetails] = useState<(PersonDetails & { movies: Movie[] }) | null>(null);
  const [isPersonLoading, setIsPersonLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

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
    if (activeTab !== 'favorites' && activeTab !== 'watchlist') {
      setListSubTab('movies');
    }
  }, [activeTab]);

  // Initial data fetching
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { genres } = await getMovieGenres(language);
        setGenres(genres);
      } catch (error) { console.error('Failed to fetch genres:', error); }
    };

    fetchInitialData();

    // Load movie lists
    const storedFavorites = localStorage.getItem('favoriteMovies');
    if (storedFavorites) setFavoriteIds(new Set(JSON.parse(storedFavorites)));
    const storedWatchlist = localStorage.getItem('watchlistMovies');
    if (storedWatchlist) setWatchlistIds(new Set(JSON.parse(storedWatchlist)));

    // Load TV show lists
    const storedTvFavorites = localStorage.getItem('favoriteTvShows');
    if (storedTvFavorites) setFavoriteTvShowIds(new Set(JSON.parse(storedTvFavorites)));
    const storedTvWatchlist = localStorage.getItem('watchlistTvShows');
    if (storedTvWatchlist) setWatchlistTvShowIds(new Set(JSON.parse(storedTvWatchlist)));
  }, [language]);

  const fetchMoviesData = useCallback(async () => {
      setIsMoviesLoading(true);
      setError(null);
      try {
          const [popular, topRated, nowPlaying, upcoming] = await Promise.all([
              getPopularMovies(1, language),
              getTopRatedMovies(1, language),
              getNowPlayingMovies(1, language),
              getUpcomingMovies(1, language)
          ]);
          setPopularMovies(popular.results);
          setTopRatedMovies(topRated.results);
          setNowPlayingMovies(nowPlaying.results);
          setUpcomingMovies(upcoming.results);
      } catch (err) {
          setError(t('failedToLoadMovies'));
      } finally {
          setIsMoviesLoading(false);
      }
  }, [language, t]);
  
  const fetchTvShowsData = useCallback(async () => {
    setIsTvShowsLoading(true);
    setError(null);
    try {
      const [popular, topRated, airingToday] = await Promise.all([
        getPopularTvShows(1, language),
        getTopRatedTvShows(1, language),
        getAiringTodayTvShows(1, language)
      ]);
      setPopularTvShows(popular.results);
      setTopRatedTvShows(topRated.results);
      setAiringTodayTvShows(airingToday.results);
    } catch (err) {
      setError(t('failedToLoadMovies'));
    } finally {
      setIsTvShowsLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    fetchMoviesData();
    fetchTvShowsData();
  }, [fetchMoviesData, fetchTvShowsData]);


  useEffect(() => {
    if (!searchTerm) {
      setFilterGenre(null);
      setFilterYear(null);
      setFilterRating(null);
    }
  }, [searchTerm]);

  const updateFavorites = (newFavorites: Set<number>) => {
    setFavoriteIds(newFavorites);
    localStorage.setItem('favoriteMovies', JSON.stringify(Array.from(newFavorites)));
  };

  const toggleFavorite = (movie: Movie) => {
    const newFavorites = new Set(favoriteIds);
    if (newFavorites.has(movie.id)) {
      newFavorites.delete(movie.id);
    } else {
      newFavorites.add(movie.id);
    }
    updateFavorites(newFavorites);
  };
  
  const updateWatchlist = (newWatchlist: Set<number>) => {
    setWatchlistIds(newWatchlist);
    localStorage.setItem('watchlistMovies', JSON.stringify(Array.from(newWatchlist)));
  };

  const toggleWatchlist = (movie: Movie) => {
    const newWatchlist = new Set(watchlistIds);
    if (newWatchlist.has(movie.id)) {
      newWatchlist.delete(movie.id);
    } else {
      newWatchlist.add(movie.id);
    }
    updateWatchlist(newWatchlist);
  };

  const toggleFavoriteTvShow = (tvShow: TVShow) => {
    const newFavorites = new Set(favoriteTvShowIds);
    if (newFavorites.has(tvShow.id)) {
        newFavorites.delete(tvShow.id);
    } else {
        newFavorites.add(tvShow.id);
    }
    setFavoriteTvShowIds(newFavorites);
    localStorage.setItem('favoriteTvShows', JSON.stringify(Array.from(newFavorites)));
  };

  const toggleWatchlistTvShow = (tvShow: TVShow) => {
    const newWatchlist = new Set(watchlistTvShowIds);
    if (newWatchlist.has(tvShow.id)) {
        newWatchlist.delete(tvShow.id);
    } else {
        newWatchlist.add(tvShow.id);
    }
    setWatchlistTvShowIds(newWatchlist);
    localStorage.setItem('watchlistTvShows', JSON.stringify(Array.from(newWatchlist)));
  };
  
  const fetchSearchResults = useCallback(async (term: string, page: number) => {
    if (!term) return;
    setIsSearchLoading(true);
    setError(null);
    try {
      const data = await searchMovies(term, page, language);
      setSearchResults(prev => (page === 1 ? data.results : [...prev, ...data.results]));
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(t('failedToLoadMovies'));
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  }, [language, t]);

  // Debounced search effect
  useEffect(() => {
    if (activeTab !== 'search') return;
    
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    
    debounceTimeoutRef.current = window.setTimeout(() => {
      setCurrentPage(1);
      fetchSearchResults(searchTerm, 1);
    }, 500);
    
    return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); }
  }, [searchTerm, activeTab, fetchSearchResults]);
  
  // Infinite scroll for search
  useEffect(() => {
    if (currentPage > 1 && activeTab === 'search') {
      fetchSearchResults(searchTerm, currentPage);
    }
  }, [currentPage, activeTab, searchTerm, fetchSearchResults]);

  const filteredSearchResults = useMemo(() => {
    if (activeTab !== 'search' || !searchTerm) return searchResults;
    return searchResults.filter(movie => {
      const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
      if (filterGenre && !movie.genre_ids.includes(filterGenre)) return false;
      if (filterYear && movieYear !== filterYear) return false;
      if (filterRating && movie.vote_average < filterRating) return false;
      return true;
    });
  }, [searchResults, activeTab, searchTerm, filterGenre, filterYear, filterRating]);
  
  const handleSelectMovie = async (movie: Movie) => {
    try {
      const details = await getMovieDetails(movie.id, language);
      setSelectedMovie(details);
    } catch(err) {
      console.error("Failed to fetch movie details", err);
      setError(t('failedToFetchDetails'))
      setSelectedMovie(movie);
    }
  };

  const handleSelectTvShow = async (tvShow: TVShow) => {
    try {
      const details = await getTvShowDetails(tvShow.id, language);
      setSelectedTvShow(details);
    } catch(err) {
      console.error("Failed to fetch tv show details", err);
      setError(t('failedToFetchDetails'))
      setSelectedTvShow(tvShow); // Fallback to basic details
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
  
  const loadMoreRef = useCallback(node => {
    if (isSearchLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    });
    if (node) observer.current.observe(node);
  }, [isSearchLoading, currentPage, totalPages]);

  const handleSurpriseMe = async () => {
      try {
        const data = await getPopularMovies(Math.floor(Math.random() * 10) + 1, language);
        if (data.results.length > 0) {
            const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
            handleSelectMovie(randomMovie);
        }
      } catch (err) {
          setError(t('couldNotFetchRandom'));
      }
  }

  const resetFilters = () => {
    setFilterGenre(null);
    setFilterYear(null);
    setFilterRating(null);
  };

  const handleViewAllMovies = (title: string, fetcher: (page: number, lang: string) => Promise<TmdbApiPopularResponse>) => {
    setCategoryView({ title, fetcher });
    window.scrollTo(0, 0);
  };

  const handleViewAllTvShows = (title: string, fetcher: (page: number, lang: string) => Promise<TmdbApiTvResponse>) => {
    setTvCategoryView({ title, fetcher });
    window.scrollTo(0, 0);
  };

  const handleSelectPerson = async (personId: number) => {
    if (selectedMovie) setSelectedMovie(null); // Close movie modal first
    if (selectedTvShow) setSelectedTvShow(null);
    setIsPersonLoading(true);
    setPersonDetails(null);
    document.body.style.overflow = 'hidden';

    try {
      const [details, credits] = await Promise.all([
        getPersonDetails(personId, language),
        getPersonMovieCredits(personId, language),
      ]);

      const allMovies = [...credits.cast, ...credits.crew];
      const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values())
        .filter(m => m.poster_path); // Filter out movies without posters
        
      const sortedMovies = uniqueMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      setPersonDetails({ ...details, movies: sortedMovies });
    } catch (err) {
      console.error("Failed to fetch person details", err);
      setError(t('failedToFetchDetails'));
      document.body.style.overflow = 'auto';
    } finally {
      setIsPersonLoading(false);
    }
  };

  const handleClosePersonModal = () => {
    setPersonDetails(null);
    document.body.style.overflow = 'auto';
  };

  const handleSelectMovieFromPerson = (movie: Movie) => {
    handleClosePersonModal();
    // Delay to allow modal to close gracefully
    setTimeout(() => handleSelectMovie(movie), 300);
  };

  const ListPage: React.FC<{listIds: Set<number>, type: 'movie' | 'tv'}> = ({ listIds, type }) => {
    const [listItems, setListItems] = useState<(Movie | TVShow)[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchListItems = useCallback(async (idSet: Set<number>, itemType: 'movie' | 'tv'): Promise<(Movie | TVShow)[]> => {
        if (idSet.size === 0) return [];
        try {
            const fetcher = itemType === 'movie' ? getMovieDetails : getTvShowDetails;
            const promises = Array.from(idSet).map(id => fetcher(id, language) as Promise<Movie | TVShow>);
            return await Promise.all(promises);
        } catch (err) {
            setError(t('failedToFetchList'));
            return [];
        }
    }, [language, t]);

    useEffect(() => {
        const loadList = async () => {
            setIsLoading(true);
            const items = await fetchListItems(listIds, type);
            const userList = new Set(listIds);
            setListItems(items.filter(item => item && userList.has(item.id)));
            setIsLoading(false);
        }
        loadList();
    }, [listIds, type, fetchListItems]);

    const renderGrid = () => {
        if (type === 'movie') {
            return (
                <MovieGrid 
                    movies={listItems as Movie[]}
                    onSelectMovie={handleSelectMovie} 
                    favoriteIds={favoriteIds}
                    onToggleFavorite={toggleFavorite}
                    watchlistIds={watchlistIds}
                    onToggleWatchlist={toggleWatchlist}
                />
            );
        } else { // type === 'tv'
            return (
                <TvShowGrid
                    tvShows={listItems as TVShow[]}
                    onSelectTvShow={handleSelectTvShow}
                    favoriteIds={favoriteTvShowIds}
                    onToggleFavorite={toggleFavoriteTvShow}
                    watchlistIds={watchlistTvShowIds}
                    onToggleWatchlist={toggleWatchlistTvShow}
                />
            );
        }
    };
    
    const getEmptyMessageKey = () => {
        const isFavorites = activeTab === 'favorites';
        if (type === 'movie') {
            return isFavorites ? 'noFavorites' : 'emptyWatchlist';
        } else { // tv
            return isFavorites ? 'noFavoriteTvShows' : 'emptyTvShowWatchlist';
        }
    };

    return (
        <>
            {isLoading && <MovieGridSkeleton />}
            {!isLoading && listItems.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        {t(getEmptyMessageKey())}
                    </p>
                </div>
            )}
            {!isLoading && listItems.length > 0 && renderGrid()}
        </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="sticky top-0 z-40 w-full">
        <Header 
          theme={theme} 
          setTheme={setTheme}
          onSurpriseMe={handleSurpriseMe}
        />
        <DesktopNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8">
        {error && (
            <div className="text-center py-10 px-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                <p className="font-semibold">{t('errorOccurred')}</p>
                <p>{error}</p>
            </div>
        )}

        {activeTab === 'movies' && (
          categoryView ? (
            <CategoryGridPage
                title={categoryView.title}
                fetcher={categoryView.fetcher}
                onBack={() => setCategoryView(null)}
                onSelectMovie={handleSelectMovie}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                watchlistIds={watchlistIds}
                onToggleWatchlist={toggleWatchlist}
            />
          ) : isMoviesLoading ? (
                <>
                    <HeroSliderSkeleton />
                    <MovieSliderSkeleton />
                    <MovieSliderSkeleton />
                    <MovieSliderSkeleton />
                </>
            ) : (
                <div className="space-y-12">
                    <HeroSlider movies={nowPlayingMovies.slice(0, 10)} onSelectMovie={handleSelectMovie} />
                    <MovieSlider title={t('popular')} movies={popularMovies} onViewAll={() => handleViewAllMovies(t('popular'), getPopularMovies)} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
                    <MovieSlider title={t('topRated')} movies={topRatedMovies} onViewAll={() => handleViewAllMovies(t('topRated'), getTopRatedMovies)} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
                    <MovieSlider title={t('nowPlaying')} movies={nowPlayingMovies} onViewAll={() => handleViewAllMovies(t('nowPlaying'), getNowPlayingMovies)} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
                    <MovieSlider title={t('upcoming')} movies={upcomingMovies} onViewAll={() => handleViewAllMovies(t('upcoming'), getUpcomingMovies)} onSelectMovie={handleSelectMovie} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
                </div>
            )
        )}
        
        {activeTab === 'tvshows' && (
             tvCategoryView ? (
                <TvShowCategoryGridPage
                    title={tvCategoryView.title}
                    fetcher={tvCategoryView.fetcher}
                    onBack={() => setTvCategoryView(null)}
                    onSelectTvShow={handleSelectTvShow}
                    favoriteIds={favoriteTvShowIds}
                    onToggleFavorite={toggleFavoriteTvShow}
                    watchlistIds={watchlistTvShowIds}
                    onToggleWatchlist={toggleWatchlistTvShow}
                />
            ) : isTvShowsLoading ? (
                <>
                    <MovieSliderSkeleton />
                    <MovieSliderSkeleton />
                    <MovieSliderSkeleton />
                </>
            ) : (
                <div className="space-y-12">
                    <TvShowSlider title={t('popularTvShows')} tvShows={popularTvShows} onViewAll={() => handleViewAllTvShows(t('popularTvShows'), getPopularTvShows)} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />
                    <TvShowSlider title={t('topRatedTvShows')} tvShows={topRatedTvShows} onViewAll={() => handleViewAllTvShows(t('topRatedTvShows'), getTopRatedTvShows)} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />
                    <TvShowSlider title={t('airingToday')} tvShows={airingTodayTvShows} onViewAll={() => handleViewAllTvShows(t('airingToday'), getAiringTodayTvShows)} onSelectTvShow={handleSelectTvShow} favoriteIds={favoriteTvShowIds} onToggleFavorite={toggleFavoriteTvShow} watchlistIds={watchlistTvShowIds} onToggleWatchlist={toggleWatchlistTvShow} />
                </div>
            )
        )}

        {activeTab === 'search' && (
            <>
                <div className="mb-6">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>
                {searchTerm && (
                    <SearchFilters 
                        genres={genres}
                        filters={{ genre: filterGenre, year: filterYear, rating: filterRating }}
                        onFilterChange={{ setGenre: setFilterGenre, setYear: setFilterYear, setRating: setFilterRating }}
                        onResetFilters={resetFilters}
                    />
                )}
                {isSearchLoading && searchResults.length === 0 && <MovieGridSkeleton />}
                {!isSearchLoading && searchTerm && filteredSearchResults.length === 0 && (
                     <div className="text-center py-10">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            {t('noMoviesFound', { searchTerm })}
                        </p>
                    </div>
                )}
                {filteredSearchResults.length > 0 && (
                     <MovieGrid
                        movies={filteredSearchResults}
                        onSelectMovie={handleSelectMovie} 
                        favoriteIds={favoriteIds}
                        onToggleFavorite={toggleFavorite}
                        watchlistIds={watchlistIds}
                        onToggleWatchlist={toggleWatchlist}
                    />
                )}
                <div ref={loadMoreRef} className="h-10">
                    {isSearchLoading && searchResults.length > 0 && <Loader />}
                </div>
            </>
        )}
        
        {(activeTab === 'favorites' || activeTab === 'watchlist') && (
            <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
                    {activeTab === 'favorites' ? t('myFavorites') : t('myWatchlist')}
                </h2>
                <ListSubTabs activeTab={listSubTab} setActiveTab={setListSubTab} />
                { listSubTab === 'movies' ? 
                    <ListPage listIds={activeTab === 'favorites' ? favoriteIds : watchlistIds} type="movie" /> :
                    <ListPage listIds={activeTab === 'favorites' ? favoriteTvShowIds : watchlistTvShowIds} type="tv" />
                }
            </div>
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
