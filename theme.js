import { createTheme } from '@mui/material/styles';

// Dark theme with the CineBox green accent.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1fd16a', contrastText: '#04210f' },
    background: { default: '#0f0f11', paper: '#18181c' },
    text: { primary: '#f4f4f6', secondary: '#9a9aa6' },
    divider: '#2b2b33',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { overflowX: 'hidden' } },
    },
  },
});

export default theme;
