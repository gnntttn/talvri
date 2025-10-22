
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
        <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-800 animate-pulse"></div>
    )
  }

  const currentMovie = movies[currentIndex];

  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] text-left rtl:text-right">
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
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/30 via-transparent to-transparent rtl:bg-gradient-to-l" />


        <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16">
            <div className="w-full md:w-2/3 lg:w-1/2">
                <div className="flex items-center gap-4 mb-4 animate-slide-up-fade" style={{animationDelay: '0.1s'}}>
                     <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white shadow-lg">
                        {currentMovie.title}
                    </h2>
                </div>
                
                <div className="flex items-center gap-4 mb-4 animate-slide-up-fade" style={{animationDelay: '0.2s'}}>
                    <RatingCircle rating={currentMovie.vote_average} />
                    <span className="text-slate-300 font-semibold">{currentMovie.release_date.split('-')[0]}</span>
                </div>

                <p className="hidden md:block text-slate-300 mb-6 line-clamp-3 animate-slide-up-fade" style={{animationDelay: '0.4s'}}>
                    {currentMovie.overview}
                </p>
                <div className="flex flex-wrap items-center gap-4 animate-slide-up-fade" style={{animationDelay: '0.6s'}}>
                    <button
                        onClick={() => onSelectMovie(currentMovie)}
                        className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105"
                    >
                        {t('viewDetails')}
                    </button>
                    <button
                        onClick={() => onSelectMovie(currentMovie, { playTrailer: true })}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg shadow-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105"
                    >
                        <PlayIcon className="w-5 h-5"/>
                        {t('playTrailer')}
                    </button>
                </div>
            </div>
        </div>


        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 rtl:space-x-reverse z-10">
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
            @keyframes slide-up-fade {
                from {
                    opacity: 0;
                    transform: translateY(1rem);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .animate-slide-up-fade {
                animation: slide-up-fade 0.5s ease-out both;
            }
        `}</style>
    </section>
  );
};
