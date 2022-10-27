import { ItemsCheck } from './items/check';
import { ItemsNew } from './items/new';
import { ItemsRediscovered } from './items/rediscovered';
import { ItemsRemoved } from './items/removed';
import { Job } from './job';
import { JobsCleanup } from './jobs/cleanup';

const jobsInternal = {
  'test': { run: () => undefined } as Job,

  'items.check': ItemsCheck,
  'items.new': ItemsNew,
  'items.removed': ItemsRemoved,
  'items.rediscovered': ItemsRediscovered,

  'jobs.cleanup': JobsCleanup,
}

export const jobs = jobsInternal as Record<string, Job>;

export type JobName = keyof typeof jobsInternal;
