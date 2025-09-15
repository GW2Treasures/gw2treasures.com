'use client';

import { type FC, type ReactNode, useCallback, useState, useTransition } from 'react';
import { Icon } from '../../icons';
import { TableRowButton } from './TableRowButton';

export interface TableCollapseProps {
  children: ReactNode[],
  limit?: number,
}

export const TableCollapse: FC<TableCollapseProps> = ({ children, limit = 5 }) => {
  const [expanded, setExpanded] = useState(false);
  const [isExpanding, startTransition] = useTransition();

  const handleExpand = useCallback(() => {
    startTransition(() => setExpanded(true));
  }, []);

  if(expanded || children.length <= limit) {
    return <>{children}</>;
  }

  return [
    ...children.slice(0, limit),
    <TableRowButton key="expand" onClick={handleExpand}><Icon icon={isExpanding ? 'loading' : 'chevron-down'}/> Show {children.length - limit} more</TableRowButton>
  ];
};
