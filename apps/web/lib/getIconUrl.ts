import type { Icon } from '@gw2treasures/database';

export type FixedIconSize = 16 | 32 | 64;
export type IconSize = FixedIconSize | (number & {});

export function getIconUrl({ id, signature }: Pick<Icon, 'id' | 'signature'>, size: FixedIconSize) {
  return `https://icons-gw2.darthmaim-cdn.com/${signature}/${id}-${size}px.png`;
}


const iconSizes: FixedIconSize[] = [16, 32, 64];

export function getIconSize(size: IconSize): FixedIconSize {
  return iconSizes.find((iconSize) => iconSize >= size) || 64;
}
