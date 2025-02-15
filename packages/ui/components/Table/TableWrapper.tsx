'use client';

import { Children, cloneElement, use, useCallback, useLayoutEffect, useRef, useState, type FC, type HTMLProps, type ReactElement } from 'react';
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

  // @ts-expect-error this is a workaround, because react@19 somehow broke passing children elements (TableWrapper is a client component, children is usually a server component)
  //   before react@19 `children` was `<Lazy/>`, now it is `{ $$typeof: Symbol(react.lazy) }`.
  //   We need access to the component props (especially ref) for the tooltip to function correctly
  //   This seems to work for now, but I need to create a reproduction for this and report it to get it fixed.
  if(children.$$typeof === Symbol.for('react.lazy')) { children = use(children._payload); }

  return (
    <div className={cx(isOverflowing ? styles.overflow : styles.noOverflow, className)} ref={wrapper} data-table-overflow={isOverflowing ? '' : undefined}>
      {cloneElement(Children.only(children), { ref: table })}
    </div>
  );
};
