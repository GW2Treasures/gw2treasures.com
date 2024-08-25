import { groupById } from '@gw2treasures/helper/group-by';
import { fetchApi } from './fetchApi';
import { groupLocalizedEntitiesById } from './groupById';

export async function loadHomesteadDecorations(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi(`/v2/homestead/decorations?ids=${ids.join(',')}`, { language: 'de' }),
    fetchApi(`/v2/homestead/decorations?ids=${ids.join(',')}`, { language: 'en' }),
    fetchApi(`/v2/homestead/decorations?ids=${ids.join(',')}`, { language: 'es' }),
    fetchApi(`/v2/homestead/decorations?ids=${ids.join(',')}`, { language: 'fr' }),
  ]);

  console.log(`Fetched ${ids.length} homestead decorations in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}


export async function loadHomesteadDecorationCategories(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi(`/v2/homestead/decorations/categories?ids=${ids.join(',')}`, { language: 'de' }),
    fetchApi(`/v2/homestead/decorations/categories?ids=${ids.join(',')}`, { language: 'en' }),
    fetchApi(`/v2/homestead/decorations/categories?ids=${ids.join(',')}`, { language: 'es' }),
    fetchApi(`/v2/homestead/decorations/categories?ids=${ids.join(',')}`, { language: 'fr' }),
  ]);

  console.log(`Fetched ${ids.length} homestead decoration categories in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}


export async function loadHomesteadGlyphs(ids: string[]) {
  const start = new Date();

  const glyphs = await fetchApi(`/v2/homestead/glyphs?ids=${ids.join(',')}`);

  console.log(`Fetched ${ids.length} homestead decoration categories in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupById(glyphs);
}
