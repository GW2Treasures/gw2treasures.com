'use client';

import { useCallback, useEffect, useRef, useState, type FC, type ReactNode } from 'react';
import styles from './HorizontalOverflowContainer.module.css';
import { Icon, cx } from '@gw2treasures/ui';

export interface HorizontalOverflowContainerProps {
  children: ReactNode
}

export const HorizontalOverflowContainer: FC<HorizontalOverflowContainerProps> = ({ children }) => {
  const content = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleScrollLeft = useCallback(() => {
    if(content.current) {
      const scrollBy = Math.min(400, content.current.offsetWidth * 0.66);
      content.current.scrollBy({ left: -scrollBy, behavior: 'smooth' });
    }
  }, []);

  const handleScrollRight = useCallback(() => {
    if(content.current) {
      const scrollBy = Math.min(400, content.current.offsetWidth * 0.66);
      content.current.scrollBy({ left: scrollBy, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if(!content.current) {
      return;
    }

    const element = content.current;

    const handler = () => {
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(element.scrollLeft < element.scrollWidth - element.offsetWidth);
    };

    const observer = new ResizeObserver(handler);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if(!content.current || (!canScrollLeft && !canScrollRight)) {
      return;
    }

    const element = content.current;

    const handler = () => {
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(element.scrollLeft < element.scrollWidth - element.offsetWidth);
    };
    element.addEventListener('scroll', handler, { passive: true });

    return () => element.removeEventListener('scroll', handler);
  }, [canScrollLeft, canScrollRight]);

  return (
    <div className={styles.container}>
      <button className={cx(styles.left, !canScrollLeft && styles.hidden)} tabIndex={-1} onClick={handleScrollLeft} aria-hidden><Icon icon="chevron-left"/></button>
      <div className={styles.content} ref={content}>
        {children}
      </div>
      <button className={cx(styles.right, !canScrollRight && styles.hidden)} tabIndex={-1} onClick={handleScrollRight} aria-hidden><Icon icon="chevron-right"/></button>
    </div>
  );
};
