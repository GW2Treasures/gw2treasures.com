import type { Language, Skill } from '@gw2treasures/database';
import type { Gw2Api } from 'gw2-api-types';
import type { FC } from 'react';
import { isTruthy } from '@gw2treasures/helper/is';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Chatlink } from '../Infobox/Chatlink';
import { DataList } from '../Infobox/DataList';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { SkillLink } from './SkillLink';
import { SlotRenderer } from './SlotRenderer';
import { encode } from 'gw2e-chat-codes';
import { localizedName } from '@/lib/localizedName';
import { getCurrentUrl } from '@/lib/url';
import { ShareButton } from '../ShareButton/ShareButton';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';

interface SkillInfoboxProps {
  skill: Skill;
  data: Gw2Api.Skill;
  language: Language;
}

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

      <FlexRow wrap>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://api.guildwars2.com/v2/skills/${skill.id}?v=latest&lang=${language}`} target="api">API</LinkButton>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=${encodeURIComponent(chatlink)}&go=Go`} target="wiki">Wiki</LinkButton>
        <ShareButton appearance="tertiary" flex data={{ title: localizedName(skill, language), url: getCurrentUrl().toString() }}/>
      </FlexRow>

      {chatlink && (<Chatlink chatlink={chatlink}/>)}
    </div>
  );
};
