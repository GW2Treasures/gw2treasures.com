'use client';

import { forwardRef } from 'react';
import { useFormatContext } from './FormatContext';
import styles from './Format.module.css';
import { cx } from '@gw2treasures/ui';

const NARROW_NO_BREAK_SPACE = '\u{202F}';

interface FormatNumberProps {
  value: number | bigint | undefined | null;
  className?: string;
  unit?: string;
}

const format = new Intl.NumberFormat(undefined, { useGrouping: true });

export const FormatNumber = forwardRef<HTMLDataElement, FormatNumberProps>(({ value, className, unit }: FormatNumberProps, ref) => {
  const { numberFormat } = useFormatContext();

  return (
    <data ref={ref} className={cx(styles.format, className)} value={value?.toString() ?? undefined} suppressHydrationWarning>
      {value != null ? numberFormat.format(value) : '?'}
      {unit && `${NARROW_NO_BREAK_SPACE}${unit}`}
    </data>
  );
});

FormatNumber.displayName = 'FormatNumber';

export function formatNumber(value: number): string {
  return format.format(value);
}
