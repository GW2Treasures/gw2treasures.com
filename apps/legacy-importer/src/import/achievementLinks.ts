import { db, legacy } from '../db';

export async function processAchievementLinks() {
  console.log('Updating achievement links.');
  const importJob = await db.job.create({ data: { type: 'import.achievementLinks', data: {}, flags: ['LONG_RUNNING'], state: 'Running', startedAt: new Date(), priority: 10 }});
  let updated = 0;

  // update categories legacy knows
  const achievementIdsWithoutCategory = await db.achievement.findMany({ where: { achievementCategoryId: null }, select: { id: true }});
  const knownAchievementCategories = await db.achievementCategory.findMany({ select: { id: true }});
  const legacyAchievementsWithCategories = await legacy.achievement.findMany({
    where: {
      id: { in: achievementIdsWithoutCategory.map(({ id }) => id) },
      achievement_category_id: { in: knownAchievementCategories.map(({ id }) => id) }
    },
    select: { id: true, achievement_category_id: true, historic: true }
  });
  for(const legacyAchievement of legacyAchievementsWithCategories) {
    await db.achievement.update({ where: { id: legacyAchievement.id }, data: { historic: legacyAchievement.historic, achievementCategoryId: legacyAchievement.achievement_category_id }});
    updated++;
  }

  // update groups legacy knows
  const achievementCategoryIdsWithoutGroup = await db.achievementCategory.findMany({ where: { achievementGroupId: null }, select: { id: true }});
  const knownAchievementGroups = await db.achievementGroup.findMany({ select: { id: true }});
  const legacyAchievementCategoriesWithGroups = await legacy.achievementCategory.findMany({
    where: {
      id: { in: achievementCategoryIdsWithoutGroup.map(({ id }) => id) },
      achievement_group_id: { in: knownAchievementGroups.map(({ id }) => id) }
    },
    select: { id: true, achievement_group_id: true }
  });
  for(const legacyAchievement of legacyAchievementCategoriesWithGroups) {
    await db.achievementCategory.update({ where: { id: legacyAchievement.id }, data: { achievementGroupId: legacyAchievement.achievement_group_id }});
    updated++;
  }

  await db.job.update({ where: { id: importJob.id }, data: { state: 'Success', output: `Updated ${updated} achievement links`, finishedAt: new Date() }});
}
