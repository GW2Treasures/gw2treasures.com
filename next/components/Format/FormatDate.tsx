import React, { FC, useEffect, useState } from 'react';
import { Tip } from '../Tip/Tip';
import { useFormatContext } from './FormatContext';

export interface FormatDateProps {
  date?: Date | null;
  relative?: boolean;
}

export const FormatDate: FC<FormatDateProps> = ({ date = null, relative = false }) => {
  const [hydrated, setHydrated] = useState<boolean>(false);
  const { relativeFormat, localFormat, utcFormat } = useFormatContext();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const difference = date && hydrated && relative ? formatRelative(date) : undefined;

  return (
    <Tip tip={date?.toLocaleString()}>
      <time dateTime={date?.toISOString()} style={{ whiteSpace: 'nowrap' }}>
        {date ? (hydrated ? (relative ? relativeFormat.format(Math.round(difference!.value), difference!.unit) : localFormat.format(date)) : date.toISOString()) : '-'}
      </time>
    </Tip>
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
