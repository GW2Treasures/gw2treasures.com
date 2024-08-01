import type { FC } from 'react';
import { ItemTableColumnsButton as ClientComponent } from './ItemTableColumnsButton.client';
import { translateMany } from '@/lib/translate';
import 'server-only';

export const ItemTableColumnsButton: FC = () => {
  const translations = translateMany(['table.columns', 'table.columns.reset']);

  return <ClientComponent translations={translations}/>;
};
