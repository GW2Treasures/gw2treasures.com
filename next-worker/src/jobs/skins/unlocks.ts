import { Gw2Api } from 'gw2-api-types';
import { Job } from '../job';

function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

export const SkinsUnlock: Job = {
  run: async (db, data: {}) => {
    const items = await db.item.findMany({ include: { current_en: true, unlocksSkin: { select: { id: true } } }, take: 10000 });
    const knownSkinIds = await (await db.skin.findMany({ select: { id: true }})).map(({ id }) => id);

    let updated = 0;

    for(const item of items) {
      const data: Gw2Api.Item = JSON.parse(item.current_en.data);

      const skins = [data.default_skin, ...(data.details?.skins ?? [])].filter(isDefined).map(Number).filter((id) => knownSkinIds.includes(id));

      if(skins.length !== item.unlocksSkin.length || item.unlocksSkin.some(({ id }) => !skins.includes(id))) {
        await db.item.update({ where: { id: item.id }, data: { unlocksSkin: { set: skins.map((id) => ({ id })) }}});
        updated++;
      }
    }

    return `Updated skin unlock of ${updated} items.`;
  }
}
