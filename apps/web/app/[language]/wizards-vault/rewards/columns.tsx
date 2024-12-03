'use client';

import { AstralAcclaim } from '@/components/Format/AstralAcclaim';
import type { WizardsVaultListing } from '@gw2treasures/database';
import type { FC } from 'react';

interface WizardsVaultColumnProps<T extends keyof WizardsVaultListing> {
  wizardsVaultListing: Pick<WizardsVaultListing, T>
}

export const WizardsVaultTypeColumn: FC<WizardsVaultColumnProps<'type'>> = ({ wizardsVaultListing: { type }}) => {
  return type;
};

export const WizardsVaultLimitColumn: FC<WizardsVaultColumnProps<'limit'>> = ({ wizardsVaultListing: { limit }}) => {
  return limit;
};

export const WizardsVaultCostColumn: FC<WizardsVaultColumnProps<'cost'>> = ({ wizardsVaultListing: { cost }}) => {
  return <AstralAcclaim value={cost}/>;
};
