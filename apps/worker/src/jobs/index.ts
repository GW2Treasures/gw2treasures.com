import { AchievementsJob } from './achievements/achievements';
import { AchievementCategories } from './achievements/categories';
import { AchievementGroups } from './achievements/groups';
import { AchievementsUnlocks } from './achievements/unlocks';
import { AchievementsViews } from './achievements/views';
import { ColorsJob } from './colors';
import { CurrenciesJob } from './currencies';
import { GuildUpgradesJob } from './guild-upgrades';
import { Gw2ApiRequestsCleanup } from './gw2api-requests/cleanup';
import { HomesteadDecorationCategoriesJob } from './homestead/decoration-categories';
import { HomesteadDecorationsJob } from './homestead/decorations';
import { HomesteadGlyphsJob } from './homestead/glyphs';
import { IconsColors } from './icons/colors';
import { ItemsCheck } from './items/check';
import { ItemsContainerContent } from './items/containerContent';
import { ItemsMigrate } from './items/migrate';
import { ItemsNew } from './items/new';
import { ItemsRediscovered } from './items/rediscovered';
import { ItemsRelevancy } from './items/relevancy';
import { ItemsRemoved } from './items/removed';
import { ItemsUpdate } from './items/update';
import { ItemsViews } from './items/views';
import { Job } from './job';
import { JobsCleanup } from './jobs/cleanup';
import { MinisJob } from './minis';
import { MinisUnlocks } from './minis/unlocks';
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
import { SkillsViews } from './skills/views';
import { SkinsJob } from './skins';
import { SkinsWikiJob } from './skins/appearance';
import { SkinsUnlocks } from './skins/unlocks';
import { SkinsViews } from './skins/views';
import { TitlesCheck } from './titles/check';
import { titlesMigrate } from './titles/migrate';
import { TitlesNew } from './titles/new';
import { TitlesRediscovered } from './titles/rediscovered';
import { TitlesRemoved } from './titles/removed';
import { TitlesUpdate } from './titles/update';
import { TpJob } from './tp';
import { TpImportJob } from './tp/import';
import { WizardsVaultListingsJob } from './wizardsvault/listings';
import { WizardsVaultObjectivesJob } from './wizardsvault/objectives';
import { WizardsVaultPurchaseLimitJob } from './wizardsvault/purchase-limit';
import { WizardsVaultSeasonJob } from './wizardsvault/season';

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
  'items.relevancy': ItemsRelevancy,

  'skills.check': SkillsCheck,
  'skills.new': SkillsNew,
  'skills.removed': SkillsRemoved,
  'skills.rediscovered': SkillsRediscovered,
  'skills.update': SkillsUpdate,
  'skills.migrate': SkillsMigrate,
  'skills.views': SkillsViews,

  'skins': SkinsJob,
  'skins.unlocks': SkinsUnlocks,
  'skins.wiki': SkinsWikiJob,
  'skins.views': SkinsViews,

  'achievements': AchievementsJob,
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

  'titles.check': TitlesCheck,
  'titles.new': TitlesNew,
  'titles.removed': TitlesRemoved,
  'titles.rediscovered': TitlesRediscovered,
  'titles.update': TitlesUpdate,
  'titles.migrate': titlesMigrate,

  'colors': ColorsJob,
  'currencies': CurrenciesJob,
  'guild-upgrades': GuildUpgradesJob,
  'minis': MinisJob,
  'minis.unlocks': MinisUnlocks,

  'homestead.decorations': HomesteadDecorationsJob,
  'homestead.decorations.categories': HomesteadDecorationCategoriesJob,
  'homestead.glyphs': HomesteadGlyphsJob,

  'wizardsvault.season': WizardsVaultSeasonJob,
  'wizardsvault.listings': WizardsVaultListingsJob,
  'wizardsvault.objectives': WizardsVaultObjectivesJob,
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
