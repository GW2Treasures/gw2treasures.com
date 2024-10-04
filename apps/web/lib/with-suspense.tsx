import { createElement, Suspense, type FC, type ReactNode } from 'react';

export function withSuspense<T extends object>(component: FC<T>, fallback?: ReactNode): FC<T> {
  const wrapped: FC<T> = (props: T) => (
    <Suspense fallback={fallback}>
      {createElement(component, props)}
    </Suspense>
  );

  wrapped.displayName = `withSuspense(${component.displayName ?? ''})`;

  return wrapped;
}
