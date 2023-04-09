import type * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties {
    // add known custom properties
    '--icon-size'?: `${string}px`;
    '--icon-color'?: Property.Color,
    '--color-rarity'?: Property.Color,
    '--hero-color'?: Property.Color,

    // allow all custom properties
    [index: `--${string}`]: string | number;
  }
}
