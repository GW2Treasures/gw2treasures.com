import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { Item, Language } from '../../.prisma/database';
import { ItemIcon } from './ItemIcon';
import styles from './ItemLink.module.css';

export interface ItemLinkProps {
  item: Item;
  icon?: 16 | 32 | 64 | 'none';
  locale?: Language;
}

export const ItemLink: FC<ItemLinkProps> = ({ item, icon = 32, locale }) => {
  const router = useRouter();
  locale = locale ?? router.locale as Language ?? 'en';

  return (
    <Link href={`/item/${item.id}`} locale={locale}>
      <a className={styles.link}>
        {/* {icon !== 'none' && <ItemIcon item={item} size={icon}/>} */}
        <span className={styles.name}>{item[`name_${locale!}`]}</span>
      </a>
    </Link>
  );
};
