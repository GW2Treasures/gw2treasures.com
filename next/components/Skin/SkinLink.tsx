import { FC } from 'react';
import { Language, Skin } from '@prisma/client';
import { IconSize } from '@/lib/getIconUrl';
import { Link } from '../Link/Link';
import { WithIcon } from '../../lib/with';

export interface SkinLinkProps {
  skin: WithIcon<Skin>;
  icon?: IconSize | 'none';
  locale?: Language;
}

export const SkinLink: FC<SkinLinkProps> = ({ skin, icon = 32, locale }) => {
  return <Link href={`/skin/${skin.id}`} item={skin} icon={icon} locale={locale}/>;
};
