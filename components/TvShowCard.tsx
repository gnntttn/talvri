
import React from 'react';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import type { TVShow } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface TvShowCardProps {
  tvShow: TVShow;
  onSelectTvShow: (tvShow: TVShow) => void;
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

const BookmarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
);

const PlaceholderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.079.079 0 1 1-.158 0 .079.079 0 0 1 .158 0Z" />
    </svg>
);

export const TvShowCard: React.FC<TvShowCardProps> = ({ tvShow, onSelectTvShow, isFavorite, onToggleFavorite, isWatchlisted, onToggleWatchlist }) => {
  const { t } = useTranslation();
  const imageUrl = tvShow.poster_path
    ? `${TMDB_IMAGE_BASE_URL}/w500${tvShow.poster_path}`
    : null;

  return (
    <div 
        className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        onClick={() => onSelectTvShow(tvShow)}
        aria-label={t('viewDetailsFor', { title: tvShow.name })}
    >
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(tvShow);
            }}
            className="absolute top-2 left-2 rtl:left-auto rtl:right-2 z-20 p-2 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all duration-200"
            aria-label={isWatchlisted ? t('removeFromWatchlist', { title: tvShow.name }) : t('addToWatchlist', { title: tvShow.name })}
        >
            <BookmarkIcon
                className={`w-6 h-6 transition-colors`}
                fill={isWatchlisted ? 'currentColor' : 'none'}
                stroke={isWatchlisted ? 'currentColor' : 'white'}
            />
        </button>
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(tvShow);
            }}
            className="absolute top-2 right-2 rtl:right-auto rtl:left-2 z-20 p-2 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all duration-200"
            aria-label={isFavorite ? t('removeFromFavorites', { title: tvShow.name }) : t('addToFavorites', { title: tvShow.name })}
        >
            <HeartIcon 
                className={`w-6 h-6 transition-colors`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke={isFavorite ? 'currentColor': 'white'}
            />
        </button>
        {imageUrl ? (
            <img 
                src={imageUrl} 
                alt={tvShow.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
        ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <PlaceholderIcon className="w-16 h-16 text-slate-400 dark:text-slate-600"/>
            </div>
        )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 rtl:right-0 p-4 w-full text-left rtl:text-right">
        <h3 className="text-white text-base sm:text-lg font-bold leading-tight">{tvShow.name}</h3>
        <div className="flex items-center mt-1">
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <span className="text-white ml-1 rtl:mr-1 rtl:ml-0 font-semibold text-sm">{(tvShow.vote_average || 0).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};
