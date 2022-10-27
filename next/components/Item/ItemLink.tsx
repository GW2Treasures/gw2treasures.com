import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { Icon, Item, Language } from '@prisma/client';
import { cx } from '../../lib/classNames';
import { IconSize, ItemIcon } from './ItemIcon';
import styles from './ItemLink.module.css';
import rarityClasses from '../Layout/RarityColor.module.css';

export interface ItemLinkProps {
  item: Item & { icon?: Icon | null };
  icon?: IconSize | 'none';
  locale?: Language;
}

export const ItemLink: FC<ItemLinkProps> = ({ item, icon = 32, locale }) => {
  const router = useRouter();
  locale = locale ?? router.locale as Language ?? 'en';

  return (
    <Link href={`/item/${item.id}`} locale={locale}>
      <a className={cx(styles.link, rarityClasses[item.rarity])} hrefLang={locale}>
        {icon !== 'none' && item.icon && <ItemIcon icon={item.icon} size={icon}/>}
        <span className={styles.name}>{item[`name_${locale!}`]}</span>
      </a>
    </Link>
  );
};
