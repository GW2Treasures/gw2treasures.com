import { cx } from '../../lib/classNames';
import Link from 'next/link';
import { forwardRef, type MouseEventHandler, type ReactNode } from 'react';
import styles from './Button.module.css';
import { type IconProp, Icon, type IconColor } from '../../icons';

export interface CommonButtonProps {
  children?: ReactNode;
  icon?: IconProp;
  iconColor?: IconColor;
  appearance?: 'primary' | 'secondary' | 'tertiary' | 'menu';
  flex?: boolean;
  intent?: 'delete';
  iconOnly?: boolean;
  className?: string;
}

export interface ButtonProps extends CommonButtonProps {
  type?: 'button' | 'submit'
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;

  form?: string;
  name?: string;
  value?: string;
  formAction?: string | ((...args: any[]) => Promise<unknown>);
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, icon, iconColor, appearance = 'secondary', flex, intent, iconOnly, onClick, className, type = 'button', disabled, form, name, value, formAction }, ref) {
  return (
    <button ref={ref} onClick={onClick} className={cx(styles[appearance], iconOnly && styles.iconOnly, flex && styles.flex, intent && styles[intent], className)} form={form} type={type} disabled={disabled} name={name} value={value} formAction={formAction as any}>
      {icon && <Icon icon={icon} color={iconColor}/>}
      {children && <span>{children}</span>}
    </button>
  );
});

export interface LinkButtonProps extends CommonButtonProps {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  href: string;
  locale?: string | false;
  prefetch?: boolean;
  external?: boolean;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps & Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>>(function Button({ children, icon, iconColor, appearance = 'secondary', flex, intent, iconOnly, onClick, className, href, locale, prefetch, external, ...props }, ref) {
  const LinkElement = external ? 'a' : Link;

  return (
    <LinkElement ref={ref} className={cx(styles[appearance], iconOnly && styles.iconOnly, flex && styles.flex, intent && styles[intent], className)} href={href} locale={locale} onClick={onClick} prefetch={prefetch} {...props}>
      {icon && <Icon icon={icon} color={iconColor}/>}
      <span>{children}</span>
    </LinkElement>
  );
});
