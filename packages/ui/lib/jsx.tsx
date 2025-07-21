import { Children, type ReactNode } from 'react';

export function jsxJoin(children: ReactNode[], join: ReactNode) {
  return Children.map(children, (child, i) => (
    i > 0 ? <>{join}{child}</> : child
  ));
}
