import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from './fetchApi';
import { groupEntitiesById } from './groupById';

export async function loadCurrencies(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Currency[]>(`/v2/currencies?lang=de&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Currency[]>(`/v2/currencies?lang=en&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Currency[]>(`/v2/currencies?lang=es&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Currency[]>(`/v2/currencies?lang=fr&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} currencies in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupEntitiesById(de, en, es, fr);
}

