import { Achievement, Language } from '@gw2treasures/database';
import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import { FormatNumber } from '../Format/FormatNumber';
import { Headline } from '@gw2treasures/ui';
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

      {achievement.unlocks !== null && (
        <>
          <Headline id="unlocks" noToc>Unlocks</Headline>
          <p>Unlocked by <b><FormatNumber value={achievement.unlocks * 100}/>%</b> of players on <ExternalLink href="https://gw2efficiency.com/account/unlock-statistics?filter.key=achievements">gw2efficiency</ExternalLink>.</p>
        </>
      )}

      <Headline id="links" noToc>Links</Headline>

      <ExternalLink href={`https://api.guildwars2.com/v2/achievements/${achievement.id}?v=latest&lang=${language}`} target="api">API</ExternalLink>
    </div>
  );
};
