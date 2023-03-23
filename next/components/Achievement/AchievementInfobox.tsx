import { Achievement, Language } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import { Headline } from '../Headline/Headline';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ExternalLink } from '../Link/ExternalLink';
import { AchievementLink } from './AchievementLink';

interface AchievementInfoboxProps {
  achievement: Achievement;
  data: Gw2Api.Achievement;
  language: Language;
};

export const AchievementInfobox: FC<AchievementInfoboxProps> = ({ achievement, language }) => {

  return (
    <div>
      <LanguageLinks language={language} link={<AchievementLink icon="none" achievement={achievement}/>}/>

      <Headline id="links" noToc>Links</Headline>

      <ExternalLink href={`https://api.guildwars2.com/v2/achievements/${achievement.id}?v=latest&lang=${language}`} target="api">API</ExternalLink>
    </div>
  );
};
