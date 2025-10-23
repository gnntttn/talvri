import React, { useState, useRef, useEffect } from 'react';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import type { Movie, Video } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { getMovieVideos } from '../services/tmdbService';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie, options?: { playTrailer: boolean }) => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
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
const PauseIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 0-.75.75v12a.75.75 0 0 0 .75.75h3a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75h-3ZM14.25 5.25a.75.75 0 0 0-.75.75v12a.75.75 0 0 0 .75.75h3a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75h-3Z" clipRule="evenodd" /></svg>);
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
const SpeakerWaveIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" /><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" /></svg>);
const SpeakerXMarkIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" /></svg>);

const loadYouTubeApi = () => {
  if ((window as any).youTubeApiPromise) {
    return (window as any).youTubeApiPromise;
  }
  (window as any).youTubeApiPromise = new Promise<void>((resolve) => {
    if ((window as any).YT && (window as any).YT.Player) return resolve();
    (window as any).onYouTubeIframeAPIReady = () => resolve();
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(scriptTag);
  });
  return (window as any).youTubeApiPromise;
};

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelectMovie, isFavorite, onToggleFavorite, isWatchlisted, onToggleWatchlist }) => {
  const { t, language } = useTranslation();
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const hoverTimeout = useRef<number | null>(null);
  const playerRef = useRef<any>(null); // YT.Player
  const playerContainerId = `youtube-player-${movie.id}`;
  
  const imageUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
    : null;

  useEffect(() => {
    if (!trailerKey) {
        if (playerRef.current) {
            playerRef.current.destroy();
            playerRef.current = null;
        }
        return;
    }

    const createPlayer = () => {
        if (document.getElementById(playerContainerId)) {
             playerRef.current = new (window as any).YT.Player(playerContainerId, {
                height: '100%',
                width: '100%',
                videoId: trailerKey,
                playerVars: { autoplay: 1, controls: 0, rel: 0, loop: 1, playlist: trailerKey, mute: 1 },
                events: {
                    onReady: (event: any) => event.target.playVideo(),
                    onStateChange: (event: any) => {
                      if (event.data === (window as any).YT.PlayerState.PLAYING) setIsPlaying(true);
                      else if (event.data === (window as any).YT.PlayerState.PAUSED) setIsPlaying(false);
                    }
                }
            });
        }
    }

    loadYouTubeApi().then(() => {
      if (playerRef.current) playerRef.current.destroy();
      createPlayer();
    });

    return () => {
        if (playerRef.current) {
            playerRef.current.destroy();
            playerRef.current = null;
        }
    };
  }, [trailerKey]);

  const findTrailerKey = (videos: { results: Video[] }): string | null => {
    const trailer = videos.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
    return trailer ? trailer.key : null;
  };

  const handleMouseEnter = () => {
    hoverTimeout.current = window.setTimeout(async () => {
      setIsLoadingTrailer(true);
      try {
        const videos = await getMovieVideos(movie.id, language);
        const key = findTrailerKey(videos);
        if (hoverTimeout.current) setTrailerKey(key);
      } catch (error) {
        console.error("Failed to fetch trailer", error);
        setTrailerKey(null);
      } finally {
        if (hoverTimeout.current) setIsLoadingTrailer(false);
      }
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setTrailerKey(null);
    setIsLoadingTrailer(false);
    setIsMuted(true);
    setIsPlaying(true);
  };
  
  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!playerRef.current) return;
      if (playerRef.current.isMuted()) {
          playerRef.current.unMute();
          setIsMuted(false);
      } else {
          playerRef.current.mute();
          setIsMuted(true);
      }
  }

  const togglePlay = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!playerRef.current) return;
      const playerState = playerRef.current.getPlayerState();
      if (playerState === (window as any).YT.PlayerState.PLAYING) {
          playerRef.current.pauseVideo();
      } else {
          playerRef.current.playVideo();
      }
  }

  return (
    <div 
      className="group cursor-pointer" 
      onClick={() => onSelectMovie(movie)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlaceholderIcon className="w-16 h-16 text-slate-400 dark:text-slate-600"/>
          </div>
        )}
        
        <div 
          id={playerContainerId} 
          className={`absolute inset-0 w-full h-full border-0 z-10 transition-opacity duration-300 ${trailerKey ? 'opacity-100' : 'opacity-0'}`}
        />

        {trailerKey && (
          <div className="absolute bottom-2 right-2 rtl:left-2 rtl:right-auto z-40 flex items-center gap-1.5 animate-fadeIn">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label={isPlaying ? t('pause') : t('play')}
              title={isPlaying ? t('pause') : t('play')}
            >
              {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label={isMuted ? t('unmute') : t('mute')}
              title={isMuted ? t('unmute') : t('mute')}
            >
              {isMuted ? <SpeakerXMarkIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}
            </button>
          </div>
        )}

        {isLoadingTrailer && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 z-40">
          <button onClick={(e) => { e.stopPropagation(); onToggleWatchlist(movie); }} className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-white/20 transition-colors" aria-label={isWatchlisted ? t('removeFromWatchlist') : t('addToWatchlist')}>
            {isWatchlisted ? <CheckIcon className="w-5 h-5"/> : <PlusIcon className="w-5 h-5"/>}
          </button>
           <button onClick={(e) => { e.stopPropagation(); onSelectMovie(movie, { playTrailer: true }); }} className="p-3 rounded-full bg-white/90 backdrop-blur-sm text-black hover:bg-white transition-colors" aria-label={t('playTrailer')}>
              <PlayIcon className="w-6 h-6"/>
          </button>
           <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(movie); }} className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-white/20 transition-colors" aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}>
              <HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-indigo-400' : ''}`}/>
          </button>
        </div>
      </div>
      <div className="pt-3 text-left rtl:text-right">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{movie.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{movie.release_date ? movie.release_date.split('-')[0] : '\u00A0'}</p>
      </div>
    </div>
  );
};
