/// <reference types="@gw2treasures/ui/types" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties {
    // add known custom properties
    '--color-rarity'?: Property.Color,
    '--hero-color'?: Property.Color,
  }
}
