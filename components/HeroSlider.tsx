import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Movie } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';
import { RatingCircle } from './RatingCircle';

interface HeroSliderProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie, options?: { playTrailer: boolean }) => void;
}

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6.39-2.908a.75.75 0 0 1 .98 0l4.25 3.5a.75.75 0 0 1 0 1.116l-4.25 3.5a.75.75 0 0 1-.98 0V7.092Z" clipRule="evenodd" />
    </svg>
);


export const HeroSlider: React.FC<HeroSliderProps> = ({ movies, onSelectMovie }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === movies.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, movies.length]);

  useEffect(() => {
    resetTimeout();
    if (movies.length > 1) {
        timeoutRef.current = window.setTimeout(() => {
            goToNext();
        }, 5000);
    }

    return () => {
      resetTimeout();
    };
  }, [currentIndex, goToNext, movies.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (!movies || movies.length === 0) {
    return (
        <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
    )
  }

  const currentMovie = movies[currentIndex];

  return (
    <section className="relative w-full aspect-[16/9] sm:aspect-[16/7] rounded-lg overflow-hidden shadow-lg group text-left rtl:text-right">
        {movies.map((movie, index) => (
            <div
                key={movie.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
                {movie.backdrop_path && (
                     <img
                        src={`${TMDB_IMAGE_BASE_URL}/w1280${movie.backdrop_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent rtl:bg-gradient-to-l" />


        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 md:p-12 w-full sm:w-3/4 md:w-1/2">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white shadow-lg mb-2 sm:mb-4">
                {currentMovie.title}
            </h2>
            <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <RatingCircle rating={currentMovie.vote_average} />
                <span className="text-slate-300 font-semibold">{currentMovie.release_date.split('-')[0]}</span>
            </div>
            <p className="hidden md:block text-slate-200 text-sm md:text-base mb-4 sm:mb-6 line-clamp-3">
                {currentMovie.overview}
            </p>
            <div className="flex flex-wrap items-center gap-4">
                <button
                    onClick={() => onSelectMovie(currentMovie)}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-transform duration-200 hover:scale-105"
                >
                    {t('viewDetails')}
                </button>
                 <button
                    onClick={() => onSelectMovie(currentMovie, { playTrailer: true })}
                    className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg shadow-md hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-opacity-75 transition-transform duration-200 hover:scale-105"
                >
                    <PlayIcon className="w-5 h-5"/>
                    {t('playTrailer')}
                </button>
            </div>
        </div>


        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 rtl:space-x-reverse z-10">
            {movies.slice(0, 10).map((_, slideIndex) => (
                 <button
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
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