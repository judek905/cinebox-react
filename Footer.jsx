import { Box, Typography } from '@mui/material';
import PageContainer from './PageContainer.jsx';

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 7, py: 3.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <PageContainer sx={{ display: 'grid', gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          CineBox is a demo project. It does not host or stream video.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This product uses the TMDB API but is not endorsed or certified by TMDB. Movie and TV information and images come from TMDB.
        </Typography>
      </PageContainer>
    </Box>
  );
}
