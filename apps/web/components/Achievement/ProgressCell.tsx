import type { FC, ReactNode } from 'react';
import styles from './ProgressCell.module.css';
import { SortableDynamicDataTableCell } from '@gw2treasures/ui/components/Table/DataTable.client';

export interface ProgressCellProps {
  progress: number;
  small?: boolean;
  children: ReactNode;
}

export const ProgressCell: FC<ProgressCellProps> = ({ progress, children, small }) => {
  return (
    <SortableDynamicDataTableCell value={progress}>
      <td className={progress != 0 ? styles.cell : undefined} style={{ '--progress': progress, width: small ? 1 : undefined }}>
        <div className={styles.content}>
          {children}
        </div>
      </td>
    </SortableDynamicDataTableCell>
  );
};
