import React, { FC, useDeferredValue, useEffect, useRef, useState } from 'react';
import styles from './Search.module.css';
import Icon from '../../icons/Icon';
import { Icon as DbIcon, Item } from '@prisma/client';
import { ItemIcon } from '../Item/ItemIcon';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface SearchProps {
  // TODO: add props
}

export const Search: FC<SearchProps> = ({ }) => {
  const [value, setValue] = useState('');
  const searchValue = useDeferredValue(value);
  const searchForm = useRef<HTMLFormElement>(null);

  const router = useRouter();
  
  const [result, setResult] = useState<(Item & { icon: DbIcon | null })[]>([]);

  useEffect(() => {
    const abort = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(searchValue)}`, { signal: abort.signal }).then((r) => r.json()).then(({ result }) => {
      setResult(result);
    });
    return () => abort.abort();
  }, [searchValue]);

  useEffect(() => {
    if(window.document.activeElement && searchForm.current?.contains(window.document.activeElement)) {
      (window.document.activeElement as any).blur();
    }
  }, [router.asPath]);

  return (
    <form className={styles.search} ref={searchForm}>
      <Icon icon="search"/>
      {/* <div className={styles.restriciton}>Item</div> */}
      <input className={styles.searchInput} placeholder="Search (ALT + Q)" accessKey="q" value={value} onChange={(e) => setValue(e.target.value)}/>
      <div className={styles.dropdown}>
        <div className={styles.category}>Items</div>
        {result.map((item) => (
          <Link href={`/item/${item.id}`} key={item.id}>
            <a key={item.id} className={styles.result}>
              {item.icon && (<ItemIcon icon={item.icon} size={32}/>)}
              <div className={styles.title}>
                {item.name_en}
              </div>
              <div className={styles.subtitle}>
                {item.level > 0 && `${item.level} - `}{item.rarity} {item.weight} {(item.subtype !== 'Generic' ? item.subtype : '') || item.type}
              </div>
            </a>
          </Link>
        ))}
      </div>
    </form>
  );
};
