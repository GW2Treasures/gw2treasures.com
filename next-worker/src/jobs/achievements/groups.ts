import { Job } from '../job';
import { loadAchievementGroups } from '../helper/loadAchievements';
import { Gw2Api } from 'gw2-api-types';
import { Language, Prisma, PrismaClient } from '@prisma/client';
import { createRevisions } from '../helper/revision';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { getIdsFromMap } from '../helper/getIdsFromMap';
import { appendHistory } from '../helper/appendHistory';

export const AchievementGroups: Job = {
  run: async (db) => {
    const build = await getCurrentBuild(db);
    const buildId = build.id;

    // get groups from the API
    const groups = await loadAchievementGroups();
    const ids = Array.from(groups.keys());

    // get known ids from the DB
    const knownIds = await db.achievementGroup.findMany({ select: { id: true }}).then((groups) => groups.map(({ id }) => id));
    const knownRemovedIds = await db.achievementGroup.findMany({ select: { id: true }, where: { removedFromApi: true }}).then((groups) => groups.map(({ id }) => id));

    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));
    const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
    const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));
    const updatedIds = ids.filter((id) => knownIds.includes(id) && !rediscoveredIds.includes(id));

    // process groups
    await newGroups(db, buildId, getIdsFromMap(groups, newIds));
    await removedGroups(db, buildId, removedIds);
    await rediscoveredGroups(db, buildId, getIdsFromMap(groups, rediscoveredIds));
    const updated = await updatedGroups(db, buildId, getIdsFromMap(groups, updatedIds));


    return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered, ${updated} updated`;
  }
};

async function newGroups(db: PrismaClient, buildId: number, groups: { [key in Language]: Gw2Api.Achievement.Group }[]) {
  for(const { de, en, es, fr } of groups) {
    const revisions = await createRevisions(db, { de, en, es, fr }, { buildId, type: 'Added', entity: 'AchievementGroup', description: 'Added to API' });

    await db.achievementGroup.create({
      data: {
        id: en.id,
        name_de: de.name,
        name_en: en.name,
        name_es: es.name,
        name_fr: fr.name,
        order: en.order,
        version: 0,
        currentId_de: revisions.de.id,
        currentId_en: revisions.en.id,
        currentId_es: revisions.es.id,
        currentId_fr: revisions.fr.id,
        history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }] }},
      }
    });

    await db.achievementCategory.updateMany({
      where: { id: { in: en.categories }},
      data: { achievementGroupId: en.id }
    });
  }
}

async function removedGroups(db: PrismaClient, buildId: number, removedIds: string[]) {
  for(const removedId of removedIds) {
    const achievementGroup = await db.achievementGroup.findUnique({ where: { id: removedId }, include: { current_de: true, current_en: true, current_es: true, current_fr: true }});

    if(!achievementGroup) {
      continue;
    }

    const update: Prisma.AchievementGroupUpdateArgs['data'] = {
      removedFromApi: true,
      history: { createMany: { data: [] }}
    };

    // create a new revision
    for(const language of ['de', 'en', 'es', 'fr'] as const) {
      const revision = await db.revision.create({
        data: {
          data: achievementGroup[`current_${language}`].data,
          description: 'Removed from API',
          type: 'Removed',
          entity: 'AchievementGroup',
          language,
          buildId,
        }
      });

      update[`currentId_${language}`] = revision.id;
      update.history = appendHistory(update, revision.id);
    }

    await db.achievementGroup.update({ where: { id: removedId }, data: update });
  }
}

async function rediscoveredGroups(db: PrismaClient, buildId: number, groups: { [key in Language]: Gw2Api.Achievement.Group }[]) {
  for(const data of groups) {
    const update: Prisma.AchievementGroupUpdateArgs['data'] = {
      removedFromApi: false,
      name_de: data.de.name,
      name_en: data.en.name,
      name_es: data.es.name,
      name_fr: data.fr.name,
      order: data.en.order,
      lastCheckedAt: new Date(),
      history: { createMany: { data: [] }}
    };

    // create a new revision
    for(const language of ['de', 'en', 'es', 'fr'] as const) {
      const revision = await db.revision.create({
        data: {
          data: JSON.stringify(data[language]),
          description: 'Rediscovered in API',
          entity: 'AchievementGroup',
          language,
          buildId,
        }
      });

      update[`currentId_${language}`] = revision.id;
      update.history = appendHistory(update, revision.id);
    }

    await db.achievementGroup.update({ where: { id: data.en.id }, data: update });

    await db.achievementCategory.updateMany({
      where: { id: { in: data.en.categories }},
      data: { achievementGroupId: data.en.id }
    });
  }
}

async function updatedGroups(db: PrismaClient, buildId: number, apiGroups: { [key in Language]: Gw2Api.Achievement.Group }[]) {
  const groupsToUpdate = await db.achievementGroup.findMany({
    where: { id: { in: apiGroups.map(({ en }) => en.id) }},
    include: { current_de: true, current_en: true, current_es: true, current_fr: true }
  });

  const groups = groupsToUpdate.map((existing) => ({
    existing,
    ...apiGroups.find(({ en }) => en.id === existing.id)!
  }));

  let updated = 0;

  for(const { existing, de, en, es, fr } of groups) {
    const revision_de = existing.current_de.data !== JSON.stringify(de) ? await db.revision.create({ data: { data: JSON.stringify(de), language: 'de', buildId, type: 'Update', entity: 'AchievementGroup', description: 'Updated in API' }}) : existing.current_de;
    const revision_en = existing.current_en.data !== JSON.stringify(en) ? await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', buildId, type: 'Update', entity: 'AchievementGroup', description: 'Updated in API' }}) : existing.current_en;
    const revision_es = existing.current_es.data !== JSON.stringify(es) ? await db.revision.create({ data: { data: JSON.stringify(es), language: 'es', buildId, type: 'Update', entity: 'AchievementGroup', description: 'Updated in API' }}) : existing.current_es;
    const revision_fr = existing.current_fr.data !== JSON.stringify(fr) ? await db.revision.create({ data: { data: JSON.stringify(fr), language: 'fr', buildId, type: 'Update', entity: 'AchievementGroup', description: 'Updated in API' }}) : existing.current_fr;

    await db.achievementCategory.updateMany({
      where: { id: { in: en.categories }},
      data: { achievementGroupId: existing.id }
    });

    if(revision_de.id !== existing.currentId_de || revision_en.id !== existing.currentId_en || revision_es.id !== existing.currentId_es || revision_fr.id !== existing.currentId_fr) {
      updated++;
    } else {
      continue;
    }

    await db.achievementGroup.update({
      where: { id: existing.id }, data: {
        name_de: de.name,
        name_en: en.name,
        name_es: es.name,
        name_fr: fr.name,
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
