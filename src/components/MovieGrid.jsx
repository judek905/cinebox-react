import { Box } from '@mui/material';
import MovieCard, { CardSkeleton } from './MovieCard.jsx';
import StatusMessage from './StatusMessage.jsx';
import { friendlyError } from '../services/tmdb.js';
import { keyOf } from '../utils/helpers.js';

const gridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    sm: 'repeat(auto-fill, minmax(150px, 1fr))',
    lg: 'repeat(auto-fill, minmax(176px, 1fr))',
  },
  gap: { xs: '20px 12px', lg: '28px 18px' },
};

// Responsive poster grid with loading, error and empty states built in.
export default function MovieGrid({ items = [], loading = false, error = null, onRetry, emptyMessage = 'No titles found.', skeletonCount = 12 }) {
  if (error) return <StatusMessage type="error" message={friendlyError(error)} onRetry={onRetry} />;

  if (loading && items.length === 0) {
    return (
      <Box sx={gridSx} aria-busy="true">
        {Array.from({ length: skeletonCount }, (_, i) => <CardSkeleton key={i} />)}
      </Box>
    );
  }

  if (items.length === 0) return <StatusMessage message={emptyMessage} />;

  return (
    <Box sx={gridSx}>
      {items.map((item) => <MovieCard key={keyOf(item)} item={item} />)}
    </Box>
  );
}
