import type { FC } from 'react';
import { ItemTableColumnsButton as ClientComponent } from './ItemTableColumnsButton.client';
import { getLanguage, translateMany } from '@/lib/translate';
import 'server-only';

export const ItemTableColumnsButton: FC = async () => {
  const translations = translateMany(['table.columns', 'table.columns.reset'], await getLanguage());

  return <ClientComponent translations={translations}/>;
};
