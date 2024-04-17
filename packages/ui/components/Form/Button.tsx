import { cx } from '../../lib/classNames';
import Link from 'next/link';
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import styles from './Button.module.css';
import { type IconProp, Icon, type IconColor } from '../../icons';

export interface CommonButtonProps extends Pick<HTMLAttributes<HTMLElement>, 'aria-label' | 'className'> {
  children?: ReactNode;
  icon?: IconProp;
  iconColor?: IconColor;
  appearance?: 'primary' | 'secondary' | 'tertiary' | 'menu';
  flex?: boolean;
  intent?: 'delete';
  iconOnly?: boolean;
}

export interface ButtonProps extends CommonButtonProps, Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'form' | 'name' | 'value' | 'formAction' | 'aria-label'> {
  type?: 'button' | 'submit'
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, icon, iconColor, appearance = 'secondary', flex, intent, iconOnly, onClick, className, type = 'button', ...props }, ref) {
  return (
    <button ref={ref} onClick={onClick} className={cx(styles[appearance], iconOnly && styles.iconOnly, flex && styles.flex, intent && styles[intent], className)} type={type} {...props}>
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

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps & Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>>(function Button({ children, icon, iconColor, appearance = 'secondary', flex, intent, iconOnly, className, external, ...props }, ref) {
  const LinkElement = external ? 'a' : Link;

  return (
    <LinkElement ref={ref} className={cx(styles[appearance], iconOnly && styles.iconOnly, flex && styles.flex, intent && styles[intent], className)} {...props}>
      {icon && <Icon icon={icon} color={iconColor}/>}
      <span>{children}</span>
    </LinkElement>
  );
});
