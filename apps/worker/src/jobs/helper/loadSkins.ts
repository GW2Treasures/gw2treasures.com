import { fetchApi } from './fetchApi';
import { groupLocalizedEntitiesById } from './groupById';

export async function loadSkins(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi(`/v2/skins?ids=${ids.join(',')}`, { language: 'de' }),
    fetchApi(`/v2/skins?ids=${ids.join(',')}`, { language: 'en' }),
    fetchApi(`/v2/skins?ids=${ids.join(',')}`, { language: 'es' }),
    fetchApi(`/v2/skins?ids=${ids.join(',')}`, { language: 'fr' }),
  ]);

  console.log(`Fetched ${ids.length} skins in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}
