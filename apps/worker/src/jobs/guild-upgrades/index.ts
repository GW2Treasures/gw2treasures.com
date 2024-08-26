import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { loadGuildUpgrades } from '../helper/loadGuildUpgrades';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { type ProcessEntitiesData, createSubJobs, processLocalizedEntities, Changes } from '../helper/process-entities';
import { Prisma } from '@gw2treasures/database';
import { createIcon } from '../helper/createIcon';

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
        const ingredients = changes === Changes.New
          ? await db.recipeIngredient.findMany({ where: { type: 'GuildUpgrade', ingredientId: guildUpgrade.en.id }, select: { recipeId: true }})
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

          ingredient: { connect: ingredients.map(({ recipeId }) => ({ recipeId_type_ingredientId: { recipeId, type: 'GuildUpgrade', ingredientId: guildUpgrade.en.id }})) },
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
