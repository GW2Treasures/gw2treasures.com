import { FC, ReactNode } from 'react';
import styles from './ProgressCell.module.css';

export interface ProgressCellProps {
  progress: number;
  children: ReactNode;
}

export const ProgressCell: FC<ProgressCellProps> = ({ progress, children }) => {
  return <td className={progress != 0 ? styles.cell : undefined} style={{ '--progress': progress }}>{children}</td>;
};
