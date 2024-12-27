'use client';

import { Children, cloneElement, useCallback, useLayoutEffect, useRef, useState, type FC, type HTMLProps, type ReactElement } from 'react';
import styles from './Table.module.css';
import { useResizeObserver } from '../../lib/hooks/resize-observer';
import { cx } from '../../lib';

export interface TableWrapperProps {
  children: ReactElement<HTMLProps<HTMLElement>>;
  className?: string;
}

export const TableWrapper: FC<TableWrapperProps> = ({ children, className }) => {
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
    <div className={cx(isOverflowing ? styles.overflow : styles.noOverflow, className)} ref={wrapper} data-table-overflow={isOverflowing ? '' : undefined}>
      {cloneElement(Children.only(children), { ref: table })}
    </div>
  );
};
