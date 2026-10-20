import { createContext, useContext, useEffect, useState } from 'react';
import { getGenres } from '../services/tmdb.js';

// Loads the genre lists from TMDB once and shares them with every component.
const GenresContext = createContext({ movie: [], tv: [], map: {} });

export function GenresProvider({ children }) {
  const [genres, setGenres] = useState({ movie: [], tv: [], map: {} });

  useEffect(() => {
    let cancelled = false;
    getGenres()
      .then((data) => {
        if (!cancelled) setGenres(data);
      })
      .catch(() => {
        /* pages show their own error message; genre names are optional */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>;
}

export const useGenres = () => useContext(GenresContext);
