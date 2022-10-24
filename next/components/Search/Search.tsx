import React, { FC, useDeferredValue, useEffect, useRef, useState } from 'react';
import styles from './Search.module.css';
import Icon from '../../icons/Icon';
import { Icon as DbIcon, Item } from '../../.prisma/database';
import { ItemLink } from '../Item/ItemLink';
import { ItemIcon } from '../Item/ItemIcon';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface SearchProps {
  // TODO: add props
}

export const Search: FC<SearchProps> = ({ }) => {
  const [value, setValue] = useState('');
  const searchValue = useDeferredValue(value);
  const input = useRef<HTMLInputElement>(null);

  const router = useRouter();
  
  const [result, setResult] = useState<(Item & { icon: DbIcon | null })[]>([]);

  useEffect(() => {
    const { abort, signal } = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(value)}`, { signal }).then((r) => r.json()).then(({ result }) => {
      setResult(result);
    });
    //return () => abort();
  }, [value]);

  useEffect(() => {
    window.document.activeElement?.blur();
  }, [router.asPath]);

  return (
    <div className={styles.search}>
      <Icon icon="search"/>
      {/* <div className={styles.restriciton}>Item</div> */}
      <input className={styles.searchInput} placeholder="Search (ALT + Q)" accessKey="q" value={value} onChange={(e) => setValue(e.target.value)} ref={input}/>
      <div className={styles.dropdown}>
        <div className={styles.category}>Items</div>
        {result.map((item) => (
          <Link href={`/item/${item.id}`}>
            <a key={item.id} className={styles.result}>
              {item.icon && (<ItemIcon icon={item.icon} size={32}/>)}
              {item.name_en}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};
