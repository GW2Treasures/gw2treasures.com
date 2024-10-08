import { useCallback, useEffect, useMemo, useState } from 'react';

export function useFetch(url: string, callback: (response: Response) => void) {
  const [, setError] = useState();

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(callback)
      .catch((error) => error.name !== 'AbortError' && setError(() => { throw error; }));

    return () => controller.abort();
  }, [url, callback]);
}

type UseJsonFetchResult<T> = { loading: true } | { loading: false, data: T };

export function useJsonFetch<T = unknown>(url: string): UseJsonFetchResult<T> {
  const [data, setData] = useState<UseJsonFetchResult<T>>({ loading: true });

  useFetch(url, useCallback((response) => {
    if(!response.ok) {
      //throw new Error(`${response.status} ${response.statusText}`);
      return;
    }

    response.json().then((data: T) => setData({ loading: false, data }));
  }, []));

  useEffect(() => {
    setData({ loading: true });
  }, [url]);

  return data;
}

const fetchCache: Record<string, { time: number, promise: Promise<unknown> }> = {};

export function createCachedFetch(url: string) {
  // get the current timestamp
  const now = performance.timeOrigin + performance.now();

  // if we have a cached entry from withing the last 60s, use it
  if(fetchCache[url] && fetchCache[url].time > now - 60_000) {
    return fetchCache[url].promise;
  }

  // do the fetch
  const promise = fetch(url).then((response) => {
    if(response.ok) {
      return response.json();
    }

    throw new Error(`Request failed: ${url}`);
  }).catch((error) => {
    // remove the failed fetch from the cache
    delete fetchCache[url];

    throw error;
  });

  // add promise to the cache
  fetchCache[url] = { time: now, promise };

  return promise;
}

export function useJsonFetchPromise<T = unknown>(url: string): Promise<T> {
  return useMemo(() => createCachedFetch(url), [url]);
}

export function useStaleJsonResponse<T = unknown>(response: UseJsonFetchResult<T>): UseJsonFetchResult<T> {
  const [staleResponse, setStaleResponse] = useState(response);

  useEffect(() => {
    if(!response.loading) {
      setStaleResponse(response);
    }
  }, [response]);

  return staleResponse;
}
