import NextLink from 'next/link';
import React, { FC, ReactElement } from 'react';
import { Language } from '@prisma/client';
import { cx } from '../../lib/classNames';
import { ItemIcon } from '../Item/ItemIcon';
import styles from './EntityLink.module.css';
import rarityClasses from '../Layout/RarityColor.module.css';
import { IconSize } from '@/lib/getIconUrl';
import { LocalizedEntity, localizedName } from '@/lib/localizedName';
import { WithIcon } from '@/lib/with';

export interface EntityLinkProps {
  href: string;
  entity: WithIcon<LocalizedEntity> & { rarity?: string };
  icon?: IconSize | 'none' | ReactElement;
  language?: Language;
}

export const EntityLink: FC<EntityLinkProps> = ({ href, entity, icon = 32, language }) => {
  language = language ?? 'en'; // TODO

  return (
    <NextLink
      href={href}
      locale={language}
      className={cx(styles.link, entity.rarity && rarityClasses[entity.rarity])}
      hrefLang={language}
      prefetch={false}
    >
      <>
        {icon !== 'none' && entity.icon && (typeof icon === 'number' ? <ItemIcon icon={entity.icon} size={icon}/> : icon)}
        <span className={styles.name}>{localizedName(entity, language)}</span>
      </>
    </NextLink>
  );
};
