import { Skin, Language } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import { Headline } from '../Headline/Headline';
import { Chatlink } from '../Infobox/Chatlink';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ExternalLink } from '../Link/ExternalLink';
import { SkinLink } from './SkinLink';
import { encode } from 'gw2e-chat-codes';

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

      <Headline id="links" noToc>Links</Headline>

      <ExternalLink href={`https://api.guildwars2.com/v2/skins/${skin.id}?v=latest&lang=${language}`} target="api">API</ExternalLink>

      {chatlink && <Chatlink chatlink={chatlink}/>}
    </div>
  );
};
