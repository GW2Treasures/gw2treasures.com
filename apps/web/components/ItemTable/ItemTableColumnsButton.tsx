import type { FC } from 'react';
import { ItemTableColumnsButton as ClientComponent } from './ItemTableColumnsButton.client';
import { translateMany } from '../I18n/getTranslate';
import 'server-only';

export interface ItemTableColumnsButtonProps {};

export const ItemTableColumnsButton: FC<ItemTableColumnsButtonProps> = () => {
  const translations = translateMany(['table.columns', 'table.columns.reset']);

  return <ClientComponent translations={translations}/>;
};
