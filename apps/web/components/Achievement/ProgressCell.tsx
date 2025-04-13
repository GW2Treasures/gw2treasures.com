import type { FC, ReactNode } from 'react';
import styles from './ProgressCell.module.css';
import { SortableDynamicDataTableCell } from '@gw2treasures/ui/components/Table/DataTable.client';
import { cx } from '@gw2treasures/ui';

export interface ProgressCellProps {
  progress: number,
  small?: boolean,
  children: ReactNode,
  color?: 'red' | 'blue',
}

export const ProgressCell: FC<ProgressCellProps> = ({ progress, children, small, color }) => {
  return (
    <SortableDynamicDataTableCell value={progress}>
      <td className={cx(progress != 0 && styles.cell, color && styles[color])} style={{ '--progress': progress, width: small ? 1 : undefined }}>
        <div className={styles.content}>
          {children}
        </div>
      </td>
    </SortableDynamicDataTableCell>
  );
};
