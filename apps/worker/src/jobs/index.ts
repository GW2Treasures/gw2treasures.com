import { AchievementCategories } from './achievements/categories';
import { AchievementsCheck } from './achievements/check';
import { AchievementGroups } from './achievements/groups';
import { AchievementsMigrate } from './achievements/migrate';
import { AchievementsNew } from './achievements/new';
import { AchievementsRediscovered } from './achievements/rediscovered';
import { AchievementsRemoved } from './achievements/removed';
import { AchievementsUnlocks } from './achievements/unlocks';
import { AchievementsUpdate } from './achievements/update';
import { AchievementsViews } from './achievements/views';
import { ColorsJob } from './colors';
import { CurrenciesCheck } from './currencies/check';
import { CurrenciesMigrate } from './currencies/migrate';
import { CurrenciesNew } from './currencies/new';
import { CurrenciesRediscovered } from './currencies/rediscovered';
import { CurrenciesRemoved } from './currencies/removed';
import { CurrenciesUpdate } from './currencies/update';
import { GuildUpgradesJob } from './guild-upgrades';
import { Gw2ApiRequestsCleanup } from './gw2api-requests/cleanup';
import { IconsColors } from './icons/colors';
import { ItemsCheck } from './items/check';
import { ItemsContainerContent } from './items/containerContent';
import { ItemsMigrate } from './items/migrate';
import { ItemsNew } from './items/new';
import { ItemsRediscovered } from './items/rediscovered';
import { ItemsRemoved } from './items/removed';
import { ItemsUpdate } from './items/update';
import { ItemsViews } from './items/views';
import { Job } from './job';
import { JobsCleanup } from './jobs/cleanup';
import { RecipesCheck } from './recipes/check';
import { RecipesMigrate } from './recipes/migrate';
import { RecipesNew } from './recipes/new';
import { RecipesRediscovered } from './recipes/rediscovered';
import { RecipesRemoved } from './recipes/removed';
import { RecipesUpdate } from './recipes/update';
import { RevisionsPrevious } from './revisions/previous';
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
import { TitlesCheck } from './titles/check';
import { titlesMigrate } from './titles/migrate';
import { TitlesNew } from './titles/new';
import { TitlesRediscovered } from './titles/rediscovered';
import { TitlesRemoved } from './titles/removed';
import { TitlesUpdate } from './titles/update';
import { TpJob } from './tp';
import { TpImportJob } from './tp/import';
import { WizardsVaultListingsJob } from './wizardsvault/listings';
import { WizardsVaultPurchaseLimitJob } from './wizardsvault/purchase-limit';

const jobsInternal = {
  'test': { run: () => undefined } as Job,

  'items.check': ItemsCheck,
  'items.new': ItemsNew,
  'items.removed': ItemsRemoved,
  'items.rediscovered': ItemsRediscovered,
  'items.update': ItemsUpdate,
  'items.migrate': ItemsMigrate,
  'items.containerContent': ItemsContainerContent,
  'items.views': ItemsViews,

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
  'achievements.views': AchievementsViews,

  'achievements.categories': AchievementCategories,
  'achievements.groups': AchievementGroups,

  'recipes.check': RecipesCheck,
  'recipes.new': RecipesNew,
  'recipes.migrate': RecipesMigrate,
  'recipes.rediscovered': RecipesRediscovered,
  'recipes.removed': RecipesRemoved,
  'recipes.update': RecipesUpdate,

  'currencies.check': CurrenciesCheck,
  'currencies.new': CurrenciesNew,
  'currencies.removed': CurrenciesRemoved,
  'currencies.rediscovered': CurrenciesRediscovered,
  'currencies.update': CurrenciesUpdate,
  'currencies.migrate': CurrenciesMigrate,

  'titles.check': TitlesCheck,
  'titles.new': TitlesNew,
  'titles.removed': TitlesRemoved,
  'titles.rediscovered': TitlesRediscovered,
  'titles.update': TitlesUpdate,
  'titles.migrate': titlesMigrate,

  'colors': ColorsJob,
  'guild-upgrades': GuildUpgradesJob,
  'wizardsvault.listings': WizardsVaultListingsJob,
  'wizardsvault.purchase-limit': WizardsVaultPurchaseLimitJob,

  'tp': TpJob,
  'tp.import': TpImportJob,

  'revisions.previous': RevisionsPrevious,

  'gw2api-requests.cleanup': Gw2ApiRequestsCleanup,

  'icons.colors': IconsColors,

  'jobs.cleanup': JobsCleanup,
};

export const jobs = jobsInternal as Record<string, Job>;

export type JobName = keyof typeof jobsInternal;
