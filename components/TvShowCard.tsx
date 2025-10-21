
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

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.145.604c.731.107 1.023 1.005.494 1.521l-2.998 2.922.708 4.129c.125.728-.638 1.285-1.29.948L10 14.85l-3.713 1.952c-.652.337-1.415-.22-1.29-.948l.708-4.129-2.998-2.922c-.529-.516-.237-1.414.494-1.521l4.145-.604 1.83-3.751Z" clipRule="evenodd" />
    </svg>
);

const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.645 20.91a.75.75 0 0 1-1.29 0C8.631 18.7 2.25 12.553 2.25 8.517 2.25 5.42 4.887 3 7.875 3c1.725 0 3.323.805 4.125 2.088C12.823 3.805 14.42 3 16.125 3c2.988 0 5.625 2.42 5.625 5.517 0 4.036-6.382 10.183-8.135 12.393Z" />
    </svg>
);

const BookmarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
    </svg>
);

const PlaceholderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.079.079 0 1 1-.158 0 .079.079 0 0 1 .158 0Z" />
    </svg>
);

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
    </svg>
);

export const TvShowCard: React.FC<TvShowCardProps> = ({ tvShow, onSelectTvShow, isFavorite, onToggleFavorite, isWatchlisted, onToggleWatchlist }) => {
  const { t } = useTranslation();
  const imageUrl = tvShow.poster_path
    ? `${TMDB_IMAGE_BASE_URL}/w500${tvShow.poster_path}`
    : null;

  return (
    <div 
        className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-violet-800/20 hover:-translate-y-1 bg-slate-800"
        onClick={() => onSelectTvShow(tvShow, { playTrailer: false })}
        aria-label={t('viewDetailsFor', { title: tvShow.name })}
    >
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleWatchlist(tvShow); }}
            className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm text-white/80 hover:bg-black/70 hover:text-white transition-all duration-200"
            aria-label={isWatchlisted ? t('removeFromWatchlist', { title: tvShow.name }) : t('addToWatchlist', { title: tvShow.name })}
        >
            <BookmarkIcon className={`w-5 h-5 transition-colors ${isWatchlisted ? 'text-violet-400' : ''}`} />
        </button>
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(tvShow); }}
            className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm text-white/80 hover:bg-black/70 hover:text-white transition-all duration-200"
            aria-label={isFavorite ? t('removeFromFavorites', { title: tvShow.name }) : t('addToFavorites', { title: tvShow.name })}
        >
            <HeartIcon className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500' : ''}`} />
        </button>

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectTvShow(tvShow, { playTrailer: true });
                }}
                className="w-14 h-14 rounded-full bg-violet-600/80 text-white flex items-center justify-center hover:bg-violet-500 transition-all duration-300 transform group-hover:scale-100 scale-75"
                aria-label={t('playTrailer')}
            >
                <PlayIcon className="w-8 h-8 ml-1" />
            </button>
        </div>
        
        {imageUrl ? (
            <img 
                src={imageUrl} 
                alt={tvShow.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
        ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <PlaceholderIcon className="w-16 h-16 text-slate-600"/>
            </div>
        )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 text-left rtl:text-right">
        <h3 className="text-white text-base font-bold leading-tight truncate">{tvShow.name}</h3>
        <div className="flex items-center mt-1">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-white ml-1 rtl:mr-1 rtl:ml-0 font-semibold text-sm">{(tvShow.vote_average || 0).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};