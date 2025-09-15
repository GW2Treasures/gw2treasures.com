'use client';

import { useState, type FC, useEffect } from 'react';
import { useFormatContext } from '../Format/FormatContext';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { isDefined } from '@gw2treasures/helper/is';
import { useInterval } from '@/lib/useInterval';

type ResetType = 'daily' | 'weekly' | 'monthly';
type ResetModifier = 'next' | 'current' | 'last';
export type Reset = `${ResetModifier}-${ResetType}`;

export interface ResetTimerProps {
  reset?: Reset | Date,
}

export const ResetTimer: FC<ResetTimerProps> = ({ reset = 'current-daily' }) => {
  const { localFormat } = useFormatContext();
  const [resetDate, setResetDate] = useState(() => reset instanceof Date ? reset : getResetDate(reset));
  const [remaining, setRemaining] = useState(() => (resetDate.valueOf() - new Date().valueOf()) / 1000);

  useEffect(() => {
    if(remaining < 0 && typeof reset === 'string') {
      setResetDate(getResetDate(reset));
    }
  }, [remaining, reset]);

  useInterval(
    () => setRemaining((resetDate.valueOf() - new Date().valueOf()) / 1000),
    1000,
  );

  return (
    <Tip tip={localFormat.format(resetDate)}>
      <time dateTime={resetDate.toISOString()} style={{ whiteSpace: 'nowrap', fontFeatureSettings: '"tnum"' }} suppressHydrationWarning>
        {remaining > 60 * 60 * 24 ? `${Math.floor(remaining / (60 * 60 * 24))}d ` : ''}
        {[format(remaining / (60 * 60), 24),
          format(remaining / 60, 60),
          format(remaining, 60)
        ].filter(isDefined).join(':')}
      </time>
    </Tip>
  );
};

export function getResetDate(reset: Reset, relativeTo = new Date()) {
  const [modifier, type] = reset.split('-') as [ResetModifier, ResetType];
  const modifierValue = getModifierValue(modifier);

  const date = new Date(relativeTo);

  switch(type) {
    case 'daily':
      date.setUTCHours(24 * modifierValue, 0, 0, 0);
      break;
    case 'weekly': {
      date.setUTCHours(7, 30, 0, 0);
      const daysAgo = date.getUTCDay() === 1 && relativeTo < date ? 7 : (date.getUTCDay() + 6) % 7;
      date.setUTCDate(date.getUTCDate() - daysAgo + 7 * modifierValue);
      break;
    }
    case 'monthly':
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCMonth(date.getUTCMonth() + modifierValue, 1);
      break;
  }

  return date;
}

function getModifierValue(modifier: ResetModifier) {
  switch(modifier) {
    case 'last': return 0;
    case 'current': return 1;
    case 'next': return 2;
  }
}

function format(value: number, max: number): string {
  return value < 0 ? '00' : Math.floor(value % max).toString().padStart(2, '0');
}

