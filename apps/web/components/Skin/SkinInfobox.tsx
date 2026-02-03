import { localizedName } from '@/lib/localizedName';
import { ChatlinkType, encodeChatlink } from '@gw2/chatlink';
import type * as Gw2Api from '@gw2api/types/data/skin';
import type { Language, Skin } from '@gw2treasures/database';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import type { FC } from 'react';
import { FormatNumber } from '../Format/FormatNumber';
import { Chatlink } from '../Infobox/Chatlink';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ShareButton } from '../ShareButton/ShareButton';
import { SkinLink } from './SkinLink';

interface SkinInfoboxProps {
  skin: Skin,
  data: Gw2Api.Skin,
  language: Language,
}

export const SkinInfobox: FC<SkinInfoboxProps> = ({ skin, language }) => {
  const chatlink = encodeChatlink(ChatlinkType.Wardrobe, skin.id);

  return (
    <div>
      <LanguageLinks language={language} link={<SkinLink icon="none" skin={skin}/>}/>

      {skin.unlocks !== null && (
        <>
          <Headline id="unlocks" noToc>Unlocks</Headline>
          <p>Unlocked by <b><FormatNumber value={skin.unlocks * 100}/>%</b> of players on <ExternalLink href="https://gw2efficiency.com/account/unlock-statistics?filter.key=skins">gw2efficiency</ExternalLink>.</p>
        </>
      )}

      <Headline id="links" noToc>Links</Headline>
      <FlexRow wrap>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://api.guildwars2.com/v2/skins/${skin.id}?v=latest&lang=${language}`} target="api">API</LinkButton>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=${encodeURIComponent(chatlink)}&go=Go`} target="wiki">Wiki</LinkButton>
        <ShareButton appearance="tertiary" flex data={{ title: localizedName(skin, language), url: `/skin/${skin.id}` }}/>
      </FlexRow>
      <Chatlink chatlink={chatlink}/>
    </div>
  );
};
