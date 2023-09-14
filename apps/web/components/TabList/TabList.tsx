import { Icon, IconName } from '@gw2treasures/ui';
import { Children, FC, Key, ReactElement, ReactNode, useEffect, useState } from 'react';
import styles from './TabList.module.css';
import { Button } from '@gw2treasures/ui/components/Form/Button';

export interface TabListProps {
  children: ReactElement<TabProps> | Array<ReactElement<TabProps>>;
  actions?: ReactNode;
}

const identity = <T extends any>(x: T): T => x;

export const TabList: FC<TabListProps> = ({ children, actions }) => {
  const [activeTab, setActiveTab] = useState<string>(() => Children.map(children, identity)[0]?.props.id);

  useEffect(() => {
    const childs = Children.map(children, identity);
    if(!childs.find((child) => child.props.id === activeTab)) {
      setActiveTab(childs[0]?.props.id);
    }
  }, [activeTab, children]);

  return (
    <div className={styles.tabList}>
      <div className={styles.tabButtons}>
        {Children.map(children, (tab) => (
          <Button appearance="menu" key={tab.props.id} className={tab.props.id === activeTab ? styles.activeButton : styles.button} onClick={() => setActiveTab(tab.props.id)} icon={tab.props.icon}>
            {tab.props.title}
          </Button>
        ))}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      <div className={styles.content}>
        {Children.map(children, (tab) => (
          tab.props.id === activeTab ? tab : null
        ))}
      </div>
    </div>
  );
};

export interface TabProps {
  id: string;
  title: ReactNode;
  icon?: IconName;
  children: ReactNode;
}

export const Tab: FC<TabProps> = ({ title, icon, children }) => {
  return <>{children}</>;
};
