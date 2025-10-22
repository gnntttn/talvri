import React, { useEffect, useState, useRef } from 'react';
import type { Movie, WatchProviderDetails, Cast, Crew, Review } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import { getSimilarMovies } from '../services/tmdbService';
import { useTranslation } from '../contexts/LanguageContext';
import { RatingCircle } from './RatingCircle';

type ActiveTab = 'overview' | 'cast' | 'watch' | 'reviews';

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onSelectSimilarMovie: (movie: Movie) => void;
  onSelectPerson: (personId: number) => void;
  playOnMount?: boolean;
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
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

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
    </svg>
);

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.145.604c.731.107 1.023 1.005.494 1.521l-2.998 2.922.708 4.129c.125.728-.638 1.285-1.29.948L10 14.85l-3.713 1.952c-.652.337-1.415-.22-1.29-.948l.708-4.129-2.998-2.922c-.529-.516-.237-1.414.494-1.521l4.145-.604 1.83-3.751Z" clipRule="evenodd" />
    </svg>
);

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm sm:text-base font-semibold transition-colors duration-200 relative ${isActive ? 'text-violet-500' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
    >
        {label}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />}
    </button>
);


const MiniMovieCard: React.FC<{ movie: Movie; onSelect: (movie: Movie) => void }> = ({ movie, onSelect }) => {
  const imageUrl = movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w200${movie.poster_path}` : null;
  return (
    <div className="flex-shrink-0 w-32 cursor-pointer group" onClick={() => onSelect(movie)}>
      {imageUrl ? (
        <img src={imageUrl} alt={movie.title} className="w-full h-48 object-cover rounded-md shadow-md group-hover:opacity-80 transition-opacity" />
      ) : (
        <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.079.079 0 1 1-.158 0 .079.079 0 0 1 .158 0Z" />
            </svg>
        </div>
      )}
      <h4 className="text-sm font-semibold mt-2 truncate text-slate-800 dark:text-slate-200">{movie.title}</h4>
    </div>
  )
};

const CreditListItem: React.FC<{
  person: Cast | Crew;
  subtitle: string;
  onSelect: (personId: number) => void;
}> = ({ person, subtitle, onSelect }) => {
  const imageUrl = person.profile_path ? `${TMDB_IMAGE_BASE_URL}/w200${person.profile_path}` : null;
  return (
    <button
      onClick={() => onSelect(person.id)}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors w-full text-left rtl:text-right"
    >
      <div className="flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{person.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{subtitle}</p>
      </div>
    </button>
  );
};


const ProvidersSection: React.FC<{providers: WatchProviderDetails[]; title: string}> = ({ providers, title }) => (
    <div>
        <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
            {providers.map(p => (
                <img key={p.provider_id} src={`${TMDB_IMAGE_BASE_URL}/w92${p.logo_path}`} alt={p.provider_name} className="w-10 h-10 rounded-lg" title={p.provider_name} />
            ))}
        </div>
    </div>
);

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const avatarUrl = review.author_details.avatar_path
    ? review.author_details.avatar_path.startsWith('/https')
      ? review.author_details.avatar_path.substring(1)
      : `${TMDB_IMAGE_BASE_URL}/w45${review.author_details.avatar_path}`
    : null;

  const reviewContent = review.content;
  const isLongReview = reviewContent.length > 300;
  const displayContent = isLongReview && !isExpanded ? `${reviewContent.substring(0, 300)}...` : reviewContent;
  const formattedDate = new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-4 text-left rtl:text-right">
      <div className="flex items-center mb-2">
        {avatarUrl ? (
          <img src={avatarUrl} alt={review.author} className="w-10 h-10 rounded-full mr-3 rtl:ml-3 rtl:mr-0 object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 mr-3 rtl:ml-3 rtl:mr-0 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">
            {review.author.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-grow">
          <p className="font-bold text-slate-800 dark:text-slate-200">{review.author}</p>
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
             {review.author_details.rating && (
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="ml-1 rtl:mr-1 rtl:ml-0 font-semibold">{review.author_details.rating} / 10</span>
                   <span className="mx-2">·</span>
                </div>
              )}
              <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
        {displayContent}
      </p>
      {isLongReview && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold mt-2 hover:underline"
        >
          {isExpanded ? t('showLess') : t('readMore')}
        </button>
      )}
    </div>
  );
};


export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ movie, onClose, isFavorite, onToggleFavorite, isWatchlisted, onToggleWatchlist, onSelectSimilarMovie, onSelectPerson, playOnMount = false }) => {
  const { language, t } = useTranslation();
  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}/w1280${movie.backdrop_path}`
    : movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w1280${movie.poster_path}` : undefined;
  
  const posterUrl = movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` : null;
  
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const trailer = movie.videos?.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
  const providers = movie['watch/providers']?.results.US;
  const reviews = movie.reviews?.results;

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`.trim();
  };
  const runtime = formatRuntime(movie.runtime);
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : null;

  const topCredits = React.useMemo(() => {
    if (!movie.credits) return { crew: [], cast: [] };
    const { cast, crew } = movie.credits;
    const director = crew.find(member => member.job === 'Director');
    const writers = crew.filter(member => member.job === 'Screenplay' || member.job === 'Writer').slice(0, 2);
    const uniqueCrew = [director, ...writers].filter((p): p is Crew => !!p).filter((p, i, self) => i === self.findIndex(t => t.id === p.id));
    const topCast = cast.slice(0, 10 - uniqueCrew.length);
    return { crew: uniqueCrew, cast: topCast };
  }, [movie.credits]);

  const stopTrailer = () => {
    if (iframeRef.current) iframeRef.current.src = '';
    setShowTrailer(false);
  };

  const handleClose = () => {
    if (showTrailer) stopTrailer();
    onClose();
  };
  
  useEffect(() => {
    if (playOnMount && trailer) setShowTrailer(true);
  }, [playOnMount, trailer]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showTrailer) stopTrailer(); else onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    if (!playOnMount) setShowTrailer(false);
    
    getSimilarMovies(movie.id, 1, language)
      .then(data => setSimilarMovies(data.results.slice(0, 10)))
      .catch(err => console.error("Failed to fetch similar movies", err));

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, movie.id, language, playOnMount]);

  const renderTabContent = () => {
    switch(activeTab) {
        case 'overview':
            return (
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('overview')}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{movie.overview}</p>
                </div>
            );
        case 'cast':
            return (
                (topCredits.crew.length > 0 || topCredits.cast.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        {topCredits.crew.map(member => <CreditListItem key={`crew-${member.id}`} person={member} subtitle={member.job} onSelect={onSelectPerson} />)}
                        {topCredits.cast.map(member => <CreditListItem key={`cast-${member.id}`} person={member} subtitle={member.character} onSelect={onSelectPerson} />)}
                    </div>
                )
            );
        case 'watch':
            return (
                 providers && (providers.flatrate || providers.buy || providers.rent) ? (
                    <div className="flex flex-col sm:flex-row gap-6">
                        {providers.flatrate && <ProvidersSection providers={providers.flatrate} title={t('stream')} />}
                        {providers.buy && <ProvidersSection providers={providers.buy} title={t('buy')} />}
                        {providers.rent && <ProvidersSection providers={providers.rent} title={t('rent')} />}
                    </div>
                ) : <p className="text-slate-500 dark:text-slate-400 text-sm">{t('noMoviesFound')}</p>
            );
        case 'reviews':
            return (
                 reviews && reviews.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 -m-2">
                        {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                    </div>
                ) : <p className="text-slate-500 dark:text-slate-400 text-sm">{t('noReviewsFound')}</p>
            )
    }
  }


  return (
    <>
    <div 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-0 sm:p-4 animate-fade-in"
        onClick={handleClose}
    >
      <div 
        className="bg-slate-50 dark:bg-slate-800 rounded-none sm:rounded-lg overflow-y-auto max-h-screen sm:max-h-[95vh] shadow-xl max-w-4xl w-full relative transform transition-all duration-300 animate-slide-up text-left rtl:text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={handleClose} 
            className="absolute top-3 right-3 rtl:left-3 rtl:right-auto z-30 p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label={t('closeModal')}
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="relative h-[45vh] bg-slate-900 overflow-hidden">
            <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${showTrailer ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {backdropUrl && (
                    <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover opacity-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-800 via-slate-50/50 dark:via-slate-800/50 to-transparent" />
                
                <div className="absolute bottom-0 left-0 rtl:right-0 w-full px-4 sm:px-6 pb-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left rtl:sm:text-right">
                    <div className="w-36 sm:w-32 md:w-40 flex-shrink-0 -mb-20 sm:-mb-8 mx-auto sm:mx-0">
                       {posterUrl && <img src={posterUrl} alt={movie.title} className="w-full rounded-md shadow-2xl object-cover" />}
                    </div>
                    <div className="pb-0 sm:pb-2 mt-4 sm:mt-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white shadow-lg">{movie.title}</h2>
                      {movie.tagline && <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-1">{movie.tagline}</p>}
                    </div>
                  </div>
                </div>
            </div>

            {trailer && (
                <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${showTrailer ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {showTrailer && (
                        <iframe
                            ref={iframeRef}
                            src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
                            title={trailer.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    )}
                </div>
            )}
        </div>

        <div className="px-4 sm:px-6 pt-24 sm:pt-12 pb-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 w-full sm:w-auto">
                    <RatingCircle rating={movie.vote_average} />
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium space-x-3 rtl:space-x-reverse">
                        <span>{releaseYear}</span>
                        <span>•</span>
                        <span>{runtime}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2 sm:pt-0">
                        {movie.genres?.slice(0,3).map(genre => (
                            <span key={genre.id} className="text-xs font-semibold bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full">{genre.name}</span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 mx-auto sm:mx-0">
                    {trailer && (
                        <button onClick={() => setShowTrailer(true)} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-semibold">
                            <PlayIcon className="w-5 h-5" />
                            <span>{t('playTrailer')}</span>
                        </button>
                    )}
                    <button onClick={() => onToggleWatchlist(movie)} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" aria-label={isWatchlisted ? t('removeFromWatchlist', { title: movie.title }) : t('addToWatchlist', { title: movie.title })}>
                        <BookmarkIcon
                            className={`w-5 h-5 ${isWatchlisted ? 'text-violet-500' : 'text-slate-600 dark:text-slate-300'}`}
                            fill={isWatchlisted ? 'currentColor' : 'none'}
                            stroke="currentColor"
                        />
                    </button>
                    <button onClick={() => onToggleFavorite(movie)} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" aria-label={isFavorite ? t('removeFromFavorites', { title: movie.title }) : t('addToFavorites', { title: movie.title })}>
                        <HeartIcon 
                            className={`w-5 h-5 ${isFavorite ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}`}
                            fill={isFavorite ? 'currentColor' : 'none'}
                            stroke="currentColor"
                        />
                    </button>
                </div>
            </div>

            <div className="mt-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex space-x-2 rtl:space-x-reverse -mb-px overflow-x-auto">
                   <TabButton label={t('overview')} isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                   <TabButton label={t('castAndCrew')} isActive={activeTab === 'cast'} onClick={() => setActiveTab('cast')} />
                   <TabButton label={t('whereToWatch')} isActive={activeTab === 'watch'} onClick={() => setActiveTab('watch')} />
                   <TabButton label={t('reviews')} isActive={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
                </div>
            </div>

            <div className="pt-6">
                {renderTabContent()}
            </div>
            
            {similarMovies.length > 0 && (
                <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('youMightAlsoLike')}</h3>
                    <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
                        {similarMovies.map(m => (
                            <MiniMovieCard key={m.id} movie={m} onSelect={onSelectSimilarMovie} />
                        ))}
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
     <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        
        .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; }
    `}</style>
    </>
  );
};
