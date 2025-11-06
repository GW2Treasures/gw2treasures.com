import { getLanguage, translateMany } from '@/lib/translate';
import { Gw2ApiStateIndicator as Gw2ApiStateIndicatorClient } from './Gw2ApiStateIndicator.client';
import type { FC } from 'react';

export const Gw2ApiStateIndicator: FC = async () => {
  const language = await getLanguage();

  return (
    <Gw2ApiStateIndicatorClient translations={translateMany(['api.issues.error', 'api.issues.slow'], language)}/>
  );
};
