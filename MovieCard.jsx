import { Box, Card, CardActionArea, IconButton, Skeleton, Typography } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useDetails } from '../context/DetailsContext.jsx';
import { useGenres } from '../context/GenresContext.jsx';
import { useWatchlist } from '../context/WatchlistContext.jsx';
import { formatRating, formatYear, handleImgError, posterUrl } from '../utils/helpers.js';

// One poster with rating badge, title, year and genre. Used in every row and grid.
export default function MovieCard({ item }) {
  const { openDetails } = useDetails();
  const { has, toggle } = useWatchlist();
  const { map } = useGenres();
  const saved = has(item);
  const rating = formatRating(item.rating);
  const genre = (item.genreIds || []).map((id) => map[id]).find(Boolean) || '';

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: 'transparent',
        backgroundImage: 'none',
        '&:hover img, &:focus-within img': { transform: 'scale(1.06)' },
        '&:hover .wl-btn, &:focus-within .wl-btn': { opacity: 1 },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '2 / 3', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
        <CardActionArea onClick={() => openDetails(item)} aria-label={`${item.title}, view details`} sx={{ height: '100%' }}>
          <Box
            component="img"
            src={posterUrl(item.poster)}
            alt={`${item.title} poster`}
            loading="lazy"
            onError={handleImgError}
            sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
          />
        </CardActionArea>

        {rating && (
          <Box
            sx={{
              position: 'absolute', top: 8, right: 8, px: 1, borderRadius: 1.5, pointerEvents: 'none',
              bgcolor: 'rgba(0,0,0,.75)', color: 'primary.main', fontSize: '.8rem', fontWeight: 800,
            }}
          >
            {rating}
          </Box>
        )}

        <IconButton
          className="wl-btn"
          size="small"
          onClick={() => toggle(item)}
          aria-pressed={saved}
          aria-label={`${saved ? 'Remove from' : 'Add to'} watchlist: ${item.title}`}
          sx={{
            position: 'absolute', top: 6, left: 6, bgcolor: 'rgba(0,0,0,.72)',
            color: saved ? 'primary.main' : 'common.white',
            opacity: saved ? 1 : 0,
            '@media (hover: none)': { opacity: 1 },
            '&:hover': { bgcolor: 'rgba(0,0,0,.92)' },
          }}
        >
          {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Typography
        component="h3"
        sx={{
          mt: 1.1, fontSize: '.95rem', fontWeight: 600, lineHeight: 1.3, overflow: 'hidden',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}
      >
        {item.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1.25 }}>
        <span>{formatYear(item.date)}</span>
        <span>{genre}</span>
      </Typography>
    </Card>
  );
}

// Placeholder shown while posters are loading.
export function CardSkeleton() {
  return (
    <Box aria-hidden="true">
      <Skeleton variant="rectangular" sx={{ aspectRatio: '2 / 3', height: 'auto', borderRadius: 2 }} />
      <Skeleton sx={{ mt: 1 }} />
      <Skeleton width="55%" />
    </Box>
  );
}
