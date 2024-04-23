import type { FC } from 'react';
import type { GuildUpgrade, Language } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import type { LocalizedEntity } from '@/lib/localizedName';
import { getLinkProperties } from '@/lib/linkProperties';

export interface GuildUpgradeLinkProps {
  guildUpgrade: WithIcon<Pick<GuildUpgrade, 'id' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
  revision?: string;
}

export const GuildUpgradeLink: FC<GuildUpgradeLinkProps> = ({ guildUpgrade, icon = 32, language, revision }) => {
  const entity = getLinkProperties(guildUpgrade);

  return (
    <EntityLink href={`/guild/upgrade/${guildUpgrade.id}${revision ? `/${revision}` : ''}`} entity={entity} icon={icon} language={language}/>
  );
};
