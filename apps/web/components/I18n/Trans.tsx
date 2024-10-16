import 'server-only';

import { getLanguage, translate, type TranslationId } from '@/lib/translate';
import type { FC } from 'react';
import type { Language } from '@gw2treasures/database';

export interface TransProps {
  id: TranslationId;
  language?: Language;
}

export const Trans: FC<TransProps> = async ({ id, language }) => {
  language ??= await getLanguage();
  const translation = translate(id, language);

  return <>{translation}</>;
};
