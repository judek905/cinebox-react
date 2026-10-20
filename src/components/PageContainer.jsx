import { Box } from '@mui/material';

// Keeps page content centred with consistent side spacing.
export default function PageContainer({ children, sx }) {
  return <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, sm: 3, md: 6 }, ...sx }}>{children}</Box>;
}
