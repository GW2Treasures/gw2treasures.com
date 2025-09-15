import { localizedName } from '@/lib/localizedName';
import { getCurrentUrl } from '@/lib/url';
import type { Trait as TraitData } from '@gw2api/types/data/trait';
import type { Language, Trait } from '@gw2treasures/database';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { encode } from 'gw2e-chat-codes';
import type { FC } from 'react';
import { Chatlink } from '../Infobox/Chatlink';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ShareButton } from '../ShareButton/ShareButton';
import { TraitLink } from './TraitLink';

interface TraitInfoboxProps {
  trait: Trait,
  data: TraitData,
  language: Language,
}

export const TraitInfobox: FC<TraitInfoboxProps> = async ({ trait, language }) => {
  const chatlink = encode('trait', trait.id);
  const currentUrl = await getCurrentUrl();

  return (
    <div>
      <LanguageLinks link={<TraitLink trait={trait} icon="none"/>} language={language}/>

      <Headline id="links" noToc>Links</Headline>

      <FlexRow wrap>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://api.guildwars2.com/v2/traits/${trait.id}?v=latest&lang=${language}`} target="api">API</LinkButton>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=${encodeURIComponent(chatlink)}&go=Go`} target="wiki">Wiki</LinkButton>
        <ShareButton appearance="tertiary" flex data={{ title: localizedName(trait, language), url: currentUrl.toString() }}/>
      </FlexRow>

      {chatlink && (<Chatlink chatlink={chatlink}/>)}
    </div>
  );
};
