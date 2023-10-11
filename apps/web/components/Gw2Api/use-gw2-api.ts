import { useEffect, useState } from 'react';

const cache: Record<string, Promise<unknown>> = {};

export function useGw2Api<T>(endpoint: string): undefined | T {
  const [data, setData] = useState<T | undefined>(undefined);

  const url = new URL(endpoint, 'https://api.guildwars2.com/').toString();

  useEffect(() => {
    if(cache[url] === undefined) {
      cache[url] = fetch(url).then((r) => r.json());
    }

    cache[url].then((data) => {
      setData(data as T);
    });
  }, [url]);

  return data;
}
