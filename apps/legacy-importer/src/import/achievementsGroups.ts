import { db, legacy } from '../db';
import { Gw2Api } from 'gw2-api-types';

export async function processAchievementGroups(buildId: number) {
  const ids = await legacy.achievementGroup.findMany({ select: { id: true }}).then((achievementGroups) => achievementGroups.map(({ id }) => id));
  const knownIds = await db.achievementGroup.findMany({ select: { id: true }}).then((achievementGroups) => achievementGroups.map(({ id }) => id));

  const newIds = ids.filter((id) => !knownIds.includes(id));
  const failedIds = [];

  console.log(`Importing ${newIds.length} achievementGroups.`);

  const importJob = await db.job.create({ data: { type: 'import.achievementGroups', data: {}, flags: ['LONG_RUNNING'], state: 'Running', startedAt: new Date(), priority: 10 }});

  for(const id of newIds) {
    try {
      const achievementGroup = await legacy.achievementGroup.findUnique({ where: { id }});

      if(!achievementGroup) {
        continue;
      }

      const revision_de = await db.revision.create({ data: { data: achievementGroup.data_de, entity: 'AchievementGroup', language: 'de', buildId, description: 'Imported - No earlier history available', schema: '' }});
      const revision_en = await db.revision.create({ data: { data: achievementGroup.data_en, entity: 'AchievementGroup', language: 'en', buildId, description: 'Imported - No earlier history available', schema: '' }});
      const revision_es = await db.revision.create({ data: { data: achievementGroup.data_es, entity: 'AchievementGroup', language: 'es', buildId, description: 'Imported - No earlier history available', schema: '' }});
      const revision_fr = await db.revision.create({ data: { data: achievementGroup.data_fr, entity: 'AchievementGroup', language: 'fr', buildId, description: 'Imported - No earlier history available', schema: '' }});

      const data: Gw2Api.Achievement.Group = JSON.parse(achievementGroup.data_en);

      await db.achievementGroup.create({
        data: {
          id: achievementGroup.id,
          name_de: achievementGroup.name_de,
          name_en: achievementGroup.name_en,
          name_es: achievementGroup.name_es,
          name_fr: achievementGroup.name_fr,
          order: achievementGroup.order,
          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,
          lastCheckedAt: new Date(0),
          createdAt: achievementGroup.created_at,
          history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }] }},
        }
      });

      await db.achievementCategory.updateMany({
        where: { id: { in: data.categories }},
        data: { achievementGroupId: achievementGroup.id }
      });
    } catch(e) {
      console.error(e);
      failedIds.push(id);
    }
  }

  if(failedIds.length > 0) {
    console.log('Failed to import the following achievementGroups:', failedIds);
  }

  await db.job.update({ where: { id: importJob.id }, data: { state: 'Success', output: `Imported ${newIds.length - failedIds.length} achievementGroups (${failedIds.length} failed)`, finishedAt: new Date() }});
}

