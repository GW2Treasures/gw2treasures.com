import { Button } from '@gw2treasures/ui/components/Form/Button';
import { FC, MouseEventHandler, useCallback } from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
};

export const Pagination: FC<PaginationProps> = ({ current, total, onPageChange }) => {
  const handlePrev = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
    onPageChange(e.shiftKey ? 0 : current - 1);
  }, [current, onPageChange]);

  const handleNext = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
    onPageChange(e.shiftKey ? total - 1 : current + 1);
  }, [current, onPageChange, total]);

  return (
    <div>
      <Button onClick={handlePrev} disabled={current < 1}>&lt;</Button>
      <span className={styles.page}>{current + 1} / {total}</span>
      <Button onClick={handleNext} disabled={current > total - 2}>&gt;</Button>
    </div>
  );
};
