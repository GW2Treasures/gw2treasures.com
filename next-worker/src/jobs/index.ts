import { AchievementCategories } from './achievements/categories';
import { AchievementsCheck } from './achievements/check';
import { AchievementGroups } from './achievements/groups';
import { AchievementsMigrate } from './achievements/migrate';
import { AchievementsNew } from './achievements/new';
import { AchievementsRediscovered } from './achievements/rediscovered';
import { AchievementsRemoved } from './achievements/removed';
import { AchievementsUnlocks } from './achievements/unlocks';
import { AchievementsUpdate } from './achievements/update';
import { Gw2ApiRequestsCleanup } from './gw2api-requests/cleanup';
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
import { SkillsCheck } from './skills/check';
import { SkillsMigrate } from './skills/migrate';
import { SkillsNew } from './skills/new';
import { SkillsRediscovered } from './skills/rediscovered';
import { SkillsRemoved } from './skills/removed';
import { SkillsUpdate } from './skills/update';
import { SkinsAppearance } from './skins/appearance';
import { SkinsCheck } from './skins/check';
import { SkinsMigrate } from './skins/migrate';
import { skinsNew } from './skins/new';
import { SkinsRediscovered } from './skins/rediscovered';
import { SkinsRemoved } from './skins/removed';
import { SkinsUnlocks } from './skins/unlocks';
import { SkinsUpdate } from './skins/update';

const jobsInternal = {
  'test': { run: () => undefined } as Job,

  'items.check': ItemsCheck,
  'items.new': ItemsNew,
  'items.removed': ItemsRemoved,
  'items.rediscovered': ItemsRediscovered,
  'items.update': ItemsUpdate,
  'items.migrate': ItemsMigrate,

  'skills.check': SkillsCheck,
  'skills.new': SkillsNew,
  'skills.removed': SkillsRemoved,
  'skills.rediscovered': SkillsRediscovered,
  'skills.update': SkillsUpdate,
  'skills.migrate': SkillsMigrate,

  'skins.check': SkinsCheck,
  'skins.new': skinsNew,
  'skins.removed': SkinsRemoved,
  'skins.rediscovered': SkinsRediscovered,
  'skins.update': SkinsUpdate,
  'skins.migrate': SkinsMigrate,
  'skins.unlocks': SkinsUnlocks,
  'skins.appearance': SkinsAppearance,

  'achievements.check': AchievementsCheck,
  'achievements.new': AchievementsNew,
  'achievements.removed': AchievementsRemoved,
  'achievements.rediscovered': AchievementsRediscovered,
  'achievements.update': AchievementsUpdate,
  'achievements.migrate': AchievementsMigrate,
  'achievements.unlocks': AchievementsUnlocks,

  'achievements.categories': AchievementCategories,
  'achievements.groups': AchievementGroups,

  'recipes.check': RecipesCheck,
  'recipes.new': RecipesNew,

  'gw2api-requests.cleanup': Gw2ApiRequestsCleanup,

  'jobs.cleanup': JobsCleanup,
};

export const jobs = jobsInternal as Record<string, Job>;

export type JobName = keyof typeof jobsInternal;
