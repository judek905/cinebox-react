import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import GenreFilter from '../components/GenreFilter.jsx';
import MovieGrid from '../components/MovieGrid.jsx';
import PageContainer from '../components/PageContainer.jsx';
import { useGenres } from '../context/GenresContext.jsx';
import usePagedList from '../hooks/usePagedList.js';
import { discover } from '../services/tmdb.js';

// Shared by the Movies and TV Shows pages: genre filter, grid and Load more.
export default function CatalogPage({ type, heading }) {
  const genres = useGenres();
  const [genre, setGenre] = useState('');
  const list = usePagedList((page) => discover({ type, genre, page }), [type, genre]);
  const selectedName = (type === 'tv' ? genres.tv : genres.movie).find((g) => String(g.id) === String(genre))?.name;

  return (
    <PageContainer sx={{ pt: 4, pb: 6 }}>
      <Typography component="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 800, mb: 2.5 }}>
        {heading}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <GenreFilter genres={type === 'tv' ? genres.tv : genres.movie} value={genre} onChange={setGenre} />
      </Box>

      <MovieGrid
        items={list.items}
        loading={list.loading}
        error={list.error}
        onRetry={list.retry}
        emptyMessage={`No ${type === 'tv' ? 'TV shows' : 'movies'}${selectedName ? ` in ${selectedName}` : ''} found.`}
      />

      {list.hasMore && !list.error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4.5 }}>
          <Button variant="outlined" color="inherit" onClick={list.loadMore} disabled={list.loading} sx={{ borderRadius: 999, px: 4, minHeight: 44 }}>
            {list.loading ? 'Loading' : 'Load more'}
          </Button>
        </Box>
      )}
    </PageContainer>
  );
}
