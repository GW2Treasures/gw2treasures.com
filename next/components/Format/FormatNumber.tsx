'use client';

import { FC } from 'react';
import { useFormatContext } from './FormatContext';
import styles from './Format.module.css';

interface FormatNumberProps {
  value: number | undefined | null;
};

const format = new Intl.NumberFormat(undefined, { useGrouping: true });

export const FormatNumber: FC<FormatNumberProps> = ({ value }) => {
  const { numberFormat } = useFormatContext();

  return <data className={styles.format} value={value ?? undefined} suppressHydrationWarning>{value != null ? numberFormat.format(value) : '?'}</data>;
};

export function formatNumber(value: number): string {
  return format.format(value);
}
