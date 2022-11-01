import { FC } from 'react';

interface FormatNumberProps {
  value: number;
};

const format = new Intl.NumberFormat('en-DE', { useGrouping: true });

export const FormatNumber: FC<FormatNumberProps> = ({ value }) => {
  return <>{format.format(value)}</>;
};
