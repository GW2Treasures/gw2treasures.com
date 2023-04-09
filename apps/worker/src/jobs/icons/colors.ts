import { db } from '../../db';
import { Job } from '../job';
import { getAverageColor } from 'fast-average-color-node';
import { batch } from '../helper/batch';

export const IconsColors: Job = {
  run: async () => {
    const icons = await db.icon.findMany({ where: { color: null }, take: 2500 });

    const colors: { id: number, color: string }[] = [];

    for(const iconBatch of batch(icons, 10)) {
      await Promise.all(iconBatch.map(async ({ id, signature }) => {
        const url = `https://render.guildwars2.com/file/${signature}/${id}.png`;

        try {
          const color = await getAverageColor(url);

          colors.push({ id, color: color.hex });
        } catch(e) {
          console.error(`Could not get the average color if icon ${id} (${url}).`);
          console.error(e);
        }
      }));
    }

    await db.$transaction(colors.map(({ id, color }) => db.icon.update({ where: { id }, data: { color }})));

    return `Updated ${colors.length} icon colors.`;
  }
};
