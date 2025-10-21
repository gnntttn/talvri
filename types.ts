
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  // Appended data
  videos?: { results: Video[] };
  ['watch/providers']?: WatchProviderResponse;
  credits?: CreditsResponse;
  reviews?: MovieReviewsResponse;
  popularity: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  // Appended data
  videos?: { results: Video[] };
  ['watch/providers']?: WatchProviderResponse;
  credits?: CreditsResponse;
  reviews?: MovieReviewsResponse; // Re-using, API structure is similar
  popularity: number;
}


export interface Genre {
  id: number;
  name: string;
}

export interface TmdbApiPopularResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TmdbApiTvResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface WatchProviderDetails {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface CountryProvider {
  link: string;
  rent?: WatchProviderDetails[];
  buy?: WatchProviderDetails[];
  flatrate?: WatchProviderDetails[];
}

export interface WatchProviderResponse {
  results: {
    [countryCode: string]: CountryProvider;
  };
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
    id: number;
    name: string;
    job: string;
    profile_path: string | null;
}

export interface CreditsResponse {
  cast: Cast[];
  crew: Crew[];
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
}

export interface PersonMovieCreditsResponse {
  cast: Movie[];
  crew: Movie[];
}

export interface AuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface Review {
  id: string;
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface MovieReviewsResponse {
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}