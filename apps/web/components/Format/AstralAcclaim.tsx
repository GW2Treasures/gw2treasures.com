import type { FC } from 'react';
import { FormatNumber } from './FormatNumber';
import { Icon } from '@gw2treasures/ui';

export const ASTRAL_ACCLAIM_ID = 63;

export interface AstralAcclaimProps {
  value: number;
}

export const AstralAcclaim: FC<AstralAcclaimProps> = ({ value }) => {
  return (
    <span style={{ whiteSpace: 'nowrap' }}><FormatNumber value={value}/> <Icon icon="astral-acclaim"/></span>
  );
};
