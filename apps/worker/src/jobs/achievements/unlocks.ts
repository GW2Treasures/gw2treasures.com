import { Job } from '../job';
import { db } from '../../db';

export const AchievementsUnlocks: Job = {
  run: async () => {
    const unlockData = await fetch('https://api.gw2efficiency.com/tracking/unlocks?id=achievements').then((r) => {
      if(r.status !== 200) {
        throw new Error(`https://api.gw2efficiency.com/tracking/unlocks?id=achievements returned ${r.status} ${r.statusText}`);
      }

      return r.json();
    }) as { total: number, updatedAt: string, data: Record<string, number> };

    const updates: { id: number, unlocks: number }[] = [];

    for(const [achievementIdString, unlocks] of Object.entries(unlockData.data)) {
      const achievementId = Number(achievementIdString);

      if(achievementId.toString() !== achievementIdString) {
        continue;
      }

      updates.push({ id: achievementId, unlocks: unlocks / unlockData.total });
    }

    // update all achievements in a single transaction
    // use `updateMany` to not fail if the achievement is missing in the db
    const updated = (
      await db.$transaction(
        updates.map(({ id, unlocks }) => db.achievement.updateMany({ where: { id }, data: { unlocks }}))
      )
    ).reduce((total, { count }) => count + total, 0);

    return `Updated ${updated}/${updates.length} achievement unlocks from gw2efficiency`;
  }
};
