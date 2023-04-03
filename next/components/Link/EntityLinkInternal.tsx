'use client';

import NextLink from 'next/link';
import React, { forwardRef } from 'react';
import { cx } from '../../lib/classNames';
import { EntityIcon } from '../Entity/EntityIcon';
import styles from './EntityLink.module.css';
import rarityClasses from '../Layout/RarityColor.module.css';
import { EntityLinkProps } from './EntityLink';
import { localizedName } from '@/lib/localizedName';
import { useLanguage } from '../I18n/Context';
import { localizedUrl } from '@/lib/localizedUrl';

export const EntityLinkInternal = forwardRef<HTMLAnchorElement, EntityLinkProps>(function EntityLinkInternal({ href, entity, icon = 32, language, ...props }, ref) {
  const defaultLanguage = useLanguage();

  if(language && defaultLanguage !== language) {
    href = localizedUrl(href, language);
  }

  return (
    <NextLink
      suppressHydrationWarning
      href={href}
      locale={language}
      className={cx(styles.link, entity.rarity && rarityClasses[entity.rarity])}
      hrefLang={language}
      ref={ref}
      key={href}
      {...props}
    >
      <>
        {icon !== 'none' && entity.icon && (typeof icon === 'number' ? <EntityIcon icon={entity.icon} size={icon}/> : icon)}
        <span className={styles.name}>{localizedName(entity, language ?? defaultLanguage)}</span>
      </>
    </NextLink>
  );
});
