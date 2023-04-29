declare module '*.svg?svgr' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

import type * as CSS from 'csstype';

declare module 'csstype' {

  interface Properties {
    // add known custom properties
    '--icon-size'?: `${string}px`;
    '--icon-color'?: Property.Color,
  }
}
