/// <reference types="@gw2treasures/ui/types" />

import type * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties {
    // add known custom properties
    '--color-rarity'?: Property.Color,
    '--hero-color'?: Property.Color,

    // allow all custom properties
    [index: `--${string}`]: string | number;
  }
}
