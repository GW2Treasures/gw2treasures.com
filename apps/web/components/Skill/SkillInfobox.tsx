import { Language, Skill } from '@gw2treasures/database';
import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import { isTruthy } from '../../lib/is';
import { Headline } from '@gw2treasures/ui';
import { Chatlink } from '../Infobox/Chatlink';
import { DataList } from '../Infobox/DataList';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ExternalLink } from '../Link/ExternalLink';
import { SkillLink } from './SkillLink';
import { SlotRenderer } from './SlotRenderer';
import { encode } from 'gw2e-chat-codes';

interface SkillInfoboxProps {
  skill: Skill;
  data: Gw2Api.Skill;
  language: Language;
};

export const SkillInfobox: FC<SkillInfoboxProps> = ({ skill, data, language }) => {
  const chatlink = encode('skill', skill.id);

  return (
    <div>
      <LanguageLinks link={<SkillLink skill={skill} icon="none"/>} language={language}/>

      <Headline id="info" noToc>Info</Headline>
      <DataList data={[
        data.professions && data.professions.length > 0 && data.professions.length !== 9 && { key: 'profession', label: 'Profession', value: data.professions.join(', ') },
        data.attunement && { key: 'attunement', label: 'Attunement', value: [data.attunement, data.dual_attunement].filter(isTruthy).join(' + ') },
        data.type && { key: 'type', label: 'Type', value: data.type },
        data.weapon_type && (data.weapon_type !== 'None' || data.type === 'Weapon') && { key: 'weapon', label: 'Weapon', value: data.weapon_type },
        data.slot && { key: 'slot', label: 'Slot', value: <>{data.slot} <SlotRenderer data={data}/></> },
      ]}/>

      <Headline id="links" noToc>Links</Headline>
      <ExternalLink href={`https://api.guildwars2.com/v2/skills/${skill.id}?v=latest&lang=${language}`} target="api">API</ExternalLink>
      {chatlink && (<Chatlink chatlink={chatlink}/>)}
    </div>
  );
};
