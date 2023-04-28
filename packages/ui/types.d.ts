declare module '*.svg?svgr' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
