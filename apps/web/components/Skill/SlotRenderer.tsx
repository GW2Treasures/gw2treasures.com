import type { Gw2Api } from 'gw2-api-types';
import type { FC } from 'react';
import styles from './SlotRenderer.module.css';

interface SlotRendererProps {
  data: Gw2Api.Skill;
}

export const SlotRenderer: FC<SlotRendererProps> = ({ data }) => {
  const slots = getSlotLayout(data);

  if(slots === undefined) {
    return null;
  }

  return (
    <div className={styles.slots}>
      {(slots.split('') as Slot[]).map((slot, i) => {
        // eslint-disable-next-line react/no-array-index-key
        return (<span key={i} className={slot === '0' ? styles.emptySlot : styles.slot}/>);
      })}
    </div>
  );
};

type Slot = 'X' | '0';
type Slots = `${Slot}${Slot}${Slot}${Slot}${Slot}` | `${Slot}${Slot}${Slot}${Slot}`;

function getSlotLayout(data: Gw2Api.Skill): Slots | undefined {


  switch(data.slot) {
    case 'Downed_1': return 'X000';
    case 'Downed_2': return '0X00';
    case 'Downed_3': return '00X0';
    case 'Downed_4': return '000X';
    case 'Elite': return '0000X';
    case 'Heal': return 'X0000';
    case 'Pet':
    case 'Profession_1':
    case 'Profession_2':
    case 'Profession_3':
    case 'Profession_4':
    case 'Profession_5':
    case 'Toolbelt':
    case 'Transform_1': return undefined;
    case 'Utility': return '0XXX0';
    case 'Weapon_1': return 'X0000';
    case 'Weapon_2': return '0X000';
    case 'Weapon_3': return '00X00';
    case 'Weapon_4': return '000X0';
    case 'Weapon_5': return '0000X';
  }
}

