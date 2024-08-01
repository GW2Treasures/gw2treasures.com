'use client';

import { type FC, type ReactNode, useState } from 'react';
import { Icon } from '../../icons';
import { TableRowButton } from './TableRowButton';

export interface TableCollapseProps {
  children: ReactNode[],
  limit?: number;
}

export const TableCollapse: FC<TableCollapseProps> = ({ children, limit = 5 }) => {
  const [expanded, setExpanded] = useState(false);

  if(expanded || children.length <= limit) {
    return <>{children}</>;
  }

  return [
    ...children.slice(0, 5),
    <TableRowButton key="expand" onClick={() => setExpanded(true)}><Icon icon="chevron-down"/> Show {children.length - limit} more</TableRowButton>
  ];
};
