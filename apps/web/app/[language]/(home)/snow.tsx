'use client';

import type { LetItGo } from 'let-it-go';
import { useEffect, useRef, type FC, type ReactNode } from 'react';

export interface SnowProps {
  children: ReactNode,
  className?: string,
}

export const Snow: FC<SnowProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let snow: LetItGo;

    import(/* webpackChunkName: "snow" */'let-it-go').then(({ LetItGo }) => {
      snow = new LetItGo({
        root: ref.current!,
        style: {},
        radiusRange: [1, 2],
        alphaRange: [.5, .8],
        number: 128,
      });
    });

    return () => {
      snow?.clear();
    };
  }, []);

  return (
    <div ref={ref} style={{ margin: '-32px -16px' }}>
      <div style={{ padding: '32px 16px' }}>
        {children}
      </div>
    </div>
  );
};
