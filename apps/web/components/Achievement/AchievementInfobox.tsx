import { Achievement, Language } from '@gw2treasures/database';
import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import { FormatNumber } from '../Format/FormatNumber';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ExternalLink } from '../Link/ExternalLink';
import { AchievementLink } from './AchievementLink';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { ShareButton } from '../ShareButton/ShareButton';
import { localizedName } from '@/lib/localizedName';
import { getCurrentUrl } from '@/lib/url';

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

      <FlexRow wrap>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://api.guildwars2.com/v2/achievements/${achievement.id}?v=latest&lang=${language}`} target="api">API</LinkButton>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=${encodeURIComponent(localizedName(achievement, 'en'))}&go=Go`} target="wiki">Wiki</LinkButton>
        <ShareButton appearance="tertiary" flex data={{ title: localizedName(achievement, language), url: getCurrentUrl().toString() }}/>
      </FlexRow>
    </div>
  );
};
