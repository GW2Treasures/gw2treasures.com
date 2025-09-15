'use client';

import { AstralAcclaim } from '@/components/Format/AstralAcclaim';
import type { TranslationSubset } from '@/lib/translate';
import type { WizardsVaultListing, WizardsVaultListingType } from '@gw2treasures/database';
import type { IconName } from '@gw2treasures/icons';
import { Icon } from '@gw2treasures/ui';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import type { FC } from 'react';

interface WizardsVaultColumnProps<T extends keyof WizardsVaultListing> {
  wizardsVaultListing: Pick<WizardsVaultListing, T>,
}

export const WizardsVaultTypeColumn: FC<WizardsVaultColumnProps<'type'> & { translations: TranslationSubset<`wizards-vault.rewards.type.${WizardsVaultListingType}`> }> = ({ wizardsVaultListing: { type }, translations }) => {
  return <FlexRow><Icon icon={listingTypeIcons[type]}/> {translations[`wizards-vault.rewards.type.${type}`]}</FlexRow>;
};

export const WizardsVaultLimitColumn: FC<WizardsVaultColumnProps<'limit'>> = ({ wizardsVaultListing: { limit }}) => {
  return limit;
};

export const WizardsVaultCostColumn: FC<WizardsVaultColumnProps<'cost'>> = ({ wizardsVaultListing: { cost }}) => {
  return <AstralAcclaim value={cost}/>;
};

const listingTypeIcons: Record<WizardsVaultListingType, IconName> = {
  Featured: 'wizards-vault',
  Normal: 'wv-rewards',
  Legacy: 'wv-legacy-rewards',
};
