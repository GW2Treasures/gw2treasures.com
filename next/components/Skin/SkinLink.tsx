import { FC } from 'react';
import { Icon, Language, Skin } from '@prisma/client';
import { IconSize } from '../Item/ItemIcon';
import { Link } from '../Link/Link';

export interface SkinLinkProps {
  skin: Skin & { icon?: Icon | null };
  icon?: IconSize | 'none';
  locale?: Language;
}

export const SkinLink: FC<SkinLinkProps> = ({ skin, icon = 32, locale }) => {
  return <Link href={`/skin/${skin.id}`} item={skin} icon={icon} locale={locale}/>;
};
