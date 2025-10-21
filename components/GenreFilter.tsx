
import React from 'react';
import type { Genre } from '../types';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: number | null;
  onSelectGenre: (genreId: number | null) => void;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({ genres, selectedGenre, onSelectGenre }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 flex-shrink-0";
  const activeClasses = "bg-indigo-600 text-white shadow";
  const inactiveClasses = "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700";

  if (genres.length === 0) return (
    <div className="h-[52px]"></div> // Placeholder for height to prevent layout shift
  );

  return (
    <div className="pb-4 overflow-x-auto">
      <div className="flex items-center space-x-2 whitespace-nowrap py-2">
        <button 
            onClick={() => onSelectGenre(null)} 
            className={`${baseClasses} ${!selectedGenre ? activeClasses : inactiveClasses}`}
        >
            Popular
        </button>
        {genres.map(genre => (
          <button 
            key={genre.id} 
            onClick={() => onSelectGenre(genre.id)}
            className={`${baseClasses} ${selectedGenre === genre.id ? activeClasses : inactiveClasses}`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};
