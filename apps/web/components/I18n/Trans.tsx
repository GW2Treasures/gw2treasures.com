import 'server-only';

import { AsyncComponent } from '@/lib/asyncComponent';
import { translate, TranslationId } from './getTranslate';
import { FC } from 'react';
import { headers } from 'next/headers';
import { Language } from '@gw2treasures/database';

export interface TransProps {
  id: TranslationId;
}

const baseDomain = process.env.GW2T_NEXT_DOMAIN;
export const Trans: FC<TransProps> = ({ id }) => {
  // @ts-expect-error Server Component
  return <TransInternal id={id}/>;
};

const TransInternal: AsyncComponent<TransProps> = async ({ id }) => {
  const language = headers().get('x-gw2t-lang') as Language;

  const translation = await translate(language, id);

  return <>{translation}</>;
};
