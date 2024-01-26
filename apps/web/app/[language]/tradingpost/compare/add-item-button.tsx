'use client';

import { SearchItemDialog, type SearchItemDialogSubmitHandler } from '@/components/Item/SearchItemDialog';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { useRouter } from 'next/navigation';
import { useCallback, type FC, type ReactNode, useState } from 'react';
import styles from './page.module.css';

export interface AddItemButtonProps {
  children: ReactNode;
  ids: number[];
}

export const AddItemButton: FC<AddItemButtonProps> = ({ children, ids }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleAddItem: SearchItemDialogSubmitHandler = useCallback((item) => {
    setOpen(false);

    if(item && !ids.includes(item.id)) {
      router.replace(`/tradingpost/compare?ids=${ids},${item.id}`);
    }
  }, [ids, router]);

  return (
    <div className={styles.addItemButtonWrapper}>
      <Button icon="add" onClick={handleClick} className={styles.addItemButton}>{children}</Button>
      <SearchItemDialog open={open} onSubmit={handleAddItem}/>
    </div>
  );
};
