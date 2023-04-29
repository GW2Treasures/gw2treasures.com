'use client';

import { FC } from 'react';
import { useFormatContext } from './FormatContext';
import styles from './Format.module.css';
import { cx } from '@gw2treasures/ui';

interface FormatNumberProps {
  value: number | undefined | null;
  className?: string;
};

const format = new Intl.NumberFormat(undefined, { useGrouping: true });

export const FormatNumber: FC<FormatNumberProps> = ({ value, className }) => {
  const { numberFormat } = useFormatContext();

  return <data className={cx(styles.format, className)} value={value ?? undefined} suppressHydrationWarning>{value != null ? numberFormat.format(value) : '?'}</data>;
};

export function formatNumber(value: number): string {
  return format.format(value);
}
