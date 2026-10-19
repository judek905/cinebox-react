import { useEffect, useRef, useState } from 'react';
import { keyOf } from '../utils/helpers.js';

// Loads a paginated list. It starts over when `deps` change and supports
// "Load more". `fetchPage(page)` must return { results, totalPages }.
export default function usePagedList(fetchPage, deps) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);
  const depsKey = JSON.stringify(deps);
  const lastKey = useRef(depsKey);

  useEffect(() => {
    if (lastKey.current !== depsKey) {
      lastKey.current = depsKey;
      setItems([]);
      setTotalPages(1);
      if (page !== 1) {
        setPage(1);
        return undefined;
      }
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPage(page)
      .then((res) => {
        if (cancelled) return;
        setItems((prev) => {
          if (page === 1) return res.results;
          const seen = new Set(prev.map(keyOf));
          return [...prev, ...res.results.filter((item) => !seen.has(keyOf(item)))];
        });
        setTotalPages(res.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, depsKey, tick]);

  return {
    items,
    loading,
    error,
    hasMore: page < totalPages,
    loadMore: () => setPage((p) => p + 1),
    retry: () => setTick((n) => n + 1),
  };
}
