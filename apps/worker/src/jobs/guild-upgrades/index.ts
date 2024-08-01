import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { loadGuildUpgrades } from '../helper/loadGuildUpgrades';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { type ProcessEntitiesData, createSubJobs, processLocalizedEntities, Changes } from '../helper/process-entities';
import { Prisma } from '@gw2treasures/database';
import { createIcon } from '../helper/createIcon';
import { Recipe } from '@gw2api/types/data/recipe';
import { SchemaVersion } from '../helper/schema';

export const GuildUpgradesJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if(isEmptyObject(data)) {
      return createSubJobs(
        'guild-upgrades',
        () => fetchApi('/v2/guild/upgrades'),
        db.guildUpgrade.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'GuildUpgrade',
      (guildUpgradeId, revisionId) => ({ guildUpgradeId_revisionId: { revisionId, guildUpgradeId }}),
      async (guildUpgrade, version, changes) => {
        const ingredientRecipeIds = changes === Changes.New
          ? await getGuildUpgradeIngredient(guildUpgrade.en.id)
          : [];

        const recipeOutput = changes === Changes.New
          ? await db.recipe.findMany({ where: { outputGuildUpgradeIdRaw: guildUpgrade.en.id }, select: { id: true }})
          : [];

        const itemUnlocks = changes === Changes.New
          ? await db.item.findMany({ where: { unlocksGuildUpgradeIds: { has: guildUpgrade.en.id }}, select: { id: true }})
          : [];

        const iconId = await createIcon(guildUpgrade.en.icon);

        return {
          name_de: guildUpgrade.de.name,
          name_en: guildUpgrade.en.name,
          name_es: guildUpgrade.es.name,
          name_fr: guildUpgrade.fr.name,
          iconId,

          ingredient: { createMany: { data: ingredientRecipeIds }},
          recipeOutput: { connect: recipeOutput },
          unlockedByItems: { connect: itemUnlocks },
        } satisfies Prisma.GuildUpgradeUncheckedUpdateInput;
      },
      db.guildUpgrade.findMany,
      loadGuildUpgrades,
      (tx, data) => tx.guildUpgrade.create(data),
      (tx, data) => tx.guildUpgrade.update(data),
      CURRENT_VERSION
    );
  }
};

async function getGuildUpgradeIngredient(guildUpgradeId: number) {
  const recipes = await db.recipe.findMany({ where: { guildUpgradeIngredientIds: { has: guildUpgradeId }}, select: { id: true, currentRevision: true }});

  return recipes.map((recipe) => {
    const data: Recipe<SchemaVersion> = JSON.parse(recipe.currentRevision.data);
    const count = data.ingredients.find((ingredient) => ingredient.id === guildUpgradeId && ingredient.type === 'GuildUpgrade')?.count ?? 1;

    return { recipeId: recipe.id, count };
  });
}
