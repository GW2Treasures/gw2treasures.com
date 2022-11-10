import { Icon, Skin } from '@prisma/client';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { ItemIcon } from '../Item/ItemIcon';
import styles from './Search.module.css';

export interface SkinsProps {
  searchValue: string;
}

export const Skins: FC<SkinsProps> = ({ searchValue }) => {
  const [result, setResult] = useState<(Skin & { icon: Icon | null })[]>([]);

  useEffect(() => {
    const abort = new AbortController();

    fetch(`/api/skin/search?q=${encodeURIComponent(searchValue)}`, { signal: abort.signal }).then((r) => r.json()).then(({ result }) => {
      setResult(result);
    });
    return () => abort.abort();
  }, [searchValue]);

  if(searchValue === '' || result.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.category}>Skins</div>
      {result.map((skin) => (
        <Link href={`/skin/${skin.id}`} key={skin.id} className={styles.result}>
          {skin.icon && (<ItemIcon icon={skin.icon} size={32}/>)}
          <div className={styles.title}>
            {skin.name_en}
          </div>
          <div className={styles.subtitle}>
            {skin.rarity} {skin.weight} {(skin.subtype !== 'Generic' ? skin.subtype : '') || skin.type}
          </div>
        </Link>
      ))}
    </>
  );
};
