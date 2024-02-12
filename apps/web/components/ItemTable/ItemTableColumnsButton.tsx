import type { FC } from 'react';
import { ItemTableColumnsButton as ClientComponent } from './ItemTableColumnsButton.client';
import { translateMany } from '@/lib/translate';
import 'server-only';

export interface ItemTableColumnsButtonProps {};

export const ItemTableColumnsButton: FC<ItemTableColumnsButtonProps> = () => {
  const translations = translateMany(['table.columns', 'table.columns.reset']);

  return <ClientComponent translations={translations}/>;
};
