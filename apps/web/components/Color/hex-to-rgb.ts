import type { RGB } from './types';

export function hexToRgb(hex: string): RGB {
  const value = parseInt(hex, 16);

  return [
    (value >> 16) & 0xFF,
    (value >> 8) & 0xFF,
    value & 0xFF,
  ];
}
