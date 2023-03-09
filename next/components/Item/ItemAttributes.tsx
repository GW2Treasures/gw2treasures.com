import { FC, Fragment } from 'react';
import { Gw2Api } from 'gw2-api-types';
import styles from './ItemAttributes.module.css';
import { Trans } from '../I18n/Trans';

type Attribute = Exclude<Exclude<Gw2Api.Item['details'], undefined>['infix_upgrade'], undefined>['attributes'][0];
type AttributeName = Attribute['attribute'];

interface ItemAttributesProps {
  attributes: Attribute[] | undefined;
};

const PercentageAttributes: AttributeName[] = [];

function isPercentage(attribute: AttributeName): boolean {
  return PercentageAttributes.includes(attribute);
}

export const ItemAttributes: FC<ItemAttributesProps> = ({ attributes }) => {
  if(!attributes) {
    return null;
  }

  return (
    <dl className={styles.attributes}>
      {attributes.map(({ attribute, modifier }) => (
        <Fragment key={attribute}>
          <dt>+{modifier}{isPercentage(attribute) && '%'}</dt>
          <dd><Trans id={`attribute.${attribute}`}/></dd>
        </Fragment>
      ))}
    </dl>
  );
};
