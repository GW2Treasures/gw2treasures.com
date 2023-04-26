import { cx } from '@/lib/classNames';
import { IconName } from 'icons';
import Icon, { IconProps } from 'icons/Icon';
import Link from 'next/link';
import { forwardRef, ReactNode } from 'react';
import styles from './Button.module.css';

export interface CommonButtonProps {
  children: ReactNode;
  icon?: IconProps['icon'];
  appearance?: 'primary' | 'secondary' | 'menu';
  iconOnly?: boolean;
  onClick?: () => void;
  className?: string;
};

export interface ButtonProps extends CommonButtonProps {
  type?: 'button' | 'submit',
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, icon, appearance = 'secondary', iconOnly, onClick, className, type = 'button', disabled }, ref) {
  return (
    <button ref={ref} onClick={onClick} className={cx(styles[appearance], iconOnly && styles.iconOnly, className)} type={type} disabled={disabled}>
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
