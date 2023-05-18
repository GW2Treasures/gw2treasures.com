'use client';

import { FC, ReactElement, ReactNode, useState } from 'react';
import styles from './TableCollapse.module.css';
import { Icon } from '../../icons';

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
    (
      <tr key="expand">
        <td colSpan={999}>
          <button type="button" className={styles.expandButton} onClick={() => setExpanded(true)}>
            <Icon icon="chevronDown"/> Show {children.length - limit} more
          </button>
        </td>
      </tr>
    )
  ] as any as ReactElement;
};
