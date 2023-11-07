import type { FC } from 'react';
import { Coins } from '../Format/Coins';
import { FormatNumber } from '../Format/FormatNumber';

export interface CurrencyValueProps {
  currencyId: number;
  value: number;
}

export const CurrencyValue: FC<CurrencyValueProps> = ({ currencyId, value }) => {
  return currencyId === 1 ? <Coins value={value}/> : <FormatNumber value={value}/>;
};
