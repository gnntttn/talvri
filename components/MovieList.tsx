
import React from 'react';
import type { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie, options?: { playTrailer: boolean }) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (movie: Movie) => void;
}

export const MovieList: React.FC<MovieListProps> = ({ movies, onSelectMovie, favoriteIds, onToggleFavorite, watchlistIds, onToggleWatchlist }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onSelectMovie={onSelectMovie} 
          isFavorite={favoriteIds.has(movie.id)}
          onToggleFavorite={onToggleFavorite}
          isWatchlisted={watchlistIds.has(movie.id)}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </div>
  );
};