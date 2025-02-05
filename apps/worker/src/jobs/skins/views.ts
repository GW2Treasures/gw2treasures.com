import { db } from '../../db';
import { aggregateViews } from '../helper/aggregateViews';
import { Job } from '../job';

export const SkinsViews: Job = {
  run: () => {
    return aggregateViews('skin', db.skin.findMany, db.skin.updateMany);
  }
};
