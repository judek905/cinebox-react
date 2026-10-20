import { Box, Typography } from '@mui/material';
import PageContainer from './PageContainer.jsx';

// A titled block of the homepage (heading on the left, optional controls on the right).
export default function Section({ title, actions, children }) {
  return (
    <PageContainer sx={{ pt: 3.25, pb: 0.5 }}>
      <Box component="section" aria-label={title}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.75 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.6rem' } }}>
            {title}
          </Typography>
          {actions}
        </Box>
        {children}
      </Box>
    </PageContainer>
  );
}
