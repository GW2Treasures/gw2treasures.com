import { fetchApi } from './fetchApi';
import { groupLocalizedEntitiesById } from './groupById';

export async function loadCurrencies(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi(`/v2/currencies?ids=${ids.join(',')}`, { language: 'de' }),
    fetchApi(`/v2/currencies?ids=${ids.join(',')}`, { language: 'en' }),
    fetchApi(`/v2/currencies?ids=${ids.join(',')}`, { language: 'es' }),
    fetchApi(`/v2/currencies?ids=${ids.join(',')}`, { language: 'fr' }),
  ]);

  console.log(`Fetched ${ids.length} currencies in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}

