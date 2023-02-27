import Link from 'next/link';
import { forwardRef, ReactNode } from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  children: ReactNode;
  appearance?: 'primary' | 'secondary' | 'menu';
  onClick?: () => void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, appearance = 'secondary', onClick }, ref) {
  return (
    <button ref={ref} onClick={onClick} className={styles[appearance]}>{children}</button>
  );
});

export interface LinkButtonProps extends ButtonProps {
  href: string;
  locale?: string | false;
  prefetch?: boolean;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function Button({ children, appearance = 'secondary', onClick, href, locale, prefetch }, ref) {
  return (
    <Link ref={ref} className={styles[appearance]} href={href} locale={locale} onClick={onClick} prefetch={prefetch}>{children}</Link>
  );
});
