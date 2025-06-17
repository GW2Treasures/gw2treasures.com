import { Job } from '../job';
import { db } from '../../db';
import { batch } from '../helper/batch';

export const GlidersUnlocks: Job = {
  run: async () => {
    console.log('Fetching glider unlocks from gw2efficiency');

    const unlockData = await fetch('https://api.gw2efficiency.com/tracking/unlocks?id=gliders').then((r) => {
      if(r.status !== 200) {
        throw new Error(`https://api.gw2efficiency.com/tracking/unlocks?id=gliders returned ${r.status} ${r.statusText}`);
      }

      return r.json();
    }) as { total: number, updatedAt: string, data: Record<string, number> };

    const updates: { id: number, unlocks: number }[] = [];

    for(const [gliderIdString, unlocks] of Object.entries(unlockData.data)) {
      const gliderId = Number(gliderIdString);

      if(gliderId.toString() !== gliderIdString) {
        continue;
      }

      updates.push({ id: gliderId, unlocks: unlocks / unlockData.total });
    }


    console.log(`${updates.length} glider unlocks loaded`);

    let updated = 0;
    for(const updatesBatch of batch(updates, 500)) {
      console.log(`Updating ${updatesBatch.length} gliders...`);

      const result = await db.$transaction(updatesBatch.map(({ id, unlocks }) => db.glider.updateMany({ where: { id }, data: { unlocks }})));
      updated += result.reduce((total, { count }) => count + total, 0);
    }

    return `Updated ${updated}/${updates.length} glider unlocks from gw2efficiency`;
  }
};
