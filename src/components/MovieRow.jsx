import { useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MovieCard, { CardSkeleton } from './MovieCard.jsx';
import Section from './Section.jsx';
import StatusMessage from './StatusMessage.jsx';
import { friendlyError } from '../services/tmdb.js';
import { keyOf } from '../utils/helpers.js';

const trackSx = {
  display: 'flex', gap: '14px', overflowX: 'auto', pb: 1.5, scrollSnapType: 'x proximity',
  '& > *': { flex: '0 0 clamp(130px, 15vw, 180px)', scrollSnapAlign: 'start' },
};

// A horizontally scrolling row of posters with left and right arrows.
export default function MovieRow({ title, items = [], loading = false, error = null, onRetry }) {
  const track = useRef(null);

  const scroll = (direction) => {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const arrows = (
    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
      <IconButton size="small" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`} sx={{ bgcolor: 'background.paper' }}>
        <ChevronLeftIcon />
      </IconButton>
      <IconButton size="small" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`} sx={{ bgcolor: 'background.paper' }}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );

  let body;
  if (loading) {
    body = (
      <Box sx={trackSx} aria-busy="true">
        {Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)}
      </Box>
    );
  } else if (error) {
    body = <StatusMessage type="error" message={friendlyError(error)} onRetry={onRetry} />;
  } else if (items.length === 0) {
    body = <StatusMessage message="Nothing to show here yet." />;
  } else {
    body = (
      <Box ref={track} className="row-track" tabIndex={0} aria-label={title} sx={trackSx}>
        {items.map((item) => (
          <Box key={keyOf(item)}>
            <MovieCard item={item} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Section title={title} actions={!loading && !error && items.length > 0 ? arrows : null}>
      {body}
    </Section>
  );
}
