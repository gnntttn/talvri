import React, { useEffect, useState, useRef } from 'react';
import type { TVShow, WatchProviderDetails, Cast, Crew, Review, SeasonDetails, Episode } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import { getSimilarTvShows, getTvShowSeasonDetails } from '../services/tmdbService';
import { useTranslation } from '../contexts/LanguageContext';
import { Loader } from './Loader';
import { RatingCircle } from './RatingCircle';

type ActiveTab = 'overview' | 'cast' | 'seasons' | 'watch' | 'reviews';

interface TvShowDetailsModalProps {
  tvShow: TVShow;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (tvShow: TVShow) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (tvShow: TVShow) => void;
  onSelectSimilarTvShow: (tvShow: TVShow) => void;
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

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 4.158a.75.75 0 1 1-1.06 1.06l-5.5-5.5a.75.75 0 0 1 0-1.06l5.5-5.5a.75.75 0 0 1 1.06 1.06L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
  </svg>
);

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm sm:text-base font-semibold transition-colors duration-200 relative ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
    >
        {label}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
    </button>
);


const MiniTvShowCard: React.FC<{ tvShow: TVShow; onSelect: (tvShow: TVShow) => void }> = ({ tvShow, onSelect }) => {
  const imageUrl = tvShow.poster_path ? `${TMDB_IMAGE_BASE_URL}/w200${tvShow.poster_path}` : null;
  return (
    <div className="flex-shrink-0 w-32 cursor-pointer group" onClick={() => onSelect(tvShow)}>
      {imageUrl ? (
        <img src={imageUrl} alt={tvShow.name} className="w-full h-48 object-cover rounded-md shadow-md group-hover:opacity-80 transition-opacity" />
      ) : (
        <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400 dark:text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.079.079 0 1 1-.158 0 .079.079 0 0 1 .158 0Z" />
            </svg>
        </div>
      )}
      <h4 className="text-sm font-semibold mt-2 truncate">{tvShow.name}</h4>
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
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors w-full text-left rtl:text-right"
    >
      <div className="flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400 dark:text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-bold text-sm line-clamp-1">{person.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{subtitle}</p>
      </div>
    </button>
  );
};

const ProvidersSection: React.FC<{providers: WatchProviderDetails[]; title: string}> = ({ providers, title }) => (
    <div>
        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{title}</h4>
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
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 mr-3 rtl:ml-3 rtl:mr-0 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 flex-shrink-0">
            {review.author.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-grow">
          <p className="font-bold">{review.author}</p>
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

const EpisodeCard: React.FC<{ episode: Episode }> = ({ episode }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const stillUrl = episode.still_path ? `${TMDB_IMAGE_BASE_URL}/w300${episode.still_path}` : null;

    return (
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 flex flex-col sm:flex-row gap-4 text-left rtl:text-right">
            <div className="flex-shrink-0 w-full sm:w-40">
                {stillUrl ? (
                    <img src={stillUrl} alt={episode.name} className="w-full h-auto object-cover rounded-md" />
                ) : (
                    <div className="w-full aspect-video bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400 dark:text-slate-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.079.079 0 1 1-.158 0 .079.079 0 0 1 .158 0Z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex-grow">
                <h4 className="font-bold">
                    {t('episode')} {episode.episode_number}: {episode.name}
                </h4>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1 space-x-3 rtl:space-x-reverse">
                    <span>{episode.air_date}</span>
                    {episode.vote_average > 0 && (
                        <span className="flex items-center">
                            <StarIcon className="w-3 h-3 text-yellow-400" />
                            <span className="ml-1 rtl:mr-1 rtl:ml-0 font-semibold">{episode.vote_average.toFixed(1)}</span>
                        </span>
                    )}
                </div>
                {episode.overview && (
                    <>
                        <p className={`text-sm text-slate-600 dark:text-slate-300 mt-2 ${!isExpanded && 'line-clamp-2'}`}>
                            {episode.overview}
                        </p>
                        {episode.overview.length > 150 && (
                             <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-500 dark:text-indigo-400 text-sm font-semibold mt-1 hover:underline">
                                {isExpanded ? t('showLess') : t('readMore')}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};


export const TvShowDetailsModal: React.FC<TvShowDetailsModalProps> = ({ tvShow, onClose, isFavorite, onToggleFavorite, isWatchlisted, onToggleWatchlist, onSelectSimilarTvShow, onSelectPerson, playOnMount = false }) => {
  const { language, t } = useTranslation();
  const posterUrl = tvShow.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${tvShow.poster_path}` : null;

  const [similarTvShows, setSimilarTvShows] = useState<TVShow[]>([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number | null>(null);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
  const [isSeasonLoading, setIsSeasonLoading] = useState(false);

  const trailer = tvShow.videos?.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
  const providers = tvShow['watch/providers']?.results.US;
  const reviews = tvShow.reviews?.results;
  const firstAirYear = tvShow.first_air_date ? tvShow.first_air_date.split('-')[0] : null;

  const topCredits = React.useMemo(() => {
    if (!tvShow.credits) return { crew: [], cast: [] };
    const { cast, crew } = tvShow.credits;
    const creators = crew.filter(member => member.job === 'Creator').slice(0, 3);
    const topCast = cast.slice(0, 10 - creators.length);
    return { crew: creators, cast: topCast };
  }, [tvShow.credits]);

  const stopTrailer = () => setShowTrailer(false);
  const handleClose = () => onClose();
  
  useEffect(() => { if (playOnMount && trailer) setShowTrailer(true); }, [playOnMount, trailer]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showTrailer) {
          stopTrailer();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    if (!playOnMount) setShowTrailer(false);
    setSelectedSeasonNumber(null);
    setSeasonDetails(null);
    
    if (tvShow.seasons && tvShow.seasons.length > 0) {
        const airedSeasons = tvShow.seasons.filter(s => s.season_number > 0 && s.air_date && new Date(s.air_date) <= new Date()).sort((a, b) => b.season_number - a.season_number);
        if (airedSeasons.length > 0) setSelectedSeasonNumber(airedSeasons[0].season_number);
        else { const nonSpecialSeasons = tvShow.seasons.filter(s => s.season_number > 0); if (nonSpecialSeasons.length > 0) setSelectedSeasonNumber(nonSpecialSeasons[0].season_number); }
    }

    getSimilarTvShows(tvShow.id, 1, language).then(data => setSimilarTvShows(data.results.slice(0, 10))).catch(err => console.error("Failed to fetch similar tv shows", err));

    return () => { window.removeEventListener('keydown', handleEsc); document.body.style.overflow = 'auto'; };
  }, [onClose, tvShow.id, language, playOnMount, showTrailer]);

  useEffect(() => {
    if (selectedSeasonNumber === null) return;
    const fetchSeasonDetails = async () => {
        setIsSeasonLoading(true);
        try {
            const details = await getTvShowSeasonDetails(tvShow.id, selectedSeasonNumber, language);
            setSeasonDetails(details);
        } catch (err) { console.error("Failed to fetch season details", err); setSeasonDetails(null); } 
        finally { setIsSeasonLoading(false); }
    };
    fetchSeasonDetails();
  }, [tvShow.id, selectedSeasonNumber, language]);

  const renderTabContent = () => {
    switch(activeTab) {
        case 'overview': return (<div><h3 className="text-xl font-bold mb-2">{t('overview')}</h3><p className="text-slate-600 dark:text-slate-300 text-sm">{tvShow.overview}</p></div>);
        case 'cast': return ((topCredits.crew.length > 0 || topCredits.cast.length > 0) && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">{topCredits.crew.map(m => <CreditListItem key={`crew-${m.id}`} person={m} subtitle={t('creator')} onSelect={onSelectPerson} />)}{topCredits.cast.map(m => <CreditListItem key={`cast-${m.id}`} person={m} subtitle={m.character} onSelect={onSelectPerson} />)}</div>));
        case 'seasons':
            const availableSeasons = tvShow.seasons?.filter(s => s.season_number > 0 && s.episode_count > 0);
            return availableSeasons && availableSeasons.length > 0 ? (
                <div>
                    <select
                        value={selectedSeasonNumber || ''}
                        onChange={(e) => setSelectedSeasonNumber(Number(e.target.value))}
                        className="w-full sm:w-auto rounded-md border-0 bg-slate-100 dark:bg-slate-800 py-1.5 pl-3 pr-8 rtl:pr-3 rtl:pl-8 text-slate-800 dark:text-slate-200 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm mb-4"
                        aria-label={t('season')}
                    >
                        {availableSeasons.map(s => <option key={s.id} value={s.season_number}>{s.name}</option>)}
                    </select>
                    {isSeasonLoading && <div className="flex justify-center items-center py-8"><Loader /></div>}
                    {!isSeasonLoading && seasonDetails && ( <div className="max-h-96 overflow-y-auto space-y-3 -mr-2 pr-2">{seasonDetails.episodes.map(episode => <EpisodeCard key={episode.id} episode={episode} />)}</div> )}
                </div>
            ) : null;
        case 'watch': return (providers && (providers.flatrate || providers.buy || providers.rent) ? (<div className="flex flex-col sm:flex-row gap-6">{providers.flatrate && <ProvidersSection providers={providers.flatrate} title={t('stream')} />}{providers.buy && <ProvidersSection providers={providers.buy} title={t('buy')} />}{providers.rent && <ProvidersSection providers={providers.rent} title={t('rent')} />}</div>) : <p className="text-slate-500 dark:text-slate-400 text-sm">{t('noMoviesFound')}</p>);
        case 'reviews': return (reviews && reviews.length > 0 ? (<div className="max-h-96 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 -m-2">{reviews.map(r => <ReviewCard key={r.id} review={r} />)}</div>) : <p className="text-slate-500 dark:text-slate-400 text-sm">{t('noReviewsFound')}</p>)
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={handleClose}>
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-y-auto max-h-[95vh] max-w-4xl w-full relative transition-all duration-300 animate-zoomIn" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleClose} className="absolute top-3 right-3 rtl:left-3 rtl:right-auto z-30 p-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors" aria-label={t('closeModal')}>
                <CloseIcon className="w-6 h-6" />
            </button>
            
            <div className="relative h-48 sm:h-64 md:h-80 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                {showTrailer && trailer ? (
                    <>
                        <iframe ref={iframeRef} src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&iv_load_policy=3&controls=1&modestbranding=1&showinfo=0`} title={trailer.name} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full absolute inset-0"></iframe>
                        <button onClick={stopTrailer} className="absolute top-3 left-3 rtl:right-3 rtl:left-auto z-10 p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors flex items-center gap-1 pr-2" aria-label="Back to details">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                    </>
                ) : (
                    <>
                        {tvShow.backdrop_path && (
                            <img src={`${TMDB_IMAGE_BASE_URL}/w1280${tvShow.backdrop_path}`} alt="" className="w-full h-full object-cover"/>
                        )}
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
                    </>
                )}
            </div>

            <div className="px-6 md:px-8 pb-8">
                <div className="flex flex-col sm:flex-row -mt-24 sm:-mt-28 relative items-end gap-6">
                    <div className="w-36 sm:w-48 flex-shrink-0">
                        {posterUrl && <img src={posterUrl} alt={tvShow.name} className="w-full rounded-lg shadow-2xl object-cover" />}
                    </div>
                    <div className="flex-grow pb-2">
                        <h2 className="text-3xl font-black">{tvShow.name}</h2>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-6">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 sm:gap-x-4 gap-y-2">
                        <RatingCircle rating={tvShow.vote_average} />
                        <div className="text-md font-semibold flex items-center gap-x-3 sm:gap-x-4">
                            <span>{firstAirYear}</span>
                            {tvShow.number_of_seasons && <><span>•</span><span>{tvShow.number_of_seasons} {t('seasons')}</span></>}
                        </div>
                        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-center mt-2 sm:mt-0">
                            {tvShow.genres?.slice(0, 2).map(g => (
                                <span key={g.id} className="text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full">{g.name}</span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {trailer && <button onClick={() => setShowTrailer(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold shadow"><PlayIcon className="w-5 h-5" /><span>{t('playTrailer')}</span></button>}
                        <button onClick={() => onToggleWatchlist(tvShow)} className="p-2.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors" aria-label={isWatchlisted ? t('removeFromWatchlist', { title: tvShow.name }) : t('addToWatchlist', { title: tvShow.name })}><BookmarkIcon className={`w-5 h-5 ${isWatchlisted ? 'text-indigo-500' : 'text-slate-500 dark:text-slate-400'}`} fill={isWatchlisted ? 'currentColor' : 'none'} stroke="currentColor" /></button>
                        <button onClick={() => onToggleFavorite(tvShow)} className="p-2.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors" aria-label={isFavorite ? t('removeFromFavorites', { title: tvShow.name }) : t('addToFavorites', { title: tvShow.name })}><HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-indigo-500' : 'text-slate-500 dark:text-slate-400'}`} fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" /></button>
                    </div>
                </div>

                <div className="mt-8 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex space-x-2 rtl:space-x-reverse -mb-px overflow-x-auto">
                        <TabButton label={t('overview')} isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <TabButton label={t('castAndCrew')} isActive={activeTab === 'cast'} onClick={() => setActiveTab('cast')} />
                        <TabButton label={t('seasonsAndEpisodes')} isActive={activeTab === 'seasons'} onClick={() => setActiveTab('seasons')} />
                        <TabButton label={t('whereToWatch')} isActive={activeTab === 'watch'} onClick={() => setActiveTab('watch')} />
                        <TabButton label={t('reviews')} isActive={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
                    </div>
                </div>

                <div className="pt-6">{renderTabContent()}</div>
                
                {similarTvShows.length > 0 && (
                    <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-4">{t('youMightAlsoLike')}</h3>
                        <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
                            {similarTvShows.map(s => <MiniTvShowCard key={s.id} tvShow={s} onSelect={onSelectSimilarTvShow} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};