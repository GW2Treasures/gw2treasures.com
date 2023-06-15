import { FC, ReactNode } from 'react';
import styles from './FlexRow.module.css';

interface FlexRowProps {
  align?: 'left' | 'right' | 'center';
  children: ReactNode;
};

export const FlexRow: FC<FlexRowProps> = ({ children, align = 'left' }) => {

  return (
    <div className={styles[align]}>
      {children}
    </div>
  );
};
