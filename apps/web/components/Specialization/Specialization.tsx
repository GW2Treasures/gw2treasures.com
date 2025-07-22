import type { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import type { WithIcon } from '@/lib/with';
import type { Specialization as SpecializationData } from '@gw2api/types/data/specialization';
import type { Trait } from '@gw2treasures/database';
import { Fragment, type FC } from 'react';
import styles from './Specialization.module.css';
import { groupById } from '@gw2treasures/helper/group-by';
import { TraitLink } from '../Traits/TraitLink';
import { range } from 'd3-array';

export interface SpecializationProps {
  data: SpecializationData,
  traits: Pick<WithIcon<Trait>, keyof typeof linkPropertiesWithoutRarity | 'slot' | 'tier'>[]
}

export const Specialization: FC<SpecializationProps> = ({ data, traits }) => {
  const traitsById = groupById(traits);

  return (
    <div className={styles.specialization}>
      <div className={styles.background} style={{ backgroundImage: `url(${data.background})` }}/>
      {range(3).map((tier) => (
        <Fragment key={tier}>
          <div className={styles.tier}>
            <TraitLink trait={traitsById.get(data.minor_traits[tier])!}>{null}</TraitLink>
          </div>
          <div className={styles.tier}>
            <TraitLink trait={traitsById.get(data.major_traits[tier * 3 + 0])!}>{null}</TraitLink>
            <TraitLink trait={traitsById.get(data.major_traits[tier * 3 + 1])!}>{null}</TraitLink>
            <TraitLink trait={traitsById.get(data.major_traits[tier * 3 + 2])!}>{null}</TraitLink>
          </div>
        </Fragment>
      ))}
    </div>
  );
};
