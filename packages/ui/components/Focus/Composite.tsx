'use client';

import { CompositeItem as FloatingCompositeItem } from '@floating-ui/react';
import { use, type ComponentProps, type FC } from 'react';

// re-export as client component
export { Composite } from '@floating-ui/react';

export const CompositeItem: FC<ComponentProps<typeof FloatingCompositeItem>> = ({ render, ...props }) => {
  // @ts-expect-error this is a workaround, because react@19 somehow broke passing children elements (see DropDown)
  //   `render` can be `{ $$typeof: Symbol(react.lazy) }` instead of an element, but CompositeItem needs `render.props.ref`.
  if(render?.$$typeof === Symbol.for('react.lazy')) { render = use(render._payload); }

  return <FloatingCompositeItem render={render} {...props}/>;
};
