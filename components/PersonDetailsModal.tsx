
import React, { useEffect, useState } from 'react';
import type { Movie, PersonDetails } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';
import { MovieGrid } from './MovieGrid';
import { SearchBar } from './SearchBar';

interface PersonDetailsModalProps {
  person: PersonDetails;
  movies: Movie[];
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
  watchlistIds: Set<number>;
  onToggleWatchlist: (movie: Movie) => void;
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

const PersonInfoItem: React.FC<{label: string, value: string | null | undefined}> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div>
            <span className="font-semibold text-slate-600 dark:text-slate-400">{label}:</span>
            <span className="ml-2 rtl:mr-2 rtl:ml-0 text-slate-800 dark:text-slate-200">{value}</span>
        </div>
    )
};


export const PersonDetailsModal: React.FC<PersonDetailsModalProps> = ({
    person,
    movies,
    onClose,
    onSelectMovie,
    favoriteIds,
    onToggleFavorite,
    watchlistIds,
    onToggleWatchlist,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const profileUrl = person.profile_path ? `${TMDB_IMAGE_BASE_URL}/h632${person.profile_path}` : null;

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    // Body overflow is handled in App.tsx
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (searchTerm === '') {
        setFilteredMovies(movies);
    } else {
        setFilteredMovies(
            movies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
  }, [searchTerm, movies]);

  return (
    <>
    <div 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg overflow-y-auto max-h-[90vh] shadow-xl max-w-4xl w-full relative transform transition-all duration-300 animate-slide-up text-left rtl:text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-3 right-3 rtl:left-3 rtl:right-auto z-20 p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label={t('closeModal')}
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-1">
                    {profileUrl ? (
                         <img src={profileUrl} alt={person.name} className="w-full rounded-lg shadow-md object-cover" />
                    ) : (
                        <div className="w-full aspect-[2/3] bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center mx-auto shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="sm:col-span-2">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{person.name}</h2>
                    <div className="space-y-2 text-sm mb-4">
                        <PersonInfoItem label={t('knownFor')} value={person.known_for_department} />
                        <PersonInfoItem label={t('born')} value={person.birthday} />
                        <PersonInfoItem label={t('placeOfBirth')} value={person.place_of_birth} />
                        {person.deathday && <PersonInfoItem label={t('died')} value={person.deathday} />}
                    </div>
                     {person.biography && (
                        <>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t('biography')}</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm max-h-48 overflow-y-auto pr-2">
                                {person.biography}
                            </p>
                        </>
                    )}
                </div>
            </div>
            
            <div className="mt-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                     <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('knownFor')}</h3>
                     <div className="sm:w-64">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                     </div>
                </div>
                {filteredMovies.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                        <MovieGrid 
                            movies={filteredMovies}
                            onSelectMovie={onSelectMovie}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={onToggleFavorite}
                            watchlistIds={watchlistIds}
                            onToggleWatchlist={onToggleWatchlist}
                        />
                    </div>
                ) : (
                     <div className="text-center py-10">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            {t('noMoviesFound', { searchTerm: searchTerm })}
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
     <style>{`
        @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes slide-up {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
    `}</style>
    </>
  );
};
