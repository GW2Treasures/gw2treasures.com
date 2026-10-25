import type { CSSProperties, FC, ReactNode } from 'react';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { CompositeItem } from '@gw2treasures/ui/components/Focus/Composite';
import type { IconColor, IconProp } from '@gw2treasures/ui';
import { NavigationItemWithMenu } from './NavigationItemWithMenu';
import styles from './Navigation.module.css';

export interface NavigationItemProps {
  children: ReactNode,
  href: string,
  icon: IconProp,
  iconColor?: IconColor,
  style?: CSSProperties,
  /** `NavigationSubItem`s */
  menu?: ReactNode,
}

export const NavigationItem: FC<NavigationItemProps> = ({ menu, href, ...props }) => {
  if(menu) {
    return <NavigationItemWithMenu href={href} menu={menu} {...props}/>;
  }

  return (
    <li className={styles.item} role="none">
      <CompositeItem role="menuitem" render={<LinkButton appearance="menu" href={href} className={styles.button} {...props}/>}/>
    </li>
  );
};
