import type { Mini, Language } from '@gw2treasures/database';
import type { FC } from 'react';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { MiniLink } from './MiniLink';
import { FormatNumber } from '../Format/FormatNumber';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { ShareButton } from '../ShareButton/ShareButton';
import { localizedName } from '@/lib/localizedName';
import { getCurrentUrl } from '@/lib/url';

interface MiniInfoboxProps {
  mini: Mini,
  language: Language,
}

export const MiniInfobox: FC<MiniInfoboxProps> = async ({ mini, language }) => {
  const currentUrl = await getCurrentUrl();

  return (
    <div>
      <LanguageLinks language={language} link={<MiniLink icon="none" mini={mini}/>}/>

      {mini.unlocks !== null && (
        <>
          <Headline id="unlocks" noToc>Unlocks</Headline>
          <p>Unlocked by <b><FormatNumber value={mini.unlocks * 100}/>%</b> of players on <ExternalLink href="https://gw2efficiency.com/account/unlock-statistics?filter.key=minis">gw2efficiency</ExternalLink>.</p>
        </>
      )}

      <Headline id="links" noToc>Links</Headline>
      <FlexRow wrap>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://api.guildwars2.com/v2/minis/${mini.id}?v=latest&lang=${language}`} target="api">API</LinkButton>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=${encodeURIComponent(localizedName(mini, language))}&go=Go`} target="wiki">Wiki</LinkButton>
        <ShareButton appearance="tertiary" flex data={{ title: localizedName(mini, language), url: currentUrl.toString() }}/>
      </FlexRow>
    </div>
  );
};
