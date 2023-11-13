import type { Language } from '@gw2treasures/database';
import type { Gw2Api } from 'gw2-api-types';

type KnwownAuthorizedEndpoints =
  | '/v2/characters'
  | '/v2/characters?ids='

type KnownUnauthorizedEndpoints =
  | '/v2/quaggans'

type KnwownEndpoints = KnwownAuthorizedEndpoints | KnownUnauthorizedEndpoints;

type EndpointType<T extends string> =
  T extends '/v2/quaggans' ? string[] :
  T extends `/v2/characters?ids=${string}` ? { name: string }[] :
  T extends '/v2/characters' ? string[] :
  T extends `/v2/items/${string}` ? Gw2Api.Item :
  unknown;

export async function fetchGw2Api<Endpoint extends KnwownEndpoints | (string & {})>(endpoint: Endpoint, options?: { token?: string, language?: Language }): Promise<EndpointType<Endpoint>> {
  const url = new URL(endpoint, 'https://api.guildwars2.com');

  if(options?.token) {
    url.searchParams.append('access_token', options.token);
  }
  if(options?.language) {
    url.searchParams.append('lang', options.language);
  }


  const response = await fetch(url);

  if(!response.ok || response.headers.get('content-type') !== 'application/json') {
    throw new Error('Invalid Response from GW2 API');
  }

  return response.json();
}
