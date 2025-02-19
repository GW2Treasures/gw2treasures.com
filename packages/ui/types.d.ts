declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

import type * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties {
    // add known custom properties
    '--icon-size'?: `${string}px`;
    '--icon-color'?: CSS.Property.Color,

    // allow all custom properties
    [index: `--${string}`]: string | number | undefined;
  }
}
