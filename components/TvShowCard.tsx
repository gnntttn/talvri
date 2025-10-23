import React from 'react';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import type { TVShow } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface TvShowCardProps {
  tvShow: TVShow;
  onSelectTvShow: (tvShow: TVShow, options?: { playTrailer: boolean }) => void;
  isFavorite: boolean;
  onToggleFavorite: (tvShow: TVShow) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (tvShow: TVShow) => void;
}

const PlaceholderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.079.079 0 1 1-.158 0 .079.079 0 0 1 .158 0Z" />
    </svg>
);
const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.722-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z" />
  </svg>
);
const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
  </svg>
);
const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9A22.045 22.045 0 0 1 3.302 12.5c-1.143-1.35-1.143-3.414-.002-4.763a5.5 5.5 0 0 1 7.778 0l.002.002.002.002.002-.002.002-.002a5.5 5.5 0 0 1 7.778 0c1.141 1.35 1.141 3.414 0 4.763a22.045 22.045 0 0 1-2.582 1.9 22.045 22.045 0 0 1-2.582 1.9 20.759 20.759 0 0 1-1.162.682c-.006.003-.012.007-.019.01Zm.347-1.422a20.537 20.537 0 0 0 2.23-1.656 20.537 20.537 0 0 0 2.23-1.656c.966-1.141.966-2.827 0-3.968a3.996 3.996 0 0 0-5.652 0l-.348.347a.75.75 0 0 1-1.06 0l-.348-.347a3.996 3.996 0 0 0-5.652 0c-.966 1.141-.966 2.827 0 3.968a20.537 20.537 0 0 0 2.23 1.656 20.537 20.537 0 0 0 2.23 1.656Z" />
  </svg>
);

export const TvShowCard: React.FC<TvShowCardProps> = ({ tvShow, onSelectTvShow, isFavorite, onToggleFavorite, isWatchlisted, onToggleWatchlist }) => {
  const { t } = useTranslation();
  const imageUrl = tvShow.poster_path
    ? `${TMDB_IMAGE_BASE_URL}/w500${tvShow.poster_path}`
    : null;

  return (
    <div className="group cursor-pointer" onClick={() => onSelectTvShow(tvShow)}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 shadow-lg transition-transform duration-300 group-hover:scale-105">
        {imageUrl ? (
            <img 
                src={imageUrl} 
                alt={tvShow.name} 
                className="w-full h-full object-cover"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center">
                <PlaceholderIcon className="w-16 h-16 text-slate-400 dark:text-slate-600"/>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
            <button onClick={(e) => { e.stopPropagation(); onToggleWatchlist(tvShow); }} className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-white/20 transition-colors" aria-label={isWatchlisted ? t('removeFromWatchlist') : t('addToWatchlist')}>
                {isWatchlisted ? <CheckIcon className="w-5 h-5"/> : <PlusIcon className="w-5 h-5"/>}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onSelectTvShow(tvShow, { playTrailer: true }); }} className="p-3 rounded-full bg-white/90 backdrop-blur-sm text-black hover:bg-white transition-colors" aria-label={t('playTrailer')}>
                <PlayIcon className="w-6 h-6"/>
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(tvShow); }} className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-white/20 transition-colors" aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}>
                <HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-indigo-400' : ''}`}/>
            </button>
        </div>
        </div>
        <div className="pt-3 text-left rtl:text-right">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{tvShow.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{tvShow.first_air_date.split('-')[0]}</p>
        </div>
    </div>
  );
};