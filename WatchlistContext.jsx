import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { keyOf } from '../utils/helpers.js';

// The watchlist is saved in localStorage, so it stays after a refresh.
// It lives in this browser only: there are no accounts and nothing syncs.
const STORAGE_KEY = 'cinebox-watchlist';

function load() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

const WatchlistContext = createContext({ items: [], has: () => false, toggle: () => {}, clear: () => {} });

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable, the list just will not persist */
    }
  }, [items]);

  const has = useCallback((item) => items.some((saved) => keyOf(saved) === keyOf(item)), [items]);

  const toggle = useCallback((item) => {
    setItems((current) =>
      current.some((saved) => keyOf(saved) === keyOf(item))
        ? current.filter((saved) => keyOf(saved) !== keyOf(item))
        : [
            {
              id: item.id,
              type: item.type,
              title: item.title,
              date: item.date,
              rating: item.rating,
              genreIds: item.genreIds || [],
              poster: item.poster,
              backdrop: item.backdrop,
              overview: item.overview,
            },
            ...current,
          ],
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, has, toggle, clear }), [items, has, toggle, clear]);

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export const useWatchlist = () => useContext(WatchlistContext);
