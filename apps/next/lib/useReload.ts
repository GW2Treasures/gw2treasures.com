import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useLoading } from './useLoading';

export function useReload(): () => void {
  const router = useRouter();
  const loading = useLoading();

  return useCallback(() => !loading && router.replace(router.asPath, undefined, { scroll: false }), [loading, router]);
}
