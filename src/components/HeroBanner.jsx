import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import { useDetails } from '../context/DetailsContext.jsx';
import { useGenres } from '../context/GenresContext.jsx';
import { backdropUrl, formatRating, formatYear } from '../utils/helpers.js';

const heroHeight = { xs: 'clamp(500px, 80vh, 620px)', md: 'clamp(420px, 70vh, 640px)' };
const sidePad = 'clamp(14px, 4vw, 48px)';
const pillSx = { borderRadius: 999, minHeight: 44, px: 3 };

// Large featured banner that rotates through the trending titles.
export default function HeroBanner({ items = [], loading = false }) {
  const slides = useMemo(() => items.filter((item) => item.backdrop).slice(0, 5), [items]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { openDetails } = useDetails();
  const { map } = useGenres();

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [index, slides.length]);

  if (loading) return <Skeleton variant="rectangular" sx={{ height: heroHeight }} />;
  if (slides.length === 0) return null;

  const item = slides[index] || slides[0];
  const genre = (item.genreIds || []).map((id) => map[id]).find(Boolean) || '';
  const rating = formatRating(item.rating);

  return (
    <Box
      component="section"
      aria-label="Featured titles"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{ position: 'relative', height: heroHeight, overflow: 'hidden', bgcolor: 'background.paper' }}
    >
      <Box
        key={`${item.type}-${item.id}`}
        component="img"
        src={backdropUrl(item.backdrop)}
        alt=""
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
      />
      <Box
        sx={{
          position: 'absolute', inset: 0,
          background: {
            xs: 'linear-gradient(0deg, #0f0f11 4%, rgba(15,15,17,.72) 48%, rgba(15,15,17,.3) 100%)',
            md: 'linear-gradient(90deg, rgba(15,15,17,.95) 0%, rgba(15,15,17,.55) 45%, rgba(15,15,17,.05) 100%), linear-gradient(0deg, #0f0f11 0%, rgba(15,15,17,0) 40%)',
          },
        }}
      />

      <Box sx={{ position: 'absolute', zIndex: 2, left: sidePad, right: sidePad, bottom: { xs: 56, md: 70 }, maxWidth: 600 }}>
        <Typography sx={{ color: 'primary.main', fontWeight: 700, mb: 0.75 }}>
          {item.type === 'tv' ? 'TV show' : 'Movie'}
        </Typography>
        <Typography component="h1" sx={{ fontSize: 'clamp(2rem, 5.5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.025em' }}>
          {item.title}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 16px', my: 1.5, color: '#d7d7df', fontWeight: 600 }}>
          {formatYear(item.date) && <span>{formatYear(item.date)}</span>}
          {genre && <span>{genre}</span>}
          {rating && (
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
              <StarIcon sx={{ fontSize: 18 }} /> {rating}
            </Box>
          )}
        </Box>
        {item.overview && (
          <Typography
            sx={{ color: '#e2e2e8', maxWidth: '54ch', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
          >
            {item.overview}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2.5 }}>
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={() => openDetails(item, { autoplay: true })} sx={pillSx}>
            Play trailer
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => openDetails(item)}
            sx={{ ...pillSx, bgcolor: 'rgba(255,255,255,.08)', borderColor: 'rgba(255,255,255,.28)', '&:hover': { bgcolor: 'rgba(255,255,255,.16)' } }}
          >
            More details
          </Button>
        </Box>
      </Box>

      {slides.length > 1 && (
        <Box role="group" aria-label="Choose featured title" sx={{ position: 'absolute', zIndex: 2, left: sidePad, bottom: { xs: 22, md: 28 }, display: 'flex', gap: 1 }}>
          {slides.map((slide, i) => (
            <Box
              key={`${slide.type}-${slide.id}`}
              component="button"
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${slide.title}`}
              aria-current={i === index}
              sx={{
                width: i === index ? 26 : 9, height: 9, p: 0, border: 0, borderRadius: 999, cursor: 'pointer',
                bgcolor: i === index ? 'primary.main' : 'rgba(255,255,255,.35)', transition: 'width .25s, background-color .25s',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
