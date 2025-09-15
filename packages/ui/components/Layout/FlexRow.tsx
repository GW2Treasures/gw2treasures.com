import type { FC, ReactNode } from 'react';
import styles from './FlexRow.module.css';
import { cx } from '../../lib';

interface FlexRowProps {
  align?: 'left' | 'right' | 'center' | 'space-between',
  wrap?: boolean,
  inline?: boolean,
  children: ReactNode,
}

export const FlexRow: FC<FlexRowProps> = ({ children, align = 'left', wrap, inline }) => {

  return (
    <div className={cx(styles[align], wrap && styles.wrap, inline && styles.inline)}>
      {children}
    </div>
  );
};
