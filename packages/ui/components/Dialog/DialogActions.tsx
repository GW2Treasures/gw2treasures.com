import { FlexRow } from '../Layout/FlexRow';
import type { FC, ReactNode } from 'react';
import styles from './Dialog.module.css';

export interface DialogActionsProps {
  description?: ReactNode;
  children: ReactNode
}

export const DialogActions: FC<DialogActionsProps> = ({ description, children }) => {
  return (
    <div className={styles.dialogActions}>
      <p className={styles.dialogActionsDescription}>{description}</p>
      <div>
        <FlexRow>{children}</FlexRow>
      </div>
    </div>
  );
};
