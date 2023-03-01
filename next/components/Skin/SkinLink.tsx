import { FC } from 'react';
import { Language, Skin } from '@prisma/client';
import { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import { WithIcon } from '../../lib/with';

export interface SkinLinkProps {
  skin: WithIcon<Skin>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const SkinLink: FC<SkinLinkProps> = ({ skin, icon = 32, language }) => {
  return <EntityLink href={`/skin/${skin.id}`} entity={skin} icon={icon} language={language}/>;
};
