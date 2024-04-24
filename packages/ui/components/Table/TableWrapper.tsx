'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FC, type ReactNode } from 'react';
import styles from './Table.module.css';

export interface TableWrapperProps {
  children: ReactNode;
};

export const TableWrapper: FC<TableWrapperProps> = ({ children }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const checkOverflow = useCallback(() => {
    setIsOverflowing(() => ref.current ? ref.current.clientWidth < ref.current.scrollWidth : false);
  }, []);

  useLayoutEffect(checkOverflow, [checkOverflow]);

  useEffect(() => {
    // TODO: replace with resize observer
    window.addEventListener('resize', checkOverflow, { passive: true });

    return () => window.removeEventListener('resize', checkOverflow);
  });

  return (
    <div className={isOverflowing ? styles.wrapperOverflow : styles.wrapper} ref={ref}>
      {children}
    </div>
  );
};
