import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { type ProcessEntitiesData, createSubJobs, processEntities } from '../helper/process-entities';
import { toId } from '../helper/toId';
import { loadEntities } from '../helper/load-entities';

export const HomesteadGlyphsJob: Job = {
  async run(data: ProcessEntitiesData<string> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if(isEmptyObject(data)) {
      return createSubJobs(
        'homestead.glyphs',
        () => fetchApi('/v2/homestead/glyphs'),
        db.homesteadGlyph.findMany,
        CURRENT_VERSION
      );
    }

    const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);

    return processEntities(
      data,
      'HomesteadGlyph',
      (ids) => loadEntities('/v2/homestead/glyphs', ids),
      (homesteadGlyphId, revisionId) => ({ homesteadGlyphId_revisionId: { revisionId, homesteadGlyphId }}),
      (glyph) => {
        return {
          slot: glyph.slot,

          itemIdRaw: glyph.item_id,
          itemId: knownItemIds.includes(glyph.item_id) ? glyph.item_id : undefined,
        };
      },
      db.homesteadGlyph.findMany,
      (tx, data) => tx.homesteadGlyph.create(data),
      (tx, data) => tx.homesteadGlyph.update(data),
      CURRENT_VERSION
    );
  }
};
