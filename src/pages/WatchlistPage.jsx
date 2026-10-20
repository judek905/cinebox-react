import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import MovieGrid from '../components/MovieGrid.jsx';
import PageContainer from '../components/PageContainer.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import { useWatchlist } from '../context/WatchlistContext.jsx';

// Saved titles. Use the bookmark on a poster (or in the details view) to remove one.
export default function WatchlistPage() {
  const { items, clear } = useWatchlist();

  return (
    <PageContainer sx={{ pt: 4, pb: 6 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Typography component="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 800 }}>
          My Watchlist
        </Typography>
        {items.length > 0 && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              if (window.confirm('Remove every title from your watchlist?')) clear();
            }}
            sx={{ borderRadius: 999 }}
          >
            Clear watchlist
          </Button>
        )}
      </Box>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center' }}>
          <StatusMessage message="Your watchlist is empty. Select the bookmark on any poster to save it here." />
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" component={Link} to="/movies" sx={{ borderRadius: 999, px: 3 }}>
              Browse movies
            </Button>
            <Button variant="outlined" color="inherit" component={Link} to="/tv" sx={{ borderRadius: 999, px: 3 }}>
              Browse TV shows
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Typography color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
            {items.length} saved {items.length === 1 ? 'title' : 'titles'}. Saved in this browser only.
          </Typography>
          <MovieGrid items={items} />
        </>
      )}
    </PageContainer>
  );
}
