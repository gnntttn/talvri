
import React from 'react';
import type { TrendingItem, Movie, TVShow } from '../types';
import { MovieCard } from './MovieCard';
import { TvShowCard } from './TvShowCard';

interface MediaGridProps {
  items: TrendingItem[];
  onSelectMovie: (movie: Movie, options?: { playTrailer: boolean }) => void;
  onSelectTvShow: (tvShow: TVShow, options?: { playTrailer: boolean }) => void;
  favoriteMovieIds: Set<number>;
  onToggleFavoriteMovie: (movie: Movie) => void;
  watchlistMovieIds: Set<number>;
  onToggleWatchlistMovie: (movie: Movie) => void;
  favoriteTvShowIds: Set<number>;
  onToggleFavoriteTvShow: (tvShow: TVShow) => void;
  watchlistTvShowIds: Set<number>;
  onToggleWatchlistTvShow: (tvShow: TVShow) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  onSelectMovie,
  onSelectTvShow,
  favoriteMovieIds,
  onToggleFavoriteMovie,
  watchlistMovieIds,
  onToggleWatchlistMovie,
  favoriteTvShowIds,
  onToggleFavoriteTvShow,
  watchlistTvShowIds,
  onToggleWatchlistTvShow,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {items.map((item) => {
        if (item.media_type === 'movie') {
          return (
            <MovieCard
              key={`movie-${item.id}`}
              movie={item}
              onSelectMovie={onSelectMovie}
              isFavorite={favoriteMovieIds.has(item.id)}
              onToggleFavorite={onToggleFavoriteMovie}
              isWatchlisted={watchlistMovieIds.has(item.id)}
              onToggleWatchlist={onToggleWatchlistMovie}
            />
          );
        }
        if (item.media_type === 'tv') {
          return (
            <TvShowCard
              key={`tv-${item.id}`}
              tvShow={item}
              onSelectTvShow={onSelectTvShow}
              isFavorite={favoriteTvShowIds.has(item.id)}
              onToggleFavorite={onToggleFavoriteTvShow}
              isWatchlisted={watchlistTvShowIds.has(item.id)}
              onToggleWatchlist={onToggleWatchlistTvShow}
            />
          );
        }
        return null;
      })}
    </div>
  );
};