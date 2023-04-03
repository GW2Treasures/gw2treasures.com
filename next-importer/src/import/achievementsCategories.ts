import { db, legacy } from '../db';
import { Gw2Api } from 'gw2-api-types';

export async function processAchievementCategories(buildId: number) {
  const ids = await legacy.achievementCategory.findMany({ select: { id: true }}).then((achievementCategories) => achievementCategories.map(({ id }) => id));
  const knownIds = await db.achievementCategory.findMany({ select: { id: true }}).then((achievementCategories) => achievementCategories.map(({ id }) => id));

  const newIds = ids.filter((id) => !knownIds.includes(id));
  const failedIds = [];

  console.log(`Importing ${newIds.length} achievementCategories.`);

  const importJob = await db.job.create({ data: { type: 'import.achievementCategories', data: {}, flags: ['LONG_RUNNING'], state: 'Running', startedAt: new Date(), priority: 10 }});

  for(const id of newIds) {
    try {
      const achievementCategory = await legacy.achievementCategory.findUnique({ where: { id }});

      if(!achievementCategory) {
        continue;
      }

      const revision_de = await db.revision.create({ data: { data: fixupDetails(achievementCategory.data_de), entity: 'AchievementCategory', language: 'de', buildId, description: 'Imported - No earlier history available' }});
      const revision_en = await db.revision.create({ data: { data: fixupDetails(achievementCategory.data_en), entity: 'AchievementCategory', language: 'en', buildId, description: 'Imported - No earlier history available' }});
      const revision_es = await db.revision.create({ data: { data: fixupDetails(achievementCategory.data_es), entity: 'AchievementCategory', language: 'es', buildId, description: 'Imported - No earlier history available' }});
      const revision_fr = await db.revision.create({ data: { data: fixupDetails(achievementCategory.data_fr), entity: 'AchievementCategory', language: 'fr', buildId, description: 'Imported - No earlier history available' }});

      const data: Gw2Api.Achievement.Category = JSON.parse(achievementCategory.data_en);

      if(achievementCategory.file_id) {
        await db.icon.upsert({
          create: { id: achievementCategory.file_id, signature: achievementCategory.signature },
          update: {},
          where: { id: achievementCategory.file_id }
        });
      }

      await db.achievementCategory.create({
        data: {
          id: achievementCategory.id,
          name_de: achievementCategory.name_de,
          name_en: achievementCategory.name_en,
          name_es: achievementCategory.name_es,
          name_fr: achievementCategory.name_fr,
          order: achievementCategory.order,
          iconId: achievementCategory.file_id,
          currentId_de: revision_de.id,
          currentId_en: revision_en.id,
          currentId_es: revision_es.id,
          currentId_fr: revision_fr.id,
          lastCheckedAt: new Date(0),
          createdAt: achievementCategory.created_at,
          history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }] }},
        }
      });

      // set achievement category
      await db.achievement.updateMany({
        where: { id: { in: data.achievements.map((achievement) => typeof achievement === 'number' ? achievement : achievement.id) }},
        data: { achievementCategoryId: id, historic: false },
      });

      // set icon if the achievement does not have an icon yet
      await db.achievement.updateMany({
        where: { achievementCategoryId: id, iconId: null },
        data: { iconId: achievementCategory.file_id },
      });
    } catch(e) {
      console.error(e);
      failedIds.push(id);
    }
  }

  if(failedIds.length > 0) {
    console.log('Failed to import the following achievementCategories:', failedIds);
  }

  await db.job.update({ where: { id: importJob.id }, data: { state: 'Success', output: `Imported ${newIds.length - failedIds.length} achievementCategories (${failedIds.length} failed)`, finishedAt: new Date() }});
}

function fixupDetails(json: string): string {
  const data: Gw2Api.Achievement.Category = JSON.parse(json);

  data.achievements = data.achievements.map((achievement) => typeof achievement === 'number' ? { id: achievement } : achievement);

  return JSON.stringify(data);
}
