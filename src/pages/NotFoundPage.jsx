import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import PageContainer from '../components/PageContainer.jsx';

export default function NotFoundPage() {
  return (
    <PageContainer sx={{ py: 10, textAlign: 'center' }}>
      <Typography component="h1" sx={{ fontSize: '2rem', fontWeight: 800, mb: 1 }}>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The page you opened does not exist or has moved.
      </Typography>
      <Box>
        <Button variant="contained" component={Link} to="/" sx={{ borderRadius: 999, px: 3 }}>
          Back to home
        </Button>
      </Box>
    </PageContainer>
  );
}
