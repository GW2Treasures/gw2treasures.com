import { Job } from '../job';
import { db } from '../../db';
import { batch } from '../helper/batch';

export const OutfitsUnlocks: Job = {
  run: async () => {
    console.log('Fetching outfit unlocks from gw2efficiency');

    const unlockData = await fetch('https://api.gw2efficiency.com/tracking/unlocks?id=outfits').then((r) => {
      if(r.status !== 200) {
        throw new Error(`https://api.gw2efficiency.com/tracking/unlocks?id=outfits returned ${r.status} ${r.statusText}`);
      }

      return r.json();
    }) as { total: number, updatedAt: string, data: Record<string, number> };

    const updates: { id: number, unlocks: number }[] = [];

    for(const [outfitIdString, unlocks] of Object.entries(unlockData.data)) {
      const outfitId = Number(outfitIdString);

      if(outfitId.toString() !== outfitIdString) {
        continue;
      }

      updates.push({ id: outfitId, unlocks: unlocks / unlockData.total });
    }


    console.log(`${updates.length} outfit unlocks loaded`);

    let updated = 0;
    for(const updatesBatch of batch(updates, 500)) {
      console.log(`Updating ${updatesBatch.length} outfits...`);

      const result = await db.$transaction(updatesBatch.map(({ id, unlocks }) => db.outfit.updateMany({ where: { id }, data: { unlocks }})));
      updated += result.reduce((total, { count }) => count + total, 0);
    }

    return `Updated ${updated}/${updates.length} outfit unlocks from gw2efficiency`;
  }
};
