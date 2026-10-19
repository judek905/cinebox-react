import HeroBanner from '../components/HeroBanner.jsx';
import MovieRow from '../components/MovieRow.jsx';
import useAsync from '../hooks/useAsync.js';
import { getPopular, getTrending } from '../services/tmdb.js';

// Homepage: featured banner plus three rows of posters, all loaded from TMDB.
export default function HomePage() {
  const trending = useAsync(() => getTrending('all'), []);
  const popularMovies = useAsync(() => getPopular('movie').then((res) => res.results), []);
  const popularShows = useAsync(() => getPopular('tv').then((res) => res.results), []);

  return (
    <>
      <HeroBanner items={trending.data || []} loading={trending.loading} />
      <MovieRow
        title="Trending Now"
        items={(trending.data || []).slice(0, 12)}
        loading={trending.loading}
        error={trending.error}
        onRetry={trending.reload}
      />
      <MovieRow
        title="Popular Movies"
        items={popularMovies.data || []}
        loading={popularMovies.loading}
        error={popularMovies.error}
        onRetry={popularMovies.reload}
      />
      <MovieRow
        title="Popular TV Shows"
        items={popularShows.data || []}
        loading={popularShows.loading}
        error={popularShows.error}
        onRetry={popularShows.reload}
      />
    </>
  );
}
