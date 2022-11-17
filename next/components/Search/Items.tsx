import { Icon, Item } from '@prisma/client';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { ItemIcon } from '../Item/ItemIcon';
import styles from './Search.module.css';

export interface ItemsProps {
  searchValue: string;
}

export const Items: FC<ItemsProps> = ({ searchValue }) => {
  const [result, setResult] = useState<(Item & { icon: Icon | null })[]>([]);

  useEffect(() => {
    const abort = new AbortController();

    fetch(`/api/search/items?q=${encodeURIComponent(searchValue)}`, { signal: abort.signal }).then((r) => r.json()).then(({ result }) => {
      setResult(result);
    });
    return () => abort.abort();
  }, [searchValue]);

  if(result.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.category}>Items</div>
      {result.map((item) => (
        <Link href={`/item/${item.id}`} key={item.id} className={styles.result}>
          {item.icon && (<ItemIcon icon={item.icon} size={32}/>)}
          <div className={styles.title}>
            {item.name_en}
          </div>
          <div className={styles.subtitle}>
            {item.level > 0 && `${item.level} - `}{item.rarity} {item.weight} {(item.subtype !== 'Generic' ? item.subtype : '') || item.type}
          </div>
        </Link>
      ))}
    </>
  );
};
