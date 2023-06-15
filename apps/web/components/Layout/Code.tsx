import { FC, ReactNode } from 'react';
import styles from './Code.module.css';
import { Source_Code_Pro } from 'next/font/google';
import { cx } from '@gw2treasures/ui';

interface CodeProps {
  children: ReactNode;
  borderless?: boolean;
  inline?: boolean;
};

const font = Source_Code_Pro({
  subsets: ['latin'],
  weight: 'variable',
  fallback: ['monospace'],
});

export const Code: FC<CodeProps> = ({ children, borderless = false, inline = false }) => {
  if(inline) {
    return (
      <code className={cx(borderless ? styles.inline : styles.inlineBorder, font.className)}>{children}</code>
    );
  }

  return (
    <pre className={cx(borderless ? styles.code : styles.codeBorder, font.className)}><code>{children}</code></pre>
  );
};
