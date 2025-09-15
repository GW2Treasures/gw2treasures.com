import type { TranslationId, TranslationSubset } from '@/lib/translate';

export const wizardsVaultObjectiveClientTranslationIds = [
  'wizards-vault.account',
  'wizards-vault.account.loading',
  'wizards-vault.account.not-logged-in',
  'wizards-vault.account.not-logged-in.tooltip',
  'wizards-vault.objective',
  'wizards-vault.progress',
  'wizards-vault.type',
  'wizards-vault.type.daily',
  'wizards-vault.type.weekly',
  'wizards-vault.type.special',
  'wizards-vault.track',
  'wizards-vault.track.PvE',
  'wizards-vault.track.PvP',
  'wizards-vault.track.WvW',
  'wizards-vault.rewards',
  'wizards-vault.reward.claimed',
  'wizards-vault.reset',
  'wizards-vault.astral-acclaim',
] as const satisfies TranslationId[];

export type WizardsVaultObjectiveClientTranslationId = typeof wizardsVaultObjectiveClientTranslationIds[number];
export type WizardsVaultObjectiveClientTranslations = TranslationSubset<WizardsVaultObjectiveClientTranslationId>;
