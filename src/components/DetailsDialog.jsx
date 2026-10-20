import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useGenres } from '../context/GenresContext.jsx';
import { useWatchlist } from '../context/WatchlistContext.jsx';
import { friendlyError, getDetails } from '../services/tmdb.js';
import { formatDate, formatRating, formatRuntime, formatYear, handleImgError, posterUrl } from '../utils/helpers.js';

// The details view: poster, overview, release date, rating, genres and trailer.
// It opens straight away with what the list already knows, then fills in the
// rest (genres, runtime, trailer) from TMDB.
export default function DetailsDialog({ item, autoplay = false, onClose }) {
  const { has, toggle } = useWatchlist();
  const { map } = useGenres();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setDetails(null);
    setError('');
    setPlaying(false);
    if (!item) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    getDetails(item.type, item.id)
      .then((data) => {
        if (cancelled) return;
        setDetails(data);
        setLoading(false);
        if (autoplay && data.trailerKey) setPlaying(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(friendlyError(err));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [item, autoplay]);

  if (!item) return null;

  const saved = has(item);
  const rating = formatRating(details?.rating || item.rating);
  const genreNames = details?.genres?.length
    ? details.genres.map((g) => g.name)
    : (item.genreIds || []).map((id) => map[id]).filter(Boolean);
  const releaseDate = formatDate(details?.date || item.date) || formatYear(item.date);
  const facts = [
    item.type === 'tv' ? 'TV show' : 'Movie',
    releaseDate,
    details?.runtime ? `${formatRuntime(details.runtime)}${item.type === 'tv' ? ' per episode' : ''}` : '',
    item.type === 'tv' && details?.seasons ? `${details.seasons} season${details.seasons > 1 ? 's' : ''}` : '',
  ].filter(Boolean);
  const overview = details?.overview || item.overview;

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="body"
      aria-labelledby="details-title"
      PaperProps={{ sx: { bgcolor: 'background.paper', backgroundImage: 'none', borderRadius: 2, position: 'relative' } }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Close details"
        sx={{ position: 'absolute', top: 10, right: 10, zIndex: 3, bgcolor: 'rgba(0,0,0,.7)', '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' } }}
      >
        <CloseIcon />
      </IconButton>

      {playing && details?.trailerKey && (
        <Box sx={{ aspectRatio: '16 / 9', bgcolor: '#000' }}>
          <Box
            component="iframe"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(details.trailerKey)}?autoplay=1&rel=0`}
            title={`${item.title} trailer`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            sx={{ width: '100%', height: '100%', border: 0 }}
          />
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' }, gap: 3, p: 3 }}>
        <Box
          component="img"
          src={posterUrl(item.poster, 'w342')}
          alt={`${item.title} poster`}
          onError={handleImgError}
          sx={{ width: { xs: '50%', sm: '100%' }, maxWidth: 200, aspectRatio: '2 / 3', objectFit: 'cover', borderRadius: 2, bgcolor: 'background.default' }}
        />

        <Box>
          <Typography id="details-title" component="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800, pr: 5, lineHeight: 1.2 }}>
            {item.title}
          </Typography>
          {details?.tagline && (
            <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
              {details.tagline}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 16px', mt: 1, mb: 2, color: 'text.secondary', fontWeight: 600 }}>
            {facts.map((fact) => <span key={fact}>{fact}</span>)}
            {genreNames.length > 0 && <span>{genreNames.join(', ')}</span>}
            {rating && (
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
                <StarIcon sx={{ fontSize: 18 }} /> {rating}
              </Box>
            )}
          </Box>

          <Typography sx={{ color: '#dcdce3' }}>{overview || 'No description is available for this title.'}</Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mt: 2.5 }}>
            {details?.trailerKey && !playing && (
              <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={() => setPlaying(true)} sx={{ borderRadius: 999, minHeight: 44, px: 3 }}>
                Watch trailer
              </Button>
            )}
            <Button
              variant="outlined"
              color="inherit"
              startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              onClick={() => toggle(item)}
              aria-pressed={saved}
              sx={{ borderRadius: 999, minHeight: 44, px: 3, borderColor: saved ? 'primary.main' : 'rgba(255,255,255,.28)', color: saved ? 'primary.main' : 'inherit' }}
            >
              {saved ? 'In My Watchlist' : 'Add to My Watchlist'}
            </Button>
            {loading && <CircularProgress size={22} aria-label="Loading more details" />}
          </Box>

          {details && !details.trailerKey && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              No trailer is available for this title.
            </Typography>
          )}
          {error && <Alert severity="warning" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
      </Box>
    </Dialog>
  );
}
