import { fetchApi } from './fetchApi';

export async function loadRecipes(ids: number[]) {
  const start = new Date();

  const recipes = await fetchApi(`/v2/recipes?ids=${ids.join(',')}`);

  console.log(`Fetched ${ids.length} recipes in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return recipes;
}

