import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme.js';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import { DetailsProvider } from './context/DetailsContext.jsx';
import { GenresProvider } from './context/GenresContext.jsx';
import { WatchlistProvider } from './context/WatchlistContext.jsx';
import HomePage from './pages/HomePage.jsx';
import MoviesPage from './pages/MoviesPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import TVShowsPage from './pages/TVShowsPage.jsx';
import WatchlistPage from './pages/WatchlistPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GenresProvider>
        <WatchlistProvider>
          <DetailsProvider>
            <ScrollToTop />
            <Navbar />
            <Box component="main" sx={{ minHeight: '70vh' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/tv" element={<TVShowsPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Box>
            <Footer />
          </DetailsProvider>
        </WatchlistProvider>
      </GenresProvider>
    </ThemeProvider>
  );
}
