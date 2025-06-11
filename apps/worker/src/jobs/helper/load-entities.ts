import { EndpointType, KnownBulkExpandedEndpoint, KnownLocalizedEndpoint } from '@gw2api/types/endpoints';
import { fetchApi } from './fetchApi';
import { groupLocalizedEntitiesById } from './groupById';
import { SchemaVersion } from './schema';
import { LocalizedObject } from './types';
import { groupById } from '@gw2treasures/helper/group-by';

type ModelOfBulkEndpoint<E extends KnownBulkExpandedEndpoint> = EndpointType<`${E}?ids=$`, SchemaVersion> extends Array<infer T> ? T : never;

export async function loadEntities<Endpoint extends Exclude<KnownBulkExpandedEndpoint, KnownLocalizedEndpoint | '/v2/characters'>>(
  endpoint: Endpoint,
  ids: EndpointType<Endpoint>,
): Promise<Map<EndpointType<Endpoint>[number], ModelOfBulkEndpoint<Endpoint>>> {
  const start = new Date();

  // @ts-expect-error TS is not smart enough here (or I'm not smart enough for those deeply nested generics)
  const entities = await fetchApi(`${endpoint}?ids=${ids.join(',')}`) as (ModelOfBulkEndpoint<Endpoint> & { id: string | number })[];

  console.log(`Fetched ${ids.length} entities in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupById(entities);
}

export async function loadLocalizedEntities<Endpoint extends KnownBulkExpandedEndpoint & KnownLocalizedEndpoint>(
  endpoint: Endpoint,
  ids: EndpointType<Endpoint>,
): Promise<Map<EndpointType<Endpoint>[number], LocalizedObject<ModelOfBulkEndpoint<Endpoint>>>> {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    // @ts-expect-error TS is not smart enough here (or I'm not smart enough for those deeply nested generics)
    fetchApi(`${endpoint}?ids=${ids.join(',')}`, { language: 'de' }) as Promise<(ModelOfBulkEndpoint<Endpoint> & { id: string | number })[]>,
    // @ts-expect-error TS is not smart enough here (or I'm not smart enough for those deeply nested generics)
    fetchApi(`${endpoint}?ids=${ids.join(',')}`, { language: 'en' }) as Promise<(ModelOfBulkEndpoint<Endpoint> & { id: string | number })[]>,
    // @ts-expect-error TS is not smart enough here (or I'm not smart enough for those deeply nested generics)
    fetchApi(`${endpoint}?ids=${ids.join(',')}`, { language: 'es' }) as Promise<(ModelOfBulkEndpoint<Endpoint> & { id: string | number })[]>,
    // @ts-expect-error TS is not smart enough here (or I'm not smart enough for those deeply nested generics)
    fetchApi(`${endpoint}?ids=${ids.join(',')}`, { language: 'fr' }) as Promise<(ModelOfBulkEndpoint<Endpoint> & { id: string | number })[]>,
  ]);

  console.log(`Fetched ${ids.length} entities in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}
