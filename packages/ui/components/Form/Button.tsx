import { cx } from '../../lib/classNames';
import Link from 'next/link';
import { forwardRef, ReactNode } from 'react';
import styles from './Button.module.css';
import { IconProp, Icon } from '../../icons';

export interface ButtonProps {
  children: ReactNode;
  icon?: IconProp;
  appearance?: 'primary' | 'secondary' | 'menu';
  iconOnly?: boolean;
  onClick?: () => void;
  className?: string;
  form?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, icon, appearance = 'secondary', iconOnly, onClick, className, form }, ref) {
  return (
    <button ref={ref} onClick={onClick} className={cx(styles[appearance], iconOnly && styles.iconOnly, className)} form={form}>
      {icon && <Icon icon={icon}/>}
      <span>{children}</span>
    </button>
  );
});

export interface LinkButtonProps extends ButtonProps {
  href: string;
  locale?: string | false;
  prefetch?: boolean;
  external?: boolean;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps & Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>>(function Button({ children, icon, appearance = 'secondary', iconOnly, onClick, className, href, locale, prefetch, external, ...props }, ref) {
  const LinkElement = external ? 'a' : Link;

  return (
    <LinkElement ref={ref} className={cx(styles[appearance], iconOnly && styles.iconOnly, className)} href={href} locale={locale} onClick={onClick} prefetch={prefetch} {...props}>
      {icon && <Icon icon={icon}/>}
      <span>{children}</span>
    </LinkElement>
  );
});
