import { Button } from '@gw2treasures/ui/components/Form/Button';
import { FC, MouseEventHandler, useCallback } from 'react';
import styles from './Pagination.module.css';
import { Icon } from '@gw2treasures/ui';
import { FlexRow } from '../Layout/FlexRow';

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export const Pagination: FC<PaginationProps> = ({ current, total, onPageChange, disabled }) => {
  const handlePrev = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
    onPageChange(e.shiftKey ? 0 : current - 1);
  }, [current, onPageChange]);

  const handleNext = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
    onPageChange(e.shiftKey ? total - 1 : current + 1);
  }, [current, onPageChange, total]);

  return (
    <div className={styles.container}>
      <Button iconOnly onClick={handlePrev} disabled={disabled || current < 1}><Icon icon="chevron-left"/></Button>
      <span className={styles.page}>{current + 1} / {total}</span>
      <Button iconOnly onClick={handleNext} disabled={disabled || current > total - 2}><Icon icon="chevron-right"/></Button>
    </div>
  );
};
