import 'server-only';

import { AsyncComponent } from '@/lib/asyncComponent';
import { getLanguage, translate, TranslationId } from './getTranslate';
import { FC } from 'react';

export interface TransProps {
  id: TranslationId;
}

const baseDomain = process.env.GW2T_NEXT_DOMAIN;
export const Trans: FC<TransProps> = ({ id }) => {

  return <TransInternal id={id}/>;
};

const TransInternal: AsyncComponent<TransProps> = async ({ id }) => {
  const language = getLanguage();

  const translation = await translate(language, id);

  return <>{translation}</>;
};
