'use client';

import { Children, cloneElement, useCallback, useLayoutEffect, useRef, useState, type FC, type HTMLProps, type ReactElement, type ReactNode } from 'react';
import styles from './Table.module.css';
import { useResizeObserver } from '../../lib/hooks/resize-observer';

export interface TableWrapperProps {
  children: ReactElement<HTMLProps<HTMLElement>>;
}

export const TableWrapper: FC<TableWrapperProps> = ({ children }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLElement>(null);

  const checkOverflow = useCallback(() => {
    setIsOverflowing(() => wrapper.current ? wrapper.current.clientWidth < wrapper.current.scrollWidth : false);
  }, []);

  // check overflow on mount
  useLayoutEffect(checkOverflow, [checkOverflow]);

  // use a resize observer to subscribe to size changes the wrapper and inner table
  useResizeObserver(wrapper, checkOverflow);
  useResizeObserver(table, checkOverflow);

  return (
    <div className={isOverflowing ? styles.wrapperOverflow : styles.wrapper} ref={wrapper}>
      {cloneElement(Children.only(children), { ref: table })}
    </div>
  );
};
