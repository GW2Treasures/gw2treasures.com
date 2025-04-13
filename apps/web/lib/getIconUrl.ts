import type { Icon } from '@gw2treasures/database';

export type FixedIconSize = 16 | 32 | 64;
export type IconSize = FixedIconSize | (number & {});

export function getIconUrl({ id, signature }: Pick<Icon, 'id'> & Partial<Pick<Icon, 'signature'>>, size: FixedIconSize) {
  return signature
    ? `https://icons-gw2.darthmaim-cdn.com/${signature}/${id}-${size}px.png`
    : `https://assets.gw2dat.com/${id}.png`;
}


const iconSizes: FixedIconSize[] = [16, 32, 64];

export function getIconSize(size: IconSize): FixedIconSize {
  return iconSizes.find((iconSize) => iconSize >= size) || 64;
}
