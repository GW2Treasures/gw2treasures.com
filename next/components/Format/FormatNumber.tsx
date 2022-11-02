import { FC } from 'react';

interface FormatNumberProps {
  value: number | undefined | null;
};

const format = new Intl.NumberFormat(undefined, { useGrouping: true });

export const FormatNumber: FC<FormatNumberProps> = ({ value }) => {
  return <>{value != null ? format.format(value) : '?'}</>;
};
