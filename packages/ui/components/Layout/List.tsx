import type { FC, ReactNode } from 'react';
import styles from './List.module.css';

interface ListProps {
  children: ReactNode;

  numbered?: boolean;
};

export const List: FC<ListProps> = ({ children, numbered = false }) => {
  const Tag = numbered ? 'ol' : 'ul';

  return (
    <Tag className={numbered ? styles.ol : styles.ul}>
      {children}
    </Tag>
  );
};
