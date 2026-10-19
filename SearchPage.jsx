import { useSearchParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import MovieGrid from '../components/MovieGrid.jsx';
import PageContainer from '../components/PageContainer.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import usePagedList from '../hooks/usePagedList.js';
import { searchTitles } from '../services/tmdb.js';

// Search results come from the TMDB search endpoint.
export default function SearchPage() {
  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim();
  const list = usePagedList(
    (page) => (query ? searchTitles(query, page) : Promise.resolve({ results: [], totalPages: 1 })),
    [query],
  );

  if (!query) {
    return (
      <PageContainer sx={{ pt: 4, pb: 6 }}>
        <Typography component="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 800 }}>
          Search
        </Typography>
        <StatusMessage message="Type a movie or TV show title in the search box to see results." />
      </PageContainer>
    );
  }

  return (
    <PageContainer sx={{ pt: 4, pb: 6 }}>
      <Typography component="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 800, mb: 3 }}>
        Results for &ldquo;{query}&rdquo;
      </Typography>

      {list.loading && list.items.length === 0 && !list.error && <StatusMessage type="loading" />}

      {!(list.loading && list.items.length === 0) && (
        <MovieGrid
          items={list.items}
          loading={false}
          error={list.error}
          onRetry={list.retry}
          emptyMessage={`No results for "${query}". Check the spelling or try another title.`}
        />
      )}

      {list.hasMore && !list.error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4.5 }}>
          <Button variant="outlined" color="inherit" onClick={list.loadMore} disabled={list.loading} sx={{ borderRadius: 999, px: 4, minHeight: 44 }}>
            {list.loading ? 'Loading' : 'Load more results'}
          </Button>
        </Box>
      )}
    </PageContainer>
  );
}
