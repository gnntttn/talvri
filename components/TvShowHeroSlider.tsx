
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { TVShow } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';

interface TvShowHeroSliderProps {
  tvShows: TVShow[];
  onSelectTvShow: (tvShow: TVShow) => void;
}

const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" />
    </svg>
);

const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
    </svg>
);

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.145.604c.731.107 1.023 1.005.494 1.521l-2.998 2.922.708 4.129c.125.728-.638 1.285-1.29.948L10 14.85l-3.713 1.952c-.652.337-1.415-.22-1.29-.948l.708-4.129-2.998-2.922c-.529-.516-.237-1.414.494-1.521l4.145-.604 1.83-3.751Z" clipRule="evenodd" />
    </svg>
);


export const TvShowHeroSlider: React.FC<TvShowHeroSliderProps> = ({ tvShows, onSelectTvShow }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === tvShows.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, tvShows.length]);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(() => {
      goToNext();
    }, 5000);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, goToNext]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? tvShows.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (!tvShows || tvShows.length === 0) {
    return null;
  }

  const currentTvShow = tvShows[currentIndex];

  return (
    <section className="relative w-full aspect-[16/9] sm:aspect-[16/7] rounded-lg overflow-hidden shadow-lg group text-left rtl:text-right">
        {tvShows.map((tvShow, index) => (
            <div
                key={tvShow.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
                {tvShow.backdrop_path && (
                     <img
                        src={`${TMDB_IMAGE_BASE_URL}/w1280${tvShow.backdrop_path}`}
                        alt={tvShow.name}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent rtl:bg-gradient-to-l" />

        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 md:p-12 w-full sm:w-3/4 md:w-1/2">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white shadow-lg mb-2 sm:mb-4 transition-all duration-300">
                {currentTvShow.name}
            </h2>
            <p className="hidden sm:block text-slate-200 text-sm md:text-base mb-4 sm:mb-6 line-clamp-3">
                {currentTvShow.overview}
            </p>
            <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <div className="flex items-center">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-white ml-1 rtl:mr-1 rtl:ml-0 font-semibold">{(currentTvShow.vote_average || 0).toFixed(1)} / 10</span>
                </div>
            </div>
            <div className="flex">
                <button
                    onClick={() => onSelectTvShow(currentTvShow)}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-colors"
                >
                    {t('viewDetails')}
                </button>
            </div>
        </div>

        {/* Navigation Arrows */}
        <button
            onClick={goToPrevious}
            className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 z-10 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
        >
            <ChevronLeftIcon className="w-6 h-6 rtl:hidden" />
            <ChevronRightIcon className="w-6 h-6 hidden rtl:block" />
        </button>
        <button
            onClick={goToNext}
            className="absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 z-10 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
        >
            <ChevronRightIcon className="w-6 h-6 rtl:hidden" />
            <ChevronLeftIcon className="w-6 h-6 hidden rtl:block" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 rtl:space-x-reverse">
            {tvShows.map((_, slideIndex) => (
                 <button
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${currentIndex === slideIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                    aria-label={`Go to slide ${slideIndex + 1}`}
                />
            ))}
        </div>
        <style>{`
            .line-clamp-3 {
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
            }
        `}</style>
    </section>
  );
};