import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

export function useResizeObserver<T extends HTMLElement>(targetRef: RefObject<T | null>, callback: (entry: ResizeObserverEntry) => void) {
  const callbackRef = useRef(callback);
  const resizeObserver = getResizeObserver();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useLayoutEffect(() => {
    const target = targetRef.current;

    if(!target) {
      return;
    }

    const unsubscribe = resizeObserver.subscribe(target, (entry) => callbackRef.current(entry));

    return unsubscribe;
  }, [resizeObserver, targetRef]);
}

let globalResizeObserver: {
  subscribe: (element: Element, callback: (entry: ResizeObserverEntry) => void) => () => void,
};

function getResizeObserver() {
  if(typeof window === 'undefined') {
    return { subscribe: () => () => {} };
  }

  if(!globalResizeObserver) {
    const subscriptions: {
      target: Element,
      callback: (entry: ResizeObserverEntry) => void,
    }[] = [];

    const observer = new ResizeObserver((entries) => {
      for(const entry of entries) {
        subscriptions.filter(({ target }) => entry.target === target).forEach(({ callback }) => callback(entry));
      }
    });

    globalResizeObserver = {
      subscribe(target, callback) {
        const index = subscriptions.length;
        subscriptions.push({ target, callback });
        observer.observe(target);
        return () => {
          subscriptions.splice(index, 1);
          if(!subscriptions.some((otherSubscription) => otherSubscription.target === target)) {
            observer.unobserve(target);
          }
        };
      }
    };
  }

  return globalResizeObserver;
}
