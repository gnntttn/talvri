

import { TMDB_API_KEY, TMDB_BASE_URL } from '../constants';
import type { Movie, TmdbApiPopularResponse, Genre, PersonDetails, PersonMovieCreditsResponse, TVShow, TmdbApiTvResponse, SeasonDetails, TmdbApiTrendingResponse } from '../types';

const fetchFromTmdb = async <T,>(endpoint: string, language: string = 'en-US'): Promise<T> => {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE_URL}/${endpoint}${separator}api_key=${TMDB_API_KEY}&language=${language}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
};

export const getPopularMovies = async (page: number = 1, language: string): Promise<TmdbApiPopularResponse> => {
  return fetchFromTmdb<TmdbApiPopularResponse>(`movie/popular?page=${page}`, language);
};

export const getTopRatedMovies = async (page: number = 1, language: string): Promise<TmdbApiPopularResponse> => {
    return fetchFromTmdb<TmdbApiPopularResponse>(`movie/top_rated?page=${page}`, language);
};

export const getNowPlayingMovies = async (page: number = 1, language: string): Promise<TmdbApiPopularResponse> => {
    return fetchFromTmdb<TmdbApiPopularResponse>(`movie/now_playing?page=${page}`, language);
};

export const getUpcomingMovies = async (page: number = 1, language: string): Promise<TmdbApiPopularResponse> => {
    return fetchFromTmdb<TmdbApiPopularResponse>(`movie/upcoming?page=${page}`, language);
};

export const searchMovies = async (query: string, page: number = 1, language: string): Promise<TmdbApiPopularResponse> => {
  return fetchFromTmdb<TmdbApiPopularResponse>(`search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`, language);
};

export const getMovieDetails = async (movieId: number, language: string): Promise<Movie> => {
    const appendToResponse = 'videos,watch/providers,credits,reviews';
    return fetchFromTmdb<Movie>(`movie/${movieId}?append_to_response=${appendToResponse}`, language);
};

export const getMovieGenres = async (language: string): Promise<{ genres: Genre[] }> => {
    return fetchFromTmdb<{ genres: Genre[] }>(`genre/movie/list`, language);
};

export const getTvGenres = async (language: string): Promise<{ genres: Genre[] }> => {
    return fetchFromTmdb<{ genres: Genre[] }>(`genre/tv/list`, language);
};

export const discoverMovies = async (genreId: number, page: number = 1, language: string): Promise<TmdbApiPopularResponse> => {
  return fetchFromTmdb<TmdbApiPopularResponse>(`discover/movie?sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreId}`, language);
};

export const discoverTvShows = async (genreId: number, page: number = 1, language: string): Promise<TmdbApiTvResponse> => {
    return fetchFromTmdb<TmdbApiTvResponse>(`discover/tv?sort_by=popularity.desc&page=${page}&with_genres=${genreId}`, language);
};

export const discoverMedia = async (
  mediaType: 'movie' | 'tv',
  filters: { genre?: number | null; year?: number | null; rating?: number | null },
  page: number = 1,
  language: string
): Promise<TmdbApiPopularResponse | TmdbApiTvResponse> => {
  let query = `discover/${mediaType}?sort_by=popularity.desc&include_adult=false&page=${page}`;
  if (filters.genre) {
    query += `&with_genres=${filters.genre}`;
  }
  if (filters.year) {
    const yearParam = mediaType === 'movie' ? 'primary_release_year' : 'first_air_date_year';
    query += `&${yearParam}=${filters.year}`;
  }
  if (filters.rating && filters.rating > 0) {
    query += `&vote_average.gte=${filters.rating}`;
  }
  return fetchFromTmdb(query, language);
};

export const getSimilarMovies = async (movieId: number, page: number = 1, language: string): Promise<TmdbApiPopularResponse> => {
  return fetchFromTmdb<TmdbApiPopularResponse>(`movie/${movieId}/similar?page=${page}`, language);
};

export const getPersonDetails = async (personId: number, language: string): Promise<PersonDetails> => {
    return fetchFromTmdb<PersonDetails>(`person/${personId}`, language);
};

export const getPersonMovieCredits = async (personId: number, language: string): Promise<PersonMovieCreditsResponse> => {
    return fetchFromTmdb<PersonMovieCreditsResponse>(`person/${personId}/movie_credits`, language);
};

export const getPopularTvShows = async (page: number = 1, language: string): Promise<TmdbApiTvResponse> => {
  return fetchFromTmdb<TmdbApiTvResponse>(`tv/popular?page=${page}`, language);
};

export const getTopRatedTvShows = async (page: number = 1, language: string): Promise<TmdbApiTvResponse> => {
    return fetchFromTmdb<TmdbApiTvResponse>(`tv/top_rated?page=${page}`, language);
};

export const getAiringTodayTvShows = async (page: number = 1, language: string): Promise<TmdbApiTvResponse> => {
    return fetchFromTmdb<TmdbApiTvResponse>(`tv/airing_today?page=${page}`, language);
};

export const getTvShowDetails = async (tvId: number, language: string): Promise<TVShow> => {
    const appendToResponse = 'videos,watch/providers,credits,reviews';
    return fetchFromTmdb<TVShow>(`tv/${tvId}?append_to_response=${appendToResponse}`, language);
};

export const searchTvShows = async (query: string, page: number = 1, language: string): Promise<TmdbApiTvResponse> => {
  return fetchFromTmdb<TmdbApiTvResponse>(`search/tv?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`, language);
};

export const getSimilarTvShows = async (tvId: number, page: number = 1, language: string): Promise<TmdbApiTvResponse> => {
  return fetchFromTmdb<TmdbApiTvResponse>(`tv/${tvId}/similar?page=${page}`, language);
};

export const getTvShowSeasonDetails = async (tvId: number, seasonNumber: number, language: string): Promise<SeasonDetails> => {
    return fetchFromTmdb<SeasonDetails>(`tv/${tvId}/season/${seasonNumber}`, language);
};

export const getTrendingAllWeek = async (page: number = 1, language: string): Promise<TmdbApiTrendingResponse> => {
  return fetchFromTmdb<TmdbApiTrendingResponse>(`trending/all/week?page=${page}`, language);
};