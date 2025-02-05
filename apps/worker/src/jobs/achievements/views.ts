import { db } from '../../db';
import { aggregateViews } from '../helper/aggregateViews';
import { Job } from '../job';

export const AchievementsViews: Job = {
  run: () => {
    return aggregateViews('achievement', db.achievement.findMany, db.achievement.updateMany);
  }
};
