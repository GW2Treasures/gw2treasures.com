'use client';

import { type FC, type ReactNode, useCallback, useState } from 'react';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import styles from './ShowMore.module.css';
import { FormatNumber } from '../Format/FormatNumber';

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
        <Button key="show-more" icon="chevron-down" appearance="menu" onClick={handleClick} className={styles.button}>Show <FormatNumber value={children.length - initialSize}/> more</Button>
      ]}
    </>
  );
};
