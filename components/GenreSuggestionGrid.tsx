import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import type { Genre } from '../types';

interface GenreSuggestionGridProps {
  genres: Genre[];
  onGenreClick: (genreName: string) => void;
}

const genreColors = [
  'from-rose-500 to-pink-500',
  'from-purple-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-teal-500',
  'from-yellow-500 to-amber-500',
  'from-orange-500 to-red-500',
  'from-fuchsia-500 to-purple-500',
  'from-sky-500 to-blue-500',
];

export const GenreSuggestionGrid: React.FC<GenreSuggestionGridProps> = ({ genres, onGenreClick }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">{t('popularGenres')}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {genres.map((genre, index) => (
          <button
            key={genre.id}
            onClick={() => onGenreClick(genre.name)}
            className={`relative p-4 rounded-lg text-white font-bold text-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br ${genreColors[index % genreColors.length]}`}
          >
            <span className="relative z-10">{genre.name}</span>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        ))}
      </div>
    </div>
  );
};