import fetch from "node-fetch";

export function fetchApi<T>(endpoint: string): Promise<T> {
  return fetch(`https://api.guildwars2.com${endpoint}`).then((r) => {
    if(r.status !== 200) {
      throw new Error(`${endpoint} returned ${r.status} ${r.statusText}`);
    }

    return r.json();
  });
}
