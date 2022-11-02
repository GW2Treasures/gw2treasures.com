import React, { FC, useEffect, useState } from 'react';

const utcFormat = new Intl.DateTimeFormat(undefined, { timeZone: 'UTC', dateStyle: 'short', timeStyle: 'short' });
const localFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' });
const relativeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

export interface FormatDateProps {
  date?: Date | null;
  relative?: boolean;
}

export const FormatDate: FC<FormatDateProps> = ({ date = null, relative = false }) => {
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return <time dateTime={date?.toISOString()} style={{ whiteSpace: 'nowrap' }}>
    {date ? (hydrated ? (relative ? formatRelative(date) : localFormat.format(date)) : utcFormat.format(date)) : '-'}
  </time>;
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

  return relativeFormat.format(Math.round(difference.value), difference.unit);
}
