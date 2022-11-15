import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, ReactElement } from 'react';
import { Icon, Language } from '@prisma/client';
import { cx } from '../../lib/classNames';
import { IconSize, ItemIcon } from '../Item/ItemIcon';
import styles from './Link.module.css';
import rarityClasses from '../Layout/RarityColor.module.css';

export interface LinkProps {
  href: string;
  item: { name_de: string, name_en: string, name_es: string, name_fr: string, icon?: Icon | null, rarity?: string };
  icon?: IconSize | 'none' | ReactElement;
  locale?: Language;
}

export const Link: FC<LinkProps> = ({ href, item, icon = 32, locale }) => {
  const router = useRouter();
  locale = locale ?? router.locale as Language ?? 'en';

  return (
    <NextLink
      href={href}
      locale={locale}
      className={cx(styles.link, item.rarity && rarityClasses[item.rarity])}
      hrefLang={locale}
    >
      {icon !== 'none' && item.icon && (typeof icon === 'number' ? <ItemIcon icon={item.icon} size={icon}/> : icon)}
      <span className={styles.name}>{item[`name_${locale!}`]}</span>
    </NextLink>
  );
};
