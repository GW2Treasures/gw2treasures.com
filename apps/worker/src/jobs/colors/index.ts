import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { loadColors } from '../helper/loadColors';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { type ProcessEntitiesData, createSubJobs, processLocalizedEntities, Changes } from '../helper/process-entities';

interface ColorsJobProps extends ProcessEntitiesData<number> {}

export const ColorsJob: Job = {
  run(data: ColorsJobProps | Record<string, never>) {
    const CURRENT_VERSION = 3;

    if(isEmptyObject(data)) {
      return createSubJobs(
        'colors',
        () => fetchApi('/v2/colors'),
        db.color.findMany,
        CURRENT_VERSION
      );
    }

    return processLocalizedEntities(
      data,
      'Color',
      (colorId, revisionId) => ({ colorId_revisionId: { revisionId, colorId }}),
      async (colors, version, changes) => {
        // if this is a new color lets check if there are items waiting for it
        const unlockedByItemIds = changes === Changes.New
          ? await db.item.findMany({ where: { unlocksColorIds: { has: colors.en.id }}, select: { id: true }})
          : [];

        return {
          name_de: colors.de.name,
          name_en: colors.en.name,
          name_es: colors.es.name,
          name_fr: colors.fr.name,

          cloth_rgb: rgbToHex(colors.en.cloth.rgb),
          leather_rgb: rgbToHex(colors.en.leather.rgb),
          metal_rgb: rgbToHex(colors.en.metal.rgb),

          unlockedByItems: { connect: unlockedByItemIds }
        };
      },
      db.color.findMany,
      loadColors,
      (tx, data) => tx.color.create(data),
      (tx, data) => tx.color.update(data),
      CURRENT_VERSION
    );
  }
};

function rgbToHex(rgb: [number, number, number]): string {
  return rgb.map((component) => component.toString(16).padStart(2, '0')).join('');
}
