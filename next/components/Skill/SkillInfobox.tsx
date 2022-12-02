import { Skill } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { isTruthy } from '../../lib/is';
import { Headline } from '../Headline/Headline';
import { DataList } from '../Infobox/DataList';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { SkillLink } from './SkillLink';
import { SlotRenderer } from './SlotRenderer';

interface SkillInfoboxProps {
  skill: Skill;
  data: Gw2Api.Skill;
};

export const SkillInfobox: FC<SkillInfoboxProps> = ({ skill, data }) => {
  const router = useRouter();

  return (
    <div>
      <LanguageLinks link={<SkillLink skill={skill} icon="none"/>}/>
      <Headline id="info" noToc>Info</Headline>
      <DataList data={[
        data.professions && data.professions.length > 0 && data.professions.length !== 9 && { key: 'profession', label: 'Profession', value: data.professions.join(', ') },
        data.attunement && { key: 'attunement', label: 'Attunement', value: [data.attunement, data.dual_attunement].filter(isTruthy).join(' + ') },
        data.type && { key: 'type', label: 'Type', value: data.type },
        data.weapon_type && (data.weapon_type !== 'None' || data.type === 'Weapon') && { key: 'weapon', label: 'Weapon', value: data.weapon_type },
        data.slot && { key: 'slot', label: 'Slot', value: <>{data.slot} <SlotRenderer data={data}/></> },
      ]}/>
      <Headline id="links" noToc>Links</Headline>
    </div>
  );
};
