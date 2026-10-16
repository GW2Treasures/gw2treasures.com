'use client';

import { useFormatContext } from '@/components/Format/FormatContext';
import type { FC } from 'react';

export interface FormatDayProps {
  date: Date,
  part: 'weekday' | 'weekday-long' | 'date',
}

const options = {
  'weekday': { weekday: 'short' },
  'weekday-long': { weekday: 'long' },
  'date': { year: 'numeric', month: '2-digit', day: '2-digit' },
} satisfies Record<FormatDayProps['part'], Intl.DateTimeFormatOptions>;

export const FormatDay: FC<FormatDayProps> = ({ date, part }) => {
  const { locale } = useFormatContext();

  return (
    <time dateTime={date.toISOString()} suppressHydrationWarning>
      {date.toLocaleDateString(locale, { ...options[part], timeZone: 'UTC' })}
    </time>
  );
};
