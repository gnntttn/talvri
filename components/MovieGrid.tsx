import React from 'react';
import type { Movie, Person } from '../types';
import { MovieCard } from './MovieCard';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';

interface MovieGridProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie, options?: { playTrailer: boolean }) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (movie: Movie) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelectMovie, favoriteIds, onToggleFavorite, watchlistIds, onToggleWatchlist }) => {
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

// --- PersonCard Component ---

const PersonPlaceholderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

interface PersonCardProps {
  person: Person;
  onSelectPerson: (personId: number) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, onSelectPerson }) => {
  const { t } = useTranslation();
  const imageUrl = person.profile_path
    ? `${TMDB_IMAGE_BASE_URL}/w500${person.profile_path}`
    : null;

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onSelectPerson(person.id)}
      aria-label={t('viewDetailsFor', { title: person.name })}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 shadow-lg transition-transform duration-300 group-hover:scale-105">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={person.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PersonPlaceholderIcon className="w-16 h-16 text-slate-400 dark:text-slate-600" />
          </div>
        )}
      </div>
       <div className="pt-3 text-left rtl:text-right">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{person.name}</h3>
          {person.known_for_department && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{person.known_for_department}</p>}
      </div>
    </div>
  );
};


// --- PeopleGrid Component ---

interface PeopleGridProps {
  people: Person[];
  onSelectPerson: (personId: number) => void;
}

export const PeopleGrid: React.FC<PeopleGridProps> = ({ people, onSelectPerson }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {people.map((person) => (
        <PersonCard 
          key={person.id} 
          person={person} 
          onSelectPerson={onSelectPerson} 
        />
      ))}
    </div>
  );
};