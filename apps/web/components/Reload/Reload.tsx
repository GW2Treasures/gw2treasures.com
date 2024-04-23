'use client';

import { useRouter } from 'next/navigation';
import { type FC, useEffect, useTransition } from 'react';

export interface ReloadProps {
  intervalMs: number;
}

export const Reload: FC<ReloadProps> = ({ intervalMs }) => {
  const [isLoading, startLoading] = useTransition();

  const router = useRouter();

  useEffect(() => {
    if(isLoading) {
      return;
    }

    const timeout = setTimeout(() => {
      startLoading(() => router.refresh());
    }, intervalMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, router, intervalMs]);

  return null;
};
