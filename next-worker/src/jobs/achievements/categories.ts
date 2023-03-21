import { Job } from '../job';
import { loadAchievementCategories } from '../helper/loadAchievements';
import { Gw2Api } from 'gw2-api-types';
import { Language, Prisma, PrismaClient } from '@prisma/client';
import { createRevisions } from '../helper/revision';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { createIcon } from '../helper/createIcon';
import { getIdsFromMap } from '../helper/getIdsFromMap';

export const AchievementCategories: Job = {
  run: async (db) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // get categories from the API
    const categories = await loadAchievementCategories();
    const ids = Array.from(categories.keys());

    // get known ids from the DB
    const knownIds = await db.achievementCategory.findMany({ select: { id: true }}).then((categories) => categories.map(({ id }) => id));
    const knownRemovedIds = await db.achievementCategory.findMany({ select: { id: true }, where: { removedFromApi: true }}).then((categories) => categories.map(({ id }) => id));

    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));
    const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
    const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));
    const updatedIds = ids.filter((id) => knownIds.includes(id) && !rediscoveredIds.includes(id));

    // process categories
    await newCategories(db, buildId, getIdsFromMap(categories, newIds));
    await removedCategories(db, buildId, removedIds);
    await rediscoveredCategories(db, buildId, getIdsFromMap(categories, rediscoveredIds));
    const updated = await updatedCategories(db, buildId, getIdsFromMap(categories, updatedIds));


    return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered, ${updated} updated`;
  }
};

async function newCategories(db: PrismaClient, buildId: number, categories: { [key in Language]: Gw2Api.Achievement.Category }[]) {
  for(const { de, en, es, fr } of categories) {
    const revisions = await createRevisions(db, { de, en, es, fr }, { buildId, type: 'Added', entity: 'AchievementCategory', description: 'Added to API' });
    const iconId = await createIcon(en.icon, db);

    await db.achievementCategory.create({
      data: {
        id: en.id,
        name_de: de.name,
        name_en: en.name,
        name_es: es.name,
        name_fr: fr.name,
        iconId,
        order: en.order,
        version: 0,
        currentId_de: revisions.de.id,
        currentId_en: revisions.en.id,
        currentId_es: revisions.es.id,
        currentId_fr: revisions.fr.id,
        history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }] }},
      }
    });

    await processAchievements(en.id, iconId, en.achievements, en.tomorrow, db);
  }
}

async function removedCategories(db: PrismaClient, buildId: number, removedIds: number[]) {
  for(const removedId of removedIds) {
    const achievementCategory = await db.achievementCategory.findUnique({ where: { id: removedId }, include: { current_de: true, current_en: true, current_es: true, current_fr: true }});

    if(!achievementCategory) {
      continue;
    }

    const update: Prisma.AchievementCategoryUpdateArgs['data'] = {
      removedFromApi: true,
      history: { createMany: { data: [] }}
    };

    // create a new revision
    for(const language of ['de', 'en', 'es', 'fr'] as const) {
      const revision = await db.revision.create({
        data: {
          data: achievementCategory[`current_${language}`].data,
          description: 'Removed from API',
          type: 'Removed',
          entity: 'AchievementCategory',
          language,
          buildId,
        }
      });

      update[`currentId_${language}`] = revision.id;
      update.history!.createMany!.data = [...update.history!.createMany!.data as Prisma.AchievementCategoryHistoryCreateManyAchievementCategoryInput[], { revisionId: revision.id }];
    }

    await db.achievementCategory.update({ where: { id: removedId }, data: update });
  }
}

async function rediscoveredCategories(db: PrismaClient, buildId: number, categories: { [key in Language]: Gw2Api.Achievement.Category }[]) {
  for(const data of categories) {
    const iconId = await createIcon(data.en.icon, db);

    const update: Prisma.AchievementCategoryUpdateArgs['data'] = {
      removedFromApi: false,
      name_de: data.de.name,
      name_en: data.en.name,
      name_es: data.es.name,
      name_fr: data.fr.name,
      order: data.en.order,
      iconId,
      lastCheckedAt: new Date(),
      history: { createMany: { data: [] }}
    };

    // create a new revision
    for(const language of ['de', 'en', 'es', 'fr'] as const) {
      const revision = await db.revision.create({
        data: {
          data: JSON.stringify(data[language]),
          description: 'Rediscovered in API',
          entity: 'AchievementCategory',
          language,
          buildId,
        }
      });

      update[`currentId_${language}`] = revision.id;
      update.history!.createMany!.data = [...update.history!.createMany!.data as Prisma.AchievementCategoryHistoryCreateManyAchievementCategoryInput[], { revisionId: revision.id }];
    }

    await db.achievementCategory.update({ where: { id: data.en.id }, data: update });

    await processAchievements(data.en.id, iconId, data.en.achievements, data.en.tomorrow, db);
  }
}

async function updatedCategories(db: PrismaClient, buildId: number, apiCategories: { [key in Language]: Gw2Api.Achievement.Category }[]) {
  const categoriesToUpdate = await db.achievementCategory.findMany({
    where: { id: { in: apiCategories.map(({ en }) => en.id) }},
    include: { current_de: true, current_en: true, current_es: true, current_fr: true }
  });

  const categories = categoriesToUpdate.map((existing) => ({
    existing,
    ...apiCategories.find(({ en }) => en.id === existing.id)!
  }));

  let updated = 0;

  for(const { existing, de, en, es, fr } of categories) {
    const revision_de = existing.current_de.data !== JSON.stringify(de) ? await db.revision.create({ data: { data: JSON.stringify(de), language: 'de', buildId, type: 'Update', entity: 'AchievementCategory', description: 'Updated in API' }}) : existing.current_de;
    const revision_en = existing.current_en.data !== JSON.stringify(en) ? await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', buildId, type: 'Update', entity: 'AchievementCategory', description: 'Updated in API' }}) : existing.current_en;
    const revision_es = existing.current_es.data !== JSON.stringify(es) ? await db.revision.create({ data: { data: JSON.stringify(es), language: 'es', buildId, type: 'Update', entity: 'AchievementCategory', description: 'Updated in API' }}) : existing.current_es;
    const revision_fr = existing.current_fr.data !== JSON.stringify(fr) ? await db.revision.create({ data: { data: JSON.stringify(fr), language: 'fr', buildId, type: 'Update', entity: 'AchievementCategory', description: 'Updated in API' }}) : existing.current_fr;

    await processAchievements(en.id, existing.iconId ?? undefined, en.achievements, en.tomorrow, db);

    if(revision_de.id !== existing.currentId_de || revision_en.id !== existing.currentId_en || revision_es.id !== existing.currentId_es || revision_fr.id !== existing.currentId_fr) {
      updated++;
    } else {
      continue;
    }

    const iconId = await createIcon(en.icon, db);

    await db.achievementCategory.update({
      where: { id: existing.id }, data: {
        name_de: de.name,
        name_en: en.name,
        name_es: es.name,
        name_fr: fr.name,
        iconId,
        order: en.order,
        currentId_de: revision_de.id,
        currentId_en: revision_en.id,
        currentId_es: revision_es.id,
        currentId_fr: revision_fr.id,
        lastCheckedAt: new Date(),
        version: 0,
        history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }], skipDuplicates: true }}
      }
    });
  }

  return updated;
}

async function processAchievements(id: number, iconId: number | undefined, achievements: Gw2Api.Achievement.Category['achievements'], tomorrow: Gw2Api.Achievement.Category['tomorrow'], db: PrismaClient) {
  const achievementIds = [...achievements, ...(tomorrow ?? [])].map(({ id }) => id);

  await Promise.all([
    // set previous achievements to historic
    db.achievement.updateMany({
      where: { id: { notIn: achievementIds }, achievementCategoryId: id },
      data: { historic: true },
    }),

    // set achievement category
    db.achievement.updateMany({
      where: { id: { in: achievementIds }},
      data: { achievementCategoryId: id, historic: false },
    }),

    // set icon if the achievement does not have an icon yet
    db.achievement.updateMany({
      where: { achievementCategoryId: id, iconId: null },
      data: { iconId },
    }),
  ]);
}
