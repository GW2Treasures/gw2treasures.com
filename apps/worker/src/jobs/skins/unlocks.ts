import { Job } from '../job';
import { db } from '../../db';
import { batch } from '../helper/batch';

export const SkinsUnlocks: Job = {
  run: async () => {
    console.log('Fetching skin unlocks from gw2efficiency');

    const unlockData = await fetch('https://api.gw2efficiency.com/tracking/unlocks?id=skins').then((r) => {
      if(r.status !== 200) {
        throw new Error(`https://api.gw2efficiency.com/tracking/unlocks?id=skins returned ${r.status} ${r.statusText}`);
      }

      return r.json();
    }) as { total: number, updatedAt: string, data: Record<string, number> };

    const updates: { id: number, unlocks: number }[] = [];

    for(const [skinIdString, unlocks] of Object.entries(unlockData.data)) {
      const skinId = Number(skinIdString);

      if(skinId.toString() !== skinIdString) {
        continue;
      }

      updates.push({ id: skinId, unlocks: unlocks / unlockData.total });
    }

    console.log(`${updates.length} skin unlocks loaded`);

    let updated = 0;
    for(const updatesBatch of batch(updates, 500)) {
      console.log(`Updating ${updatesBatch.length} skins...`);

      const result = await db.$transaction(updatesBatch.map(({ id, unlocks }) => db.skin.updateMany({ where: { id }, data: { unlocks }})));
      updated += result.reduce((total, { count }) => count + total, 0);
    }

    return `Updated ${updated}/${updates.length} skin unlocks from gw2efficiency`;
  }
};
