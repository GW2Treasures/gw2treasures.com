import 'server-only';

import { translate, type TranslationId } from './getTranslate';
import type { FC } from 'react';
import type { Language } from '@gw2treasures/database';

export interface TransProps {
  id: TranslationId;
  language?: Language;
}

export const Trans: FC<TransProps> = async ({ id, language }) => {
  const translation = await translate(id, language);

  return <>{translation}</>;
};
