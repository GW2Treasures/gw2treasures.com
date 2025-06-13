'use client';

import { createContextState } from '@/lib/context';
import { Icon, type IconProp } from '@gw2treasures/ui';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { use, type FC, type ReactNode } from 'react';
import styles from './table.module.css';
import { useUser } from '../User/use-user';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { useHasLocalStorageState } from '@/lib/useLocalStorageState';

// context to control the display of the attribute value
const {
  Provider: ShowAttributeValueContextProvider,
  context: showValueContext,
  useValue: useShowValue
} = createContextState(true, 'itemstats.showValue');

export {
  ShowAttributeValueContextProvider
};


export interface AttributeCellProps {
  colSpan?: number,
  icon: IconProp,
  value: number,
  children: ReactNode,
  major?: boolean,
  alignmentWidth?: number,
  small?: boolean,
}

export const AttributeCell: FC<AttributeCellProps> = ({ colSpan, icon, value, children, major, alignmentWidth = 0, small = false }) => {
  const showValue = useShowValue();

  return (
    <td colSpan={colSpan} width={small ? 1 : undefined} className={styles.cell}>
      <Icon icon={icon} color={major ? 'var(--color-focus)' : undefined} className={styles.icon}/>
      {showValue && (<><span className={styles.value} style={{ minWidth: `${alignmentWidth + 1}ch` }}>+{value}</span>{' '}</>)}
      {children}
    </td>
  );
};


export interface ShowAttributeValueCheckboxProps {
  children: ReactNode,
}

export const ShowAttributeValueCheckbox: FC<ShowAttributeValueCheckboxProps> = ({ children }) => {
  const [showValue, setShowValue] = use(showValueContext);
  const hasStoredValue = useHasLocalStorageState('itemstats.showValue');
  const user = useUser();

  // if the user is not logged in and has not changed the setting show a cookie warning
  if(!user && !hasStoredValue) {
    return (
      <Tip tip="Changing this setting will store cookies in your browser.">
        <Checkbox checked={showValue} onChange={setShowValue}>{children}</Checkbox>
      </Tip>
    );
  }

  return (
    <Checkbox checked={showValue} onChange={setShowValue}>{children}</Checkbox>
  );
};
