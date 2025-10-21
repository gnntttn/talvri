
import React from 'react';
import type { TVShow } from '../types';
import { TvShowCard } from './TvShowCard';

interface TvShowGridProps {
  tvShows: TVShow[];
  onSelectTvShow: (tvShow: TVShow) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (tvShow: TVShow) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (tvShow: TVShow) => void;
}

export const TvShowGrid: React.FC<TvShowGridProps> = ({ tvShows, onSelectTvShow, favoriteIds, onToggleFavorite, watchlistIds, onToggleWatchlist }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {tvShows.map((tvShow) => (
        <TvShowCard 
          key={tvShow.id} 
          tvShow={tvShow} 
          onSelectTvShow={onSelectTvShow} 
          isFavorite={favoriteIds.has(tvShow.id)}
          onToggleFavorite={onToggleFavorite}
          isWatchlisted={watchlistIds.has(tvShow.id)}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </div>
  );
};
