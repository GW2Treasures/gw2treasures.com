'use client';

import { useMemo, type FC, type ReactNode } from 'react';
import { useFormatContext } from './FormatContext';
import styles from './Format.module.css';
import { cx } from '@gw2treasures/ui';
import type { RefProp } from '@gw2treasures/ui/lib/react';

const NARROW_NO_BREAK_SPACE = '\u{202F}';

interface FormatNumberProps extends RefProp<HTMLDataElement> {
  value: number | bigint | undefined | null,
  className?: string,
  unit?: ReactNode,
  options?: Intl.NumberFormatOptions,
  approx?: boolean,
}

const format = new Intl.NumberFormat(undefined, { useGrouping: true });

export const FormatNumber: FC<FormatNumberProps> = ({ ref, value, className, unit, options, approx }) => {
  const { numberFormat, locale } = useFormatContext();

  const customFormat = useMemo(() => {
    if(!options) {
      return numberFormat;
    }

    return new Intl.NumberFormat(locale, { ...numberFormat.resolvedOptions(), ...options });
  }, [numberFormat, locale, options]);

  const formatted = value != null ? customFormat.format(value) : '?';

  return (
    <data ref={ref} className={cx(styles.format, className)} value={value?.toString() ?? undefined} suppressHydrationWarning>
      {(formatted === '0' && value !== 0 && approx) ? '~0' : formatted}
      {unit && <>{NARROW_NO_BREAK_SPACE}{unit}</>}
    </data>
  );
};

export function formatNumber(value: number): string {
  return format.format(value);
}
