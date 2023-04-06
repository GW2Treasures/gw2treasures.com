import { cx } from '@/lib/classNames';
import Link from 'next/link';
import { forwardRef, ReactNode } from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  children: ReactNode;
  appearance?: 'primary' | 'secondary' | 'menu';
  iconOnly?: boolean;
  onClick?: () => void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, appearance = 'secondary', iconOnly, onClick }, ref) {
  return (
    <button ref={ref} onClick={onClick} className={cx(styles[appearance], iconOnly && styles.iconOnly)}>{children}</button>
  );
});

export interface LinkButtonProps extends ButtonProps {
  href: string;
  locale?: string | false;
  prefetch?: boolean;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function Button({ children, appearance = 'secondary', iconOnly, onClick, href, locale, prefetch }, ref) {
  return (
    <Link ref={ref} className={cx(styles[appearance], iconOnly && styles.iconOnly)} href={href} locale={locale} onClick={onClick} prefetch={prefetch}>{children}</Link>
  );
});
