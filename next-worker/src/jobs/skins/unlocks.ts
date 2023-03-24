import { Job } from '../job';
import fetch from 'node-fetch';
import { db } from '../../db';

export const SkinsUnlocks: Job = {
  run: async () => {
    const unlockData: { total: number, updatedAt: string, data: Record<string, number> } = await fetch('https://api.gw2efficiency.com/tracking/unlocks?id=skins').then((r) => {
      if(r.status !== 200) {
        throw new Error(`https://api.gw2efficiency.com/tracking/unlocks?id=skins returned ${r.status} ${r.statusText}`);
      }

      return r.json();
    });

    let updated = 0;

    for(const [skinIdString, unlocks] of Object.entries(unlockData.data)) {
      const skinId = Number(skinIdString);

      if(skinId.toString() !== skinIdString) {
        continue;
      }

      await db.skin.updateMany({ where: { id: skinId }, data: { unlocks: unlocks / unlockData.total }});
      updated++;
    }

    return `Updated ${updated} skin unlocks from gw2efficiency`;
  }
};
