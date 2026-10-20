import { Box, Chip } from '@mui/material';

// Genre chips. `genres` comes from the TMDB genre list; value is a genre id or ''.
export default function GenreFilter({ genres = [], value, onChange }) {
  return (
    <Box
      role="group"
      aria-label="Filter by genre"
      sx={{
        display: 'flex', gap: 1, flexWrap: { xs: 'nowrap', md: 'wrap' }, overflowX: { xs: 'auto', md: 'visible' },
        pb: { xs: 1, md: 0 }, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Chip
        label="All genres"
        clickable
        onClick={() => onChange('')}
        color={value === '' ? 'primary' : 'default'}
        variant={value === '' ? 'filled' : 'outlined'}
        aria-pressed={value === ''}
        sx={{ fontWeight: 600, flex: 'none' }}
      />
      {genres.map((genre) => {
        const selected = String(value) === String(genre.id);
        return (
          <Chip
            key={genre.id}
            label={genre.name}
            clickable
            onClick={() => onChange(genre.id)}
            color={selected ? 'primary' : 'default'}
            variant={selected ? 'filled' : 'outlined'}
            aria-pressed={selected}
            sx={{ fontWeight: 600, flex: 'none' }}
          />
        );
      })}
    </Box>
  );
}
