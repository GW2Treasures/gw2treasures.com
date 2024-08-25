import type { FC, ReactNode } from 'react';
import styles from './ProgressCell.module.css';

export interface ProgressCellProps {
  progress: number;
  small?: boolean;
  children: ReactNode;
}

export const ProgressCell: FC<ProgressCellProps> = ({ progress, children, small }) => {
  return (
    <td className={progress != 0 ? styles.cell : undefined} style={{ '--progress': progress, width: small ? 1 : undefined }}>
      <div className={styles.content}>
        {children}
      </div>
    </td>
  );
};
