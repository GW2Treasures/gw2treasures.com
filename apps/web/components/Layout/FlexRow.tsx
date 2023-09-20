import { FC, ReactNode } from 'react';
import styles from './FlexRow.module.css';
import { cx } from '@gw2treasures/ui';

interface FlexRowProps {
  align?: 'left' | 'right' | 'center' | 'space-between';
  wrap?: boolean;
  children: ReactNode;
};

export const FlexRow: FC<FlexRowProps> = ({ children, align = 'left', wrap }) => {

  return (
    <div className={cx(styles[align], wrap && styles.wrap)}>
      {children}
    </div>
  );
};
