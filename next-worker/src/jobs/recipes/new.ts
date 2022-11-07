import { Job } from '../job';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import fetch from 'node-fetch';
import { Gw2Api } from 'gw2-api-types';

export const RecipesNew: Job = {
  run: async (db, newIds: number[]) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // load recipes from API
    const recipes = await fetch(`https://api.guildwars2.com/v2/recipes?ids=${newIds.join(',')}`).then(r => r.json() as Promise<Gw2Api.Recipe[]>);

    for(const recipe of recipes) {
      const revision = await db.revision.create({ data: { data: JSON.stringify(recipe), language: 'en', buildId, description: 'Added to API' } });

      const i = await db.recipe.create({ data: {
        id: recipe.id,
        type: recipe.type,
        rating: recipe.min_rating,
        disciplines: recipe.disciplines,
        outputCount: recipe.output_item_count,
        outputItemId: recipe.output_item_id,
        timeToCraftMs: recipe.time_to_craft_ms,
        currentRevisionId: revision.id,
        history: { connect: { id: revision.id } },
      }});
    }

    return `Added ${recipes.length} recipes`;
  }
}
