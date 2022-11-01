import { FC } from 'react';
import styles from './ItemAttributes.module.css';

interface ItemAttributesProps {
  attributes: Record<string, number>
};

const PercentageAttributes = ['ConditionDuration', 'BoonDuration'];

function isPercentage(attribute: string): boolean {
  return PercentageAttributes.includes(attribute);
}

export const ItemAttributes: FC<ItemAttributesProps> = ({ attributes }) => {
  const entries = Object.entries(attributes);

  if(entries.length === 0) {
    return null;
  }

  return (
    <dl className={styles.attributes}>
      {entries.map(([attribute, value]) => (
        <>
          <dt>+{value}{isPercentage(attribute) && '%'}</dt>
          <dd>{attribute}</dd>
        </>
      ))}
    </dl>
  );
};
