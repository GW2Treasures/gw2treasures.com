import chalk from 'chalk';
import { db } from '../../db';

export function fetchApi<T>(endpoint: string): Promise<T> {
  const startTime = performance.now();

  return fetch(`https://api.guildwars2.com${endpoint}`, { headers: { 'X-Schema-Version': '2022-03-23T19:00:00.000Z' }}).then(async (r) => {
    await db.apiRequest.create({
      data: {
        endpoint: endpoint.split('?')[0],
        queryParameters: endpoint.split('?')[1] ?? '',
        status: r.status,
        statusText: r.statusText,
        responseTimeMs: performance.now() - startTime
      }
    });

    if(![200, 206].includes(r.status)) {
      throw new Error(`${endpoint} returned ${r.status} ${r.statusText}`);
    }

    if(r.status === 206) {
      console.warn(`${chalk.yellow('▲')} ${chalk.blue(endpoint)} returned ${r.status} ${r.statusText}`);
    }

    return r.json() as Promise<T>;
  });
}
