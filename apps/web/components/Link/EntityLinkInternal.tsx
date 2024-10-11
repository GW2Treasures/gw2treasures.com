'use client';

import NextLink from 'next/link';
import type { FC } from 'react';
import { EntityIcon } from '../Entity/EntityIcon';
import styles from './EntityLink.module.css';
import rarityClasses from '../Layout/RarityColor.module.css';
import type { EntityLinkProps } from './EntityLink';
import { localizedName } from '@/lib/localizedName';
import { useLanguage } from '../I18n/Context';
import { localizedUrl } from '@/lib/localizedUrl';
import { cx } from '@gw2treasures/ui';
import { EntityIconMissing } from '../Entity/EntityIconMissing';

export const EntityLinkInternal: FC<EntityLinkProps> = ({ ref, href, entity, icon = 32, language, iconType, ...props }) => {
  const defaultLanguage = useLanguage();

  if(language && defaultLanguage !== language) {
    href = localizedUrl(href, language);
  }

  return (
    <NextLink
      suppressHydrationWarning
      href={href}
      locale={language}
      className={cx(styles.link, 'rarity' in entity ? rarityClasses[entity.rarity] : styles.noRarity)}
      hrefLang={language}
      ref={ref}
      key={href}
      {...props}
    >
      <>
        {icon !== 'none' && (typeof icon === 'number' ? (entity.icon ? <EntityIcon icon={entity.icon} size={icon} type={iconType}/> : <EntityIconMissing size={icon}/>) : icon)}
        <span className={styles.name}>{localizedName(entity, language ?? defaultLanguage)}</span>
      </>
    </NextLink>
  );
};
