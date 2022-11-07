import { ItemsCheck } from './items/check';
import { ItemsMigrate } from './items/migrate';
import { ItemsNew } from './items/new';
import { ItemsRediscovered } from './items/rediscovered';
import { ItemsRemoved } from './items/removed';
import { ItemsUpdate } from './items/update';
import { Job } from './job';
import { JobsCleanup } from './jobs/cleanup';
import { RecipesCheck } from './recipes/check';
import { RecipesNew } from './recipes/new';
import { SkinsCheck } from './skins/check';
import { SkinsMigrate } from './skins/migrate';
import { skinsNew } from './skins/new';
import { SkinsRediscovered } from './skins/rediscovered';
import { SkinsRemoved } from './skins/removed';
import { SkinsUnlock } from './skins/unlocks';
import { SkinsUpdate } from './skins/update';

const jobsInternal = {
  'test': { run: () => undefined } as Job,

  'items.check': ItemsCheck,
  'items.new': ItemsNew,
  'items.removed': ItemsRemoved,
  'items.rediscovered': ItemsRediscovered,
  'items.update': ItemsUpdate,
  'items.migrate': ItemsMigrate,

  'skins.check': SkinsCheck,
  'skins.new': skinsNew,
  'skins.removed': SkinsRemoved,
  'skins.rediscovered': SkinsRediscovered,
  'skins.update': SkinsUpdate,
  'skins.migrate': SkinsMigrate,
  'skins.unlock': SkinsUnlock,

  'recipes.check': RecipesCheck,
  'recipes.new': RecipesNew,

  'jobs.cleanup': JobsCleanup,
}

export const jobs = jobsInternal as Record<string, Job>;

export type JobName = keyof typeof jobsInternal;
