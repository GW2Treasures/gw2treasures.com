'use client';

import { FC, ReactNode, useCallback, useState } from 'react';
import { Button } from '../Form/Button';
import styles from './ShowMore.module.css';

export interface ShowMoreProps {
  children: ReactNode[];
  initialSize?: number;
}

export const ShowMore: FC<ShowMoreProps> = ({ children, initialSize = 3 }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = useCallback(() => {
    setExpanded(true);
  }, []);

  return (
    <>
      {expanded || children.length <= initialSize ? children : [
        ...children.slice(0, initialSize),
        <Button key="show-more" icon="chevronDown" appearance="menu" onClick={handleClick} className={styles.button}>Show {children.length - initialSize} more</Button>
      ]}
    </>
  );
};
