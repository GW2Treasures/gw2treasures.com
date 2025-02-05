import { db } from '../../db';
import { aggregateViews } from '../helper/aggregateViews';
import { Job } from '../job';

export const SkillsViews: Job = {
  run: () => {
    return aggregateViews('skill', db.skill.findMany, db.skill.updateMany);
  }
};
