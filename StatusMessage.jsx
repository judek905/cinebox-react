import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';

// One place for the three non-content states: loading, error and empty.
export default function StatusMessage({ type = 'empty', message, onRetry }) {
  if (type === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }} role="status">
        <CircularProgress color="primary" aria-label="Loading" />
      </Box>
    );
  }
  if (type === 'error') {
    return (
      <Alert
        severity="error"
        sx={{ my: 2 }}
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              Try again
            </Button>
          ) : undefined
        }
      >
        {message}
      </Alert>
    );
  }
  return (
    <Typography color="text.secondary" align="center" sx={{ py: 5 }}>
      {message}
    </Typography>
  );
}
