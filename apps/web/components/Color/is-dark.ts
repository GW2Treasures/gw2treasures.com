import type { RGB } from './types';

export function isDark(rgb: RGB): boolean {
  return (Math.max(...rgb) + Math.min(...rgb)) < 0xFF;
}
