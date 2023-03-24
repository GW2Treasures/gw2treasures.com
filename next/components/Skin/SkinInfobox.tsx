import { Skin, Language } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import { Headline } from '../Headline/Headline';
import { Chatlink } from '../Infobox/Chatlink';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ExternalLink } from '../Link/ExternalLink';
import { SkinLink } from './SkinLink';
import { encode } from 'gw2e-chat-codes';
import { FormatNumber } from '../Format/FormatNumber';

interface SkinInfoboxProps {
  skin: Skin;
  data: Gw2Api.Skin;
  language: Language;
};

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
      <ExternalLink href={`https://api.guildwars2.com/v2/skins/${skin.id}?v=latest&lang=${language}`} target="api">API</ExternalLink>
      {chatlink && <Chatlink chatlink={chatlink}/>}
    </div>
  );
};
