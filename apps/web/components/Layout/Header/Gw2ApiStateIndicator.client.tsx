'use client';

import { SubscriptionHealth } from '@/components/Gw2Api/subscription-manager';
import { useGlobalSubscriptionState } from '@/components/Gw2Api/use-gw2-subscription';
import type { TranslationSubset } from '@/lib/translate';
import { Icon } from '@gw2treasures/ui';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import type { FC } from 'react';
import styles from './Gw2ApiStateIndicator.module.css';

export interface Gw2ApiStateIndicatorProps {
  translations: TranslationSubset<'api.issues.slow' | 'api.issues.error'>,
}

export const Gw2ApiStateIndicator: FC<Gw2ApiStateIndicatorProps> = ({ translations }) => {
  const state = useGlobalSubscriptionState();

  if(state.health === SubscriptionHealth.Good) {
    return null;
  }

  const isError = state.health === SubscriptionHealth.Error;
  const text = isError ? translations['api.issues.error'] : translations['api.issues.slow'];

  return (
    <Tip tip={<span className={isError ? styles.errorText : undefined}>{text}</span>}>
      <div className={isError ? styles.error : styles.slow}>
        <Icon icon="api-status"/>
      </div>
    </Tip>
  );
};
