// Small reusable helpers: image URLs, formatting and item keys.

export const IMG_BASE = 'https://image.tmdb.org/t/p/';

// Shown whenever a poster or backdrop is missing or fails to load.
export const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><rect width="400" height="600" fill="#222228"/>' +
      '<text x="200" y="305" text-anchor="middle" font-family="Arial" font-size="22" fill="#9a9aa6">No image</text></svg>',
  );

export const posterUrl = (path, size = 'w342') => (path ? `${IMG_BASE}${size}${path}` : FALLBACK_IMAGE);
export const backdropUrl = (path, size = 'w1280') => (path ? `${IMG_BASE}${size}${path}` : FALLBACK_IMAGE);

// Used as onError on <img> so a broken URL swaps to the fallback once.
export function handleImgError(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
}

export const formatRating = (value) => (Number(value) ? Number(value).toFixed(1) : '');
export const formatYear = (date) => (date ? String(date).slice(0, 4) : '');

export function formatDate(date) {
  if (!date) return '';
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

export function formatRuntime(minutes) {
  const total = Number(minutes);
  if (!total) return '';
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export const keyOf = (item) => `${item.type}-${item.id}`;
