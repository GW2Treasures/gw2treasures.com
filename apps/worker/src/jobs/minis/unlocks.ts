import { Job } from '../job';
import { db } from '../../db';
import { batch } from '../helper/batch';

export const MinisUnlocks: Job = {
  run: async () => {
    console.log('Fetching mini unlocks from gw2efficiency');

    const unlockData = await fetch('https://api.gw2efficiency.com/tracking/unlocks?id=minis').then((r) => {
      if(r.status !== 200) {
        throw new Error(`https://api.gw2efficiency.com/tracking/unlocks?id=minis returned ${r.status} ${r.statusText}`);
      }

      return r.json();
    }) as { total: number, updatedAt: string, data: Record<string, number> };

    const updates: { id: number, unlocks: number }[] = [];

    for(const [miniIdString, unlocks] of Object.entries(unlockData.data)) {
      const miniId = Number(miniIdString);

      if(miniId.toString() !== miniIdString) {
        continue;
      }

      updates.push({ id: miniId, unlocks: unlocks / unlockData.total });
    }


    console.log(`${updates.length} mini unlocks loaded`);

    let updated = 0;
    for(const updatesBatch of batch(updates, 500)) {
      console.log(`Updating ${updatesBatch.length} minis...`);

      const result = await db.$transaction(updatesBatch.map(({ id, unlocks }) => db.mini.updateMany({ where: { id }, data: { unlocks }})));
      updated += result.reduce((total, { count }) => count + total, 0);
    }

    return `Updated ${updated}/${updates.length} mini unlocks from gw2efficiency`;
  }
};
