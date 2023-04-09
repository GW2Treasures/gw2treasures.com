import 'server-only';

import { AsyncComponent } from '@/lib/asyncComponent';
import { translate, TranslationId } from './getTranslate';
import { FC } from 'react';
import { headers } from 'next/headers';
import { Language } from '@prisma/client';

export interface TransProps {
  id: TranslationId;
}

const baseDomain = process.env.GW2T_NEXT_DOMAIN;
export const Trans: FC<TransProps> = ({ id }) => {
  // @ts-expect-error Server Component
  return <TransInternal id={id}/>;
};

const TransInternal: AsyncComponent<TransProps> = async ({ id }) => {
  // copy logic from middleware - would be nicer if we could inject a x-gw2t-language header in middleware
  const domain = headers().get('host')?.split(':')[0];
  const language = (Object.keys(Language) as Language[]).find((lang) => domain === `${lang}.${baseDomain}`) ?? Language.en;

  const translation = await translate(language, id);

  return <>{translation}</>;
};
