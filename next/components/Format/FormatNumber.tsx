import { FC } from 'react';
import { useFormatContext } from './FormatContext';

interface FormatNumberProps {
  value: number | undefined | null;
};

const format = new Intl.NumberFormat(undefined, { useGrouping: true });

export const FormatNumber: FC<FormatNumberProps> = ({ value }) => {
  const { numberFormat } = useFormatContext();

  return <data value={value ?? undefined} suppressHydrationWarning>{value != null ? numberFormat.format(value) : '?'}</data>;
};

export function formatNumber(value: number): string {
  return format.format(value);
}
