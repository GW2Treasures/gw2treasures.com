import type { FC, ReactNode } from 'react';
import styles from './TableRowButton.module.css';

export interface TableRowButtonProps {
  onClick: () => void,
  children: ReactNode,
  thin?: boolean,
}

export const TableRowButton: FC<TableRowButtonProps> = ({ onClick, children, thin }) => {
  return (
    <tr>
      <td colSpan={999}>
        <button type="button" className={thin ? styles.buttonThin : styles.button} onClick={onClick}>
          {children}
        </button>
      </td>
    </tr>
  );
};
