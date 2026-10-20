// All TMDB API requests live in this file. Every function returns data in one
// consistent shape so components never deal with raw API responses.
//
// There is no hardcoded catalogue: if the API key is missing or TMDB cannot be
// reached, the functions throw a TmdbError and the pages show a clear message.

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const CACHE_MS = 5 * 60 * 1000;

export const hasApiKey = Boolean(API_KEY) && API_KEY !== 'your_tmdb_api_key_here';
// A v4 "API Read Access Token" is a long JWT and is sent as a bearer header.
const useBearer = hasApiKey && API_KEY.length > 60;

export class TmdbError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'TmdbError';
    this.code = code;
  }
}

const cache = new Map();

async function request(path, params = {}) {
  if (!hasApiKey) throw new TmdbError('NO_KEY', 'No TMDB API key is configured.');

  const url = new URL(`${BASE_URL}${path}`);
  if (!useBearer) url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  });

  const cacheKey = url.toString();
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.time < CACHE_MS) return hit.data;

  let response;
  try {
    response = await fetch(url, useBearer ? { headers: { Authorization: `Bearer ${API_KEY}` } } : undefined);
  } catch {
    throw new TmdbError('NETWORK', 'Could not reach TMDB.');
  }

  if (response.status === 429) throw new TmdbError('RATE_LIMIT', 'Too many requests.');
  if (response.status === 401) throw new TmdbError('BAD_KEY', 'The API key was rejected.');
  if (response.status === 404) throw new TmdbError('NOT_FOUND', 'Not found.');
  if (!response.ok) throw new TmdbError('HTTP', `TMDB returned status ${response.status}.`);

  const data = await response.json();
  cache.set(cacheKey, { data, time: Date.now() });
  return data;
}

// Turns an error into a message a visitor can understand.
export function friendlyError(error) {
  switch (error?.code) {
    case 'NO_KEY':
      return 'The TMDB API key is missing. Add it to a .env file as VITE_TMDB_API_KEY and restart the dev server (see the README).';
    case 'BAD_KEY':
      return 'TMDB rejected the API key. Check VITE_TMDB_API_KEY in your .env file.';
    case 'RATE_LIMIT':
      return 'TMDB is limiting requests right now. Please wait a moment and try again.';
    case 'NETWORK':
      return 'Could not reach TMDB. Check your internet connection and try again.';
    case 'NOT_FOUND':
      return 'That title could not be found.';
    default:
      return 'Something went wrong while loading data from TMDB.';
  }
}

/* ---------- Normalising ---------- */

function mapItem(raw, forcedType) {
  const type = forcedType || raw.media_type || (raw.first_air_date !== undefined || raw.name ? 'tv' : 'movie');
  return {
    id: raw.id,
    type,
    title: raw.title || raw.name || 'Untitled',
    date: raw.release_date || raw.first_air_date || '',
    rating: raw.vote_average || 0,
    genreIds: raw.genre_ids || (raw.genres || []).map((g) => g.id),
    poster: raw.poster_path || null,
    backdrop: raw.backdrop_path || null,
    overview: raw.overview || '',
  };
}

function mapList(data, forcedType) {
  const results = (data.results || [])
    .filter((raw) => raw.media_type === undefined || raw.media_type === 'movie' || raw.media_type === 'tv')
    .map((raw) => mapItem(raw, forcedType));
  return { results, page: data.page || 1, totalPages: Math.min(data.total_pages || 1, 500) };
}

/* ---------- Public API ---------- */

// type: 'all' | 'movie' | 'tv'. Returns an array of titles.
export async function getTrending(type = 'all', window = 'week') {
  const data = await request(`/trending/${type}/${window}`);
  return mapList(data, type === 'all' ? undefined : type).results;
}

// Returns { results, totalPages }.
export async function getPopular(type = 'movie', page = 1) {
  return mapList(await request(`/${type}/popular`, { page }), type);
}

// Browse by genre. `genre` is a TMDB genre id (or empty for all genres).
export async function discover({ type = 'movie', genre = '', page = 1 } = {}) {
  const data = await request(`/discover/${type}`, {
    page,
    with_genres: genre,
    sort_by: 'popularity.desc',
    include_adult: false,
  });
  return mapList(data, type);
}

// Search movies and TV shows by title.
export async function searchTitles(query, page = 1) {
  const data = await request('/search/multi', { query: query.trim(), page, include_adult: false });
  return mapList(data);
}

// Genre lists come from TMDB too, so the filter is never hardcoded.
export async function getGenres() {
  const [movie, tv] = await Promise.all([request('/genre/movie/list'), request('/genre/tv/list')]);
  const map = {};
  [...movie.genres, ...tv.genres].forEach((g) => {
    map[g.id] = g.name;
  });
  return { movie: movie.genres, tv: tv.genres, map };
}

// Full details for the details dialog, including the best trailer if there is one.
export async function getDetails(type, id) {
  const raw = await request(`/${type}/${id}`, { append_to_response: 'videos' });
  const videos = (raw.videos?.results || []).filter((v) => v.site === 'YouTube');
  const trailer =
    videos.find((v) => v.type === 'Trailer' && v.official) ||
    videos.find((v) => v.type === 'Trailer') ||
    videos.find((v) => v.type === 'Teaser');

  return {
    ...mapItem(raw, type),
    tagline: raw.tagline || '',
    runtime: type === 'tv' ? raw.episode_run_time?.[0] || null : raw.runtime || null,
    genres: raw.genres || [],
    seasons: raw.number_of_seasons || null,
    episodes: raw.number_of_episodes || null,
    trailerKey: trailer ? trailer.key : null,
  };
}
