import type { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import type { WithIcon } from '@/lib/with';
import type { Specialization as SpecializationData } from '@gw2api/types/data/specialization';
import type { Trait } from '@gw2treasures/database';
import { Fragment, type FC } from 'react';
import styles from './Specialization.module.css';
import { groupById } from '@gw2treasures/helper/group-by';
import { TraitLink, type TraitLinkProps } from '../Trait/TraitLink';
import { range } from 'd3-array';
import { EntityIconMissing } from '../Entity/EntityIconMissing';

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
            <MaybeTraitLink trait={traitsById.get(data.minor_traits[tier])}>{null}</MaybeTraitLink>
          </div>
          <div className={styles.tier}>
            <MaybeTraitLink trait={traitsById.get(data.major_traits[tier * 3 + 0])}>{null}</MaybeTraitLink>
            <MaybeTraitLink trait={traitsById.get(data.major_traits[tier * 3 + 1])}>{null}</MaybeTraitLink>
            <MaybeTraitLink trait={traitsById.get(data.major_traits[tier * 3 + 2])}>{null}</MaybeTraitLink>
          </div>
        </Fragment>
      ))}
    </div>
  );
};


const MaybeTraitLink: FC<TraitLinkProps | { trait?: null }> = ({ trait, ...props }) => {
  if(!trait) {
    return <EntityIconMissing size={32}/>;
  }

  return <TraitLink trait={trait} {...props}/>;
};
