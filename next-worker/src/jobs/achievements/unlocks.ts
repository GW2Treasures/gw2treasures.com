import { Job } from '../job';
import fetch from 'node-fetch';
import { db } from '../../db';

export const AchievementsUnlocks: Job = {
  run: async () => {
    const unlockData: { total: number, updatedAt: string, data: Record<string, number> } = await fetch('https://api.gw2efficiency.com/tracking/unlocks?id=achievements').then((r) => {
      if(r.status !== 200) {
        throw new Error(`https://api.gw2efficiency.com/tracking/unlocks?id=achievements returned ${r.status} ${r.statusText}`);
      }

      return r.json();
    });

    let updated = 0;

    for(const [achievementIdString, unlocks] of Object.entries(unlockData.data)) {
      const achievementId = Number(achievementIdString);

      if(achievementId.toString() !== achievementIdString) {
        continue;
      }

      await db.achievement.updateMany({ where: { id: achievementId }, data: { unlocks: unlocks / unlockData.total }});
      updated++;
    }

    return `Updated ${updated} achievement unlocks from gw2efficiency`;
  }
};
