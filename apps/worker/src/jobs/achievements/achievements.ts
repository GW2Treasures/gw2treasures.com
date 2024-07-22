import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { loadAchievements } from '../helper/loadAchievements';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { type ProcessEntitiesData, createSubJobs, processLocalizedEntities, Changes } from '../helper/process-entities';
import { createIcon } from '../helper/createIcon';
import { toId } from '../helper/toId';

interface AchievementsJobProps extends ProcessEntitiesData<number> {}

const CURRENT_VERSION = 7;
// Migration history
// 1: added points
// 2: added mastery
// 3: added item bits and rewards and skin bits
// 4: added prerequisites
// 5: added categoryDisplay
// 6: added title rewards
// 7: added flags

export const AchievementsJob: Job = {
  async run(data: AchievementsJobProps | Record<string, never>) {

    if(isEmptyObject(data)) {
      return createSubJobs(
        'achievements',
        () => fetchApi<number[]>('/v2/achievements'),
        db.achievement.findMany,
        CURRENT_VERSION
      );
    }

    // load all ids of known items, skins and titles
    const itemIds = (await db.item.findMany({ select: { id: true }})).map(toId);
    const skinIds = (await db.skin.findMany({ select: { id: true }})).map(toId);
    const titleIds = (await db.title.findMany({ select: { id: true }})).map(toId);

    return processLocalizedEntities(
      data,
      'Achievement',
      (achievementId, revisionId) => ({ achievementId_revisionId: { revisionId, achievementId }}),
      async (achievements, version, changes) => {
        const id = achievements.en.id;
        const iconId = await createIcon(achievements.en.icon);

        // calculate points
        const points = achievements.en.tiers.reduce((total, tier) => total + tier.points, 0);

        // get mastery
        const mastery = achievements.en.rewards?.find(({ type }) => type === 'Mastery')?.region;

        // get achievement flags
        const flags = achievements.en.flags;

        // list of ids this is a prerequisite for
        const prerequisitesIds = achievements.en.prerequisites ?? [];

        // if those prerequisites exist, we connect them (added with migration 4)
        const prerequisites = version < 4
          ? { connect: await db.achievement.findMany({ where: { id: { in: prerequisitesIds }}, select: { id: true }}) }
          : undefined;

        // for new achievements we check if it is a prerequisite for any existing achievement
        const prerequisiteFor = changes === Changes.New
          ? { connect: await db.achievement.findMany({ where: { prerequisitesIds: { has: id }}, select: { id: true }}) }
          : undefined;

        // check if achievement is a categoryDisplay
        const isCategoryDisplay = achievements.en.flags.includes('CategoryDisplay');

        // get the category this is the categoryDisplay for
        // TODO: is this really required? doesn't it make more sense to just store the category for every achievement?
        const categoryDisplayFor = version < 5 && isCategoryDisplay
          ? { connect: await db.achievementCategory.findMany({ where: { achievements: { some: { id }}}, select: { id: true }}) }
          : undefined;

        // get bit ids
        const bitsIdsByType = getIdsByType(achievements.en.bits);
        const bitsItemIds = bitsIdsByType['Item'] ?? [];
        const bitsSkinIds = bitsIdsByType['Skin'] ?? [];

        // get bit items
        const bitsItem = version < 3
          ? { connect: bitsItemIds.filter((id) => itemIds.includes(id)).map((id) => ({ id })) }
          : undefined;

        // get bit skins
        const bitsSkin = version < 3
          ? { connect: bitsSkinIds.filter((id) => skinIds.includes(id)).map((id) => ({ id })) }
          : undefined;

        // get rewards ids
        const rewardIdsByType = getIdsByType(achievements.en.rewards);
        const rewardsItemIds = rewardIdsByType['Item'] ?? [];
        const rewardsTitleIds = rewardIdsByType['Title'] ?? [];

        // get items rewards by this achievement
        const rewardsItem = version < 3
          ? { connect: rewardsItemIds.filter((id) => itemIds.includes(id)).map((id) => ({ id })) }
          : undefined;

        // get titles rewarded by this achievement
        const rewardsTitle = version < 6
          ? { connect: rewardsTitleIds.filter((id) => titleIds.includes(id)).map((id) => ({ id })) }
          : undefined;


        return {
          name_de: achievements.de.name,
          name_en: achievements.en.name,
          name_es: achievements.es.name,
          name_fr: achievements.fr.name,

          iconId,

          points,
          mastery,
          flags,

          prerequisitesIds,
          prerequisites,
          prerequisiteFor,

          isCategoryDisplay,
          categoryDisplayFor,

          bitsItemIds,
          bitsItem,

          bitsSkinIds,
          bitsSkin,

          rewardsItemIds,
          rewardsItem,

          rewardsTitleIds,
          rewardsTitle,
        };
      },
      db.achievement.findMany,
      loadAchievements,
      (tx, data) => tx.achievement.create(data),
      (tx, data) => tx.achievement.update(data),
      CURRENT_VERSION
    );
  }
};

function getIdsByType<T extends string>(elements?: { id: number, type: T }[]): Partial<Record<T, number[]>> {
  if(!elements) {
    return {};
  }

  const map: Partial<Record<T, number[]>> = {};

  for(const element of elements) {
    map[element.type] = [...(map[element.type] ?? []), element.id];
  }

  return map;
}
