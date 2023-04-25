'use client';

import { Select } from '@/components/Form/Select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useCallback } from 'react';
import { availablePeriods } from './available-periods';

export interface PeriodSelectProps {
  // TODO: add props
}

export const PeriodSelect: FC<PeriodSelectProps> = ({ }) => {
  const value = useSearchParams().get('period') ?? '24h';
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = useCallback((value: string) => {
    replace(`${pathname}?period=${value}`);
  }, [pathname, replace]);

  return <Select options={availablePeriods} value={value} onChange={handleChange}/>;
};
