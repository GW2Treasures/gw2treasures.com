import type { FC, ReactNode } from 'react';
import styles from './TableRowButton.module.css';

export interface TableRowButtonProps {
  onClick: () => void;
  children: ReactNode;
}

export const TableRowButton: FC<TableRowButtonProps> = ({ onClick, children }) => {
  return (
    <tr>
      <td colSpan={999}>
        <button type="button" className={styles.button} onClick={onClick}>
          {children}
        </button>
      </td>
    </tr>
  );
};
