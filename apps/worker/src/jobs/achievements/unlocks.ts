import { Job } from '../job';
import { db } from '../../db';
import { batch } from '../helper/batch';

export const AchievementsUnlocks: Job = {
  run: async () => {
    console.log('Fetching achievement unlocks from gw2efficiency');

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


    console.log(`${updates.length} achievement unlocks loaded`);

    let updated = 0;
    for(const updatesBatch of batch(updates, 500)) {
      console.log(`Updating ${updatesBatch.length} achievements...`);

      const result = await db.$transaction(updatesBatch.map(({ id, unlocks }) => db.achievement.updateMany({ where: { id }, data: { unlocks }})));
      updated += result.reduce((total, { count }) => count + total, 0);
    }

    return `Updated ${updated}/${updates.length} achievement unlocks from gw2efficiency`;
  }
};
