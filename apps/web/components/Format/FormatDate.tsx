'use client';

import type { FC } from 'react';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { useFormatContext } from './FormatContext';
import styles from './Format.module.css';

export interface FormatDateProps {
  date?: Date | null;
  relative?: boolean;
  dateOnly?: boolean;
}

export const FormatDate: FC<FormatDateProps> = ({ date = null, relative = false, dateOnly = false }) => {
  const { relativeTimeFormat, localDateTimeFormat, localDateFormat } = useFormatContext();

  const difference = date && relative ? formatRelative(date) : undefined;

  if(!date) {
    return (
      <span className={styles.format}>-</span>
    );
  }

  if(relative) {
    return (
      <Tip tip={localDateTimeFormat.format(date)}>
        <time dateTime={date?.toISOString()} className={styles.format} suppressHydrationWarning>
          {relativeTimeFormat.format(Math.round(difference!.value), difference!.unit)}
        </time>
      </Tip>
    );
  }

  return (
    <time dateTime={date?.toISOString()} className={styles.format} suppressHydrationWarning>
      {dateOnly ? localDateFormat.format(date) : localDateTimeFormat.format(date)}
    </time>
  );
};

function formatRelative(date: Date) {
  const difference: { value: number, unit: Intl.RelativeTimeFormatUnit } = { value: (date.valueOf() - new Date().valueOf()) / 1000, unit: 'seconds' };

  if(Math.abs(difference.value) > 150) {
    difference.value /= 60;
    difference.unit = 'minutes';

    if(Math.abs(difference.value) > 120) {
      difference.value /= 60;
      difference.unit = 'hours';

      if(Math.abs(difference.value) > 24) {
        difference.value /= 24;
        difference.unit = 'days';
      }
    }
  }

  return difference;
}
