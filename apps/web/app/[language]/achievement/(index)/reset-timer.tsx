'use client';

import { useFormatContext } from '@/components/Format/FormatContext';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { type FC, useEffect, useState } from 'react';
import styles from './styles.module.css';

export interface ResetTimerProps {
  relativeTo?: Date
}

function format(value: number): string {
  return value < 0 ? '00' : Math.floor(value % 60).toString().padStart(2, '0');
}

function getNextReset(relativeTo?: Date) {
  const reset = relativeTo ? new Date(relativeTo) : new Date();
  reset.setUTCHours(24, 0, 0, 0);

  return reset;
}

export const ResetTimer: FC<ResetTimerProps> = ({ relativeTo }) => {
  const { localDateTimeFormat } = useFormatContext();
  const [remaining, setRemaining] = useState(0);
  const reset = getNextReset();

  useEffect(() => {
    setRemaining((getNextReset(relativeTo).valueOf() - new Date().valueOf()) / 1000);

    const interval = setInterval(() => {
      setRemaining((getNextReset(relativeTo).valueOf() - new Date().valueOf()) / 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [setRemaining, relativeTo]);

  return (
    <Tip tip={localDateTimeFormat.format(reset)}>
      <time dateTime={reset.toISOString()} className={styles.reset}>
        Reset: {[remaining / 3600, remaining / 60, remaining].map(format).join(':')}
      </time>
    </Tip>
  );
};
