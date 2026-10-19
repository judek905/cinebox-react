import { Box } from '@mui/material';

export default function Logo({ size = 28 }) {
  return (
    <Box component="svg" viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" sx={{ flex: 'none' }}>
      <rect width="28" height="28" rx="8" fill="#1fd16a" />
      <path d="M11 8v12l10-6z" fill="#04210f" />
    </Box>
  );
}
