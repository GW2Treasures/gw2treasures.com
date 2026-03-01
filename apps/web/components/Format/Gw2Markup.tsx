import type { ElementType, FC } from 'react';
import { renderGw2Markup } from '@gw2/markup-react';
import React from 'react';
import styles from './Gw2Markup.module.css';

export interface Gw2MarkupProps {
  markup?: string,
  as?: ElementType,
}

export const Gw2Markup: FC<Gw2MarkupProps> = ({ markup, as }) => {
  if (!markup) {
    return null;
  }

  return renderGw2Markup(markup, {
    components: {
      root: as ?? React.Fragment,
      color: ({ children, color }) => color[0] === '#'
        ? <span style={{ color }} className="gw2-color">{children}</span>
        : <span className={styles[color.slice(1).toLowerCase()]}>{children}</span>,
    }
  });
};
