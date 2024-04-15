'use client';

import { useState, type FC, useEffect, useCallback, useMemo } from 'react';
import { useFormatContext } from '../Format/FormatContext';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { isDefined } from '@gw2treasures/helper/is';

type ResetType = 'daily' | 'weekly';
type ResetModifier = 'next' | 'current' | 'last';
export type Reset = `${ResetModifier}-${ResetType}`;

export interface ResetTimerProps {
  reset?: Reset
}

export const ResetTimer: FC<ResetTimerProps> = ({ reset = 'current-daily' }) => {
  const { localFormat } = useFormatContext();
  const [remaining, setRemaining] = useState(0);
  const date = useMemo(() => getResetDate(reset), [reset]);

  const calculateRemaining = useCallback(() => {
    setRemaining((date.valueOf() - new Date().valueOf()) / 1000);
  }, [date]);

  useEffect(() => {
    calculateRemaining();

    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [calculateRemaining]);

  return (
    <Tip tip={localFormat.format(date)}>
      <time dateTime={date.toISOString()} style={{ whiteSpace: 'nowrap', fontFeatureSettings: '"tnum"' }}>
        {[remaining > 60 * 60 * 24 ? format(remaining / (60 * 60 * 24), 31) : undefined,
          format(remaining / (60 * 60), 24),
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
    case 'weekly':
      date.setUTCHours(7, 30, 0, 0);
      const daysAgo = date.getUTCDay() === 1 && relativeTo < date ? 7 : (date.getUTCDay() + 6) % 7;
      date.setUTCDate(date.getUTCDate() - daysAgo + 7 * modifierValue);
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

