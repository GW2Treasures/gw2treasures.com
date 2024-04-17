import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, durationMs: number) {
  const ref = useRef(callback);

  // update ref to callback
  useEffect(() => ref.current = callback, [callback]);

  useEffect(() => {
    // call callback once at start
    ref.current();

    // start interval and call ref
    const interval = setInterval(
      () => ref.current(),
      durationMs
    );

    // clear interval
    return () => clearInterval(interval);
  }, [durationMs]);
}
