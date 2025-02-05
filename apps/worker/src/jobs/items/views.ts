import { db } from '../../db';
import { aggregateViews } from '../helper/aggregateViews';
import { Job } from '../job';

export const ItemsViews: Job = {
  run: () => {
    return aggregateViews('item', db.item.findMany, db.item.updateMany);
  }
};
