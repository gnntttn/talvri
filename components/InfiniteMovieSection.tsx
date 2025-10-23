import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Movie, TmdbApiPopularResponse, Person, TmdbApiPeopleResponse } from '../types';
import { MovieGrid, PeopleGrid } from './MovieGrid';
import { Loader } from './Loader';
import { useTranslation } from '../contexts/LanguageContext';
import { MovieListSkeleton } from './MovieListSkeleton';

interface InfiniteMovieSectionProps {
  title: string;
  fetcher: (page: number, language: string) => Promise<TmdbApiPopularResponse>;
  onSelectMovie: (movie: Movie) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (movie: Movie) => void;
}

export const InfiniteMovieSection: React.FC<InfiniteMovieSectionProps> = ({
  title,
  fetcher,
  onSelectMovie,
  favoriteIds,
  onToggleFavorite,
  watchlistIds,
  onToggleWatchlist,
}) => {
  const { language } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const isMounted = useRef(true);

  const loadMovies = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const data = await fetcher(page, language);
      if (isMounted.current) {
        setMovies(prev => (page === 1 ? data.results : [...prev, ...data.results]));
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error(`Failed to fetch ${title} movies`, err);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher, language, title]);
  
  useEffect(() => {
    isMounted.current = true;
    loadMovies(1);
    return () => {
      isMounted.current = false;
    };
  }, [loadMovies]);
  
  const loadMoreRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage(prev => {
          const nextPage = prev + 1;
          loadMovies(nextPage);
          return nextPage;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, currentPage, totalPages, loadMovies]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-100 mb-4">{title}</h2>
      {isLoading && movies.length === 0 && <MovieListSkeleton count={6} />}
      {movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelectMovie={onSelectMovie}
          favoriteIds={favoriteIds}
          onToggleFavorite={onToggleFavorite}
          watchlistIds={watchlistIds}
          onToggleWatchlist={onToggleWatchlist}
        />
      )}
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isLoading && movies.length > 0 && <Loader />}
      </div>
    </section>
  );
};

// --- New InfinitePeopleSection ---
interface InfinitePeopleSectionProps {
  fetcher: (page: number, language: string) => Promise<TmdbApiPeopleResponse>;
  onSelectPerson: (personId: number) => void;
}

export const InfinitePeopleSection: React.FC<InfinitePeopleSectionProps> = ({
  fetcher,
  onSelectPerson,
}) => {
  const { language } = useTranslation();
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const isMounted = useRef(true);

  const loadPeople = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const data = await fetcher(page, language);
      if (isMounted.current) {
        setPeople(prev => (page === 1 ? data.results : [...prev, ...data.results]));
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error(`Failed to fetch people`, err);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher, language]);

  useEffect(() => {
    isMounted.current = true;
    setPeople([]);
    setCurrentPage(1);
    loadPeople(1);
    return () => {
      isMounted.current = false;
    };
  }, [fetcher, language, loadPeople]);

  const loadMoreRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage(prev => {
          const nextPage = prev + 1;
          loadPeople(nextPage);
          return nextPage;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, currentPage, totalPages, loadPeople]);

  return (
    <section>
      {isLoading && people.length === 0 && <MovieListSkeleton count={18} />}
      {people.length > 0 && (
        <PeopleGrid people={people} onSelectPerson={onSelectPerson} />
      )}
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isLoading && people.length > 0 && <Loader />}
      </div>
    </section>
  );
};