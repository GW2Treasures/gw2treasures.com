import { Job } from '../job';
import { db } from '../../db';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { loadItems } from '../helper/loadItems';
import { createIcon } from '../helper/createIcon';
import { createRevisions } from '../helper/revision';
import { createMigrator } from './migrations';

export const ItemsNew: Job = {
  run: async (newIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    // load items from API
    const items = await loadItems(newIds);

    const migrate = await createMigrator();

    for(const [id, { de, en, es, fr }] of items) {
      const revisions = await createRevisions({ de, en, es, fr }, { buildId, type: 'Added', entity: 'Item', description: 'Added to API' });
      const data = await migrate({ de, en, es, fr });

      const iconId = await createIcon(en.icon);

      const achievementBit = await db.achievement.findMany({ where: { bitsItemIds: { has: id }}, select: { id: true }});
      const achievementReward = await db.achievement.findMany({ where: { rewardsItemIds: { has: id }}, select: { id: true }});
      const suffixIn = await db.item.findMany({ where: { suffixItemIds: { has: id }}, select: { id: true }});
      const recipeOutput = await db.recipe.findMany({ where: { outputItemIdRaw: id }, select: { id: true }});
      const wizardsVaultListing = await db.wizardsVaultListing.findMany({ where: { itemIdRaw: id }, select: { id: true }});
      const homesteadGlyphs = await db.homesteadGlyph.findMany({ where: { itemIdRaw: id }, select: { id: true }});
      const unlocksOutfits = await db.outfit.findMany({ where: { unlockedByItemIds: { has: id }}, select: { id: true }});
      const unlocksGliders = await db.glider.findMany({ where: { unlockedByItemIds: { has: id }}, select: { id: true }});
      const ingredients = await db.recipeIngredient.findMany({ where: { type: 'Item', ingredientId: en.id }, select: { recipeId: true }});

      await db.item.create({
        data: {
          id,
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          iconId,
          rarity: en.rarity,

          ...data,

          currentId_de: revisions.de.id,
          currentId_en: revisions.en.id,
          currentId_es: revisions.es.id,
          currentId_fr: revisions.fr.id,
          history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }] }},

          // connect to existing entities
          achievementBits: { connect: achievementBit },
          achievementRewards: { connect: achievementReward },
          suffixIn: { connect: suffixIn },
          recipeOutput: { connect: recipeOutput },
          wizardsVaultListings: { connect: wizardsVaultListing },
          homesteadGlyphs: { connect: homesteadGlyphs },
          unlocksOutfits: { connect: unlocksOutfits },
          unlocksGliders: { connect: unlocksGliders },
          ingredient: { connect: ingredients.map(({ recipeId }) => ({ recipeId_type_ingredientId: { recipeId, type: 'Item', ingredientId: en.id }})) },
        }
      });
    }

    return `Added ${items.size} items`;
  }
};
