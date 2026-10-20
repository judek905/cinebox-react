import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import DetailsDialog from '../components/DetailsDialog.jsx';

// Lets any poster or button open the details dialog with openDetails(item).
const DetailsContext = createContext({ openDetails: () => {} });

export function DetailsProvider({ children }) {
  const [state, setState] = useState({ item: null, autoplay: false });

  const openDetails = useCallback((item, options = {}) => {
    setState({ item, autoplay: Boolean(options.autoplay) });
  }, []);
  const close = useCallback(() => setState({ item: null, autoplay: false }), []);
  const value = useMemo(() => ({ openDetails }), [openDetails]);

  return (
    <DetailsContext.Provider value={value}>
      {children}
      <DetailsDialog item={state.item} autoplay={state.autoplay} onClose={close} />
    </DetailsContext.Provider>
  );
}

export const useDetails = () => useContext(DetailsContext);
