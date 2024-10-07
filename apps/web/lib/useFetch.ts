import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

export function createAbortableFetch(url: string) {
  const abortController = new AbortController();

  const promise = fetch(url, { signal: abortController.signal }).then((response) => {
    if(response.ok) {
      return response.json();
    }

    throw new Error(`Request failed: ${url}`);
  });

  return { promise, abort: () => { abortController.abort(); } };
}

export function useJsonFetchPromise<T = unknown>(url: string): Promise<T> {
  const abortRef = useRef<() => void>(null);

  return useMemo(() => {
    abortRef.current?.();

    const { abort, promise } = createAbortableFetch(url);
    abortRef.current = abort;

    return promise;
  }, [url]);
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
