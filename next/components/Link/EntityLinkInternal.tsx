'use client';

import NextLink from 'next/link';
import React, { FC } from 'react';
import { cx } from '../../lib/classNames';
import { ItemIcon } from '../Item/ItemIcon';
import styles from './EntityLink.module.css';
import rarityClasses from '../Layout/RarityColor.module.css';
import { EntityLinkProps } from './EntityLink';
import { localizedName } from '@/lib/localizedName';
import { useLanguage } from '../I18n/Context';

export const EntityLinkInternal: FC<EntityLinkProps> = ({ href, entity, icon = 32, language }) => {
  const defaultLanguage = useLanguage();

  if(language && defaultLanguage !== language) {
    if(typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.hostname = language + url.hostname.substring(2);
      href = url.href;
    } else {
      // TODO: suppressHydrationWarning could be removed if this were possible on the server
    }
  }

  return (
    <NextLink
      suppressHydrationWarning
      href={href}
      locale={language}
      className={cx(styles.link, entity.rarity && rarityClasses[entity.rarity])}
      hrefLang={language}
    >
      <>
        {icon !== 'none' && entity.icon && (typeof icon === 'number' ? <ItemIcon icon={entity.icon} size={icon}/> : icon)}
        <span className={styles.name}>{localizedName(entity, language ?? defaultLanguage)}</span>
      </>
    </NextLink>
  );
};
