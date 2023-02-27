import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export function useLoading(): boolean {
  // const router = useRouter();
  // const [loading, setLoading] = useState(false);

  // const handleStartLoading = useCallback(() => setLoading(true), []);
  // const handleStopLoading = useCallback(() => setLoading(false), []);

  // useEffect(() => {
  //   router.events.on('routeChangeStart', handleStartLoading);
  //   router.events.on('routeChangeComplete', handleStopLoading);
  //   router.events.on('routeChangeError', handleStopLoading);

  //   return () => {
  //     router.events.off('routeChangeStart', handleStartLoading);
  //     router.events.off('routeChangeComplete', handleStopLoading);
  //     router.events.off('routeChangeError', handleStopLoading);
  //   };
  // }, [handleStartLoading, handleStopLoading, router]);

  // return loading;

  return false;
}
