import fetch from 'node-fetch';
import { db } from '../../db';

export function fetchApi<T>(endpoint: string): Promise<T> {
  const startTime = performance.now();

  return fetch(`https://api.guildwars2.com${endpoint}`).then(async (r) => {
    await db.apiRequest.create({
      data: {
        endpoint: endpoint.split('?')[0],
        queryParameters: endpoint.split('?')[1] ?? '',
        status: r.status,
        statusText: r.statusText,
        responseTimeMs: performance.now() - startTime
      }
    });

    if(r.status !== 200) {
      throw new Error(`${endpoint} returned ${r.status} ${r.statusText}`);
    }

    return r.json();
  });
}
