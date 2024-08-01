import type { Skin, Language } from '@gw2treasures/database';
import type { Gw2Api } from 'gw2-api-types';
import type { FC } from 'react';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Chatlink } from '../Infobox/Chatlink';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { SkinLink } from './SkinLink';
import { encode } from 'gw2e-chat-codes';
import { FormatNumber } from '../Format/FormatNumber';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { ShareButton } from '../ShareButton/ShareButton';
import { localizedName } from '@/lib/localizedName';
import { getCurrentUrl } from '@/lib/url';

interface SkinInfoboxProps {
  skin: Skin;
  data: Gw2Api.Skin;
  language: Language;
}

export const SkinInfobox: FC<SkinInfoboxProps> = ({ skin, language }) => {
  const chatlink = encode('skin', skin.id);

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
        <ShareButton appearance="tertiary" flex data={{ title: localizedName(skin, language), url: getCurrentUrl().toString() }}/>
      </FlexRow>
      {chatlink && <Chatlink chatlink={chatlink}/>}
    </div>
  );
};
