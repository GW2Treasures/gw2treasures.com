import { Icon } from '@prisma/client';

export type IconSize = 16 | 32 | 64;

export function getIconUrl({ id, signature }: Pick<Icon, 'id' | 'signature'>, size: IconSize) {
  return `https://icons-gw2.darthmaim-cdn.com/${signature}/${id}-${size}px.png`;
}
