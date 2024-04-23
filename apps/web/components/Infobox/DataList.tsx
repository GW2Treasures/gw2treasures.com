import { type FC, Fragment, type ReactNode } from 'react';
import { isTruthy } from '@gw2treasures/helper/is';
import styles from './DataList.module.css';

interface DataListProps {
  data: ({
    label: ReactNode,
    value: ReactNode,
    key: string
  } | false | undefined)[]
};

export const DataList: FC<DataListProps> = ({ data }) => {
  return (
    <dl className={styles.list}>
      {data.filter(isTruthy).map(({ key, label, value }) => (
        <Fragment key={key}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>{value}</dd>
        </Fragment>
      ))}
    </dl>
  );
};
