import Link from 'next/link';
import { type FC, type ReactElement, type ReactNode } from 'react';
import styles from './Switch.module.css';
import { Icon, type IconProp } from '../../icons';
import { Tip } from '../Tip/Tip';
import { Composite, CompositeItem } from '../Focus/Composite';

export interface SwitchProps {
  children: ReactElement<SwitchControlProps>[]
}

export type SwitchControlProps = {
  children?: ReactNode;
  active?: boolean;
  clickAction?: () => void;
  icon?: IconProp;
  tip?: ReactNode;
} & (
  | { type?: 'button', href?: never, replace?: never, scroll?: never, clickAction: () => void, name?: string, value?: string }
  | { type: 'link', href: string, replace?: boolean, scroll?: boolean, name?: never, value?: never }
  | { type: 'radio', href?: never, replace?: never, scroll?: never, name: string, value: string }
);

export const Switch: FC<SwitchProps> & { Control: FC<SwitchControlProps> } = ({ children }: SwitchProps) => {
  return (
    <Composite className={styles.wrapper}>
      {children}
    </Composite>
  );
};

Switch.Control = ({ children, active, type = 'button', href, clickAction, name, value, icon, tip, replace, scroll }: SwitchControlProps) => {
  const Element = type === 'link' ? Link : type === 'radio' ? 'label' : 'button';

  const element = (
    <Element href={href!} replace={replace} scroll={scroll} onClick={clickAction} className={active && type !== 'radio' ? styles.controlActive : styles.control} name={type === 'button' ? name : undefined} value={type === 'button' ? value : undefined}>
      {type === 'radio' && <input type="radio" name={name} value={value} className={styles.radio} defaultChecked={active}/>}
      {icon && (<Icon icon={icon} className={styles.icon}/>)}
      {children && (<span>{children}</span>)}
    </Element>
  );

  return tip
    ? <Tip tip={tip}><CompositeItem render={element} data-active={active}/></Tip>
    : <CompositeItem render={element}/>;
};

Switch.Control.displayName = 'Switch.Control';
