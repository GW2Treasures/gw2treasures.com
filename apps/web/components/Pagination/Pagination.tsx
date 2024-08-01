import { Button } from '@gw2treasures/ui/components/Form/Button';
import { type FC, type MouseEventHandler, useCallback } from 'react';
import styles from './Pagination.module.css';
import { Icon } from '@gw2treasures/ui';
import type { TranslationSubset } from '@/lib/translate';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';

export interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  translations: TranslationSubset<'pagination.next' | 'pagination.previous'>
}

export const Pagination: FC<PaginationProps> = ({ current, total, onPageChange, disabled, translations }) => {
  const handlePrev = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
    onPageChange(e.shiftKey ? 0 : current - 1);
  }, [current, onPageChange]);

  const handleNext = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
    onPageChange(e.shiftKey ? total - 1 : current + 1);
  }, [current, onPageChange, total]);

  return (
    <div className={styles.container}>
      <Tip tip={translations['pagination.previous']} preferredPlacement="bottom">
        <Button iconOnly onClick={handlePrev} disabled={disabled || current < 1} aria-label={translations['pagination.previous']}><Icon icon="chevron-left"/></Button>
      </Tip>
      <span className={styles.page}>{current + 1} / {total}</span>
      <Tip tip={translations['pagination.next']} preferredPlacement="bottom">
        <Button iconOnly onClick={handleNext} disabled={disabled || current > total - 2} aria-label={translations['pagination.next']}><Icon icon="chevron-right"/></Button>
      </Tip>
    </div>
  );
};
