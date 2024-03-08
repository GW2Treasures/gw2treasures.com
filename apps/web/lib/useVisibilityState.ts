import { useEffect, useState } from 'react';

export function useVisibilityState() {
  // the current visibility state, defaults to visible for SSR
  const [state, setState] = useState<DocumentVisibilityState>('visible');

  useEffect(() => {
    // set initial visibility
    setState(document.visibilityState);

    // add event handler to update the visibility state
    const handler = () => setState(document.visibilityState);
    document.addEventListener('visibilitychange', handler);

    // remove event handler when the hook is unmounted
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  return state;
}
