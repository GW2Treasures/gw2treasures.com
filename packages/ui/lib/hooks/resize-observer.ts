import { useLayoutEffect, useRef, type RefObject } from 'react';

export function useResizeObserver<T extends HTMLElement>(targetRef: RefObject<T>, callback: (entry: ResizeObserverEntry) => void) {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    const target = targetRef.current;

    if(!target) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      callbackRef.current(entry);
    });

    resizeObserver.observe(target);

    return () => resizeObserver.unobserve(target);
  }, [targetRef]);
}
