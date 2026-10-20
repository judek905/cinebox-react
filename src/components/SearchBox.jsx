import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

// Search field in the top bar. Typing updates the /search page after a short
// pause (so TMDB is not called on every key press); Enter searches at once.
export default function SearchBox() {
  const navigate = useNavigate();
  const location = useLocation();
  const onSearchPage = location.pathname === '/search';
  const urlQuery = onSearchPage ? new URLSearchParams(location.search).get('q') || '' : '';
  const [value, setValue] = useState(urlQuery);

  // Keep the box in step with the address bar (Back button, leaving the page).
  useEffect(() => {
    setValue((current) => (current.trim() === urlQuery ? current : urlQuery));
  }, [urlQuery]);

  // Debounced search.
  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === urlQuery) return undefined;
    if (trimmed.length === 1) return undefined;
    if (!trimmed && !onSearchPage) return undefined;
    const timer = setTimeout(() => {
      navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search', { replace: onSearchPage });
    }, 450);
    return () => clearTimeout(timer);
  }, [value, urlQuery, onSearchPage, navigate]);

  const submit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`, { replace: onSearchPage });
  };

  return (
    <Box component="form" role="search" onSubmit={submit} sx={{ width: '100%' }}>
      <TextField
        size="small"
        fullWidth
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search movies, TV shows"
        inputProps={{ 'aria-label': 'Search movies and TV shows' }}
        InputProps={{
          sx: { borderRadius: 999, bgcolor: 'background.paper' },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" aria-label="Clear search" onClick={() => setValue('')} edge="end">
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
}
