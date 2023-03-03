import 'server-only';

import { AsyncComponent } from '@/lib/asyncComponent';
import { translate, TranslationId } from './getTranslate';
import { getLanguage } from './getLanguage';
import { FC } from 'react';

export interface TransProps {
  id: TranslationId;
}

export const Trans: FC<TransProps> = ({ id }) => {
  // @ts-expect-error Server Component
  return <TransInternal id={id}/>;
};

const TransInternal: AsyncComponent<TransProps> = async ({ id }) => {
  const language = getLanguage();
  const translation = await translate(language, id);

  return <>{translation}</>;
};
