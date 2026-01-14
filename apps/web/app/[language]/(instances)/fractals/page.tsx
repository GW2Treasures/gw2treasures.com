/* eslint-disable @next/next/no-img-element */
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageView } from '@/components/PageView/PageView';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import type { PageProps } from '@/lib/next';
import { getLanguage, getTranslate } from '@/lib/translate';
import type { Language } from '@gw2treasures/database';
import { dailies, fractal_details, getDayOfYearIndex, getInstabilities, instability_details, recommended, scales } from '@gw2treasures/static-data/fractals/index';
import { Switch } from '@gw2treasures/ui/components/Form/Switch';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { DateSelector } from './date-selector';
import ogImage from './fractals-og.png';
import { formatDate, getCanonicalUrl, getDateOrFallback, getTierOrFallback } from './helper';
import { Scope } from '@gw2me/client';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { AccountAchievementProgressCell } from '@/components/Achievement/AccountAchievementProgress';
import { Icon } from '@gw2treasures/ui';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { groupById } from '@gw2treasures/helper/group-by';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { createMetadata } from '@/lib/metadata';
import { BonusEvent, getBonusEvent, isBonusEventActive } from 'app/[language]/bonus-event/bonus-events';
import { FestivalTimer } from '@/components/Reset/FestivalTimer';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';

// Kinfall and above have CM
const firstCMScale = 95;

const requiredScopes: Scope[] = [Scope.GW2_Account, Scope.GW2_Progression];

const getAchievements = cache((ids: number[]) => db.achievement.findMany({
  where: { id: { in: ids }},
  select: { ...linkPropertiesWithoutRarity, flags: true, prerequisitesIds: true }
}), ['fractal-achievements'], { revalidate: 60 });

const achievementIds = [
  ...scales.map(({ daily_achievement_id }) => daily_achievement_id),
  ...recommended.flatMap((recs) => recs.map(({ achievement_id }) => achievement_id)),
];

export default async function FractalsPage({ searchParams }: PageProps) {
  const language = await getLanguage();
  const { tier: rawTier, date: rawDate } = await searchParams;

  const achievements = groupById(await getAchievements(achievementIds));

  const today = formatDate(new Date());
  const date = getDateOrFallback(Array.isArray(rawDate) ? rawDate[0] : rawDate);
  const parsedDate = new Date(date);
  const tierString = getTierOrFallback(Array.isArray(rawTier) ? rawTier[0] : rawTier);
  const tier =
    tierString === 'cm' ? 4 :
    tierString === 'all' ? 0 :
    parseInt(tierString);

  const dayOfYearIndex = getDayOfYearIndex(parsedDate);
  const currentDaily = dayOfYearIndex % 15;

  const fractals = scales.toReversed()
    .map((fractal) => {
      const rec = recommended[currentDaily].find(({ scale }) => scale === fractal.scale);

      return {
        ...fractal,
        tier: Math.floor((fractal.scale - 1) / 25) + 1,
        isDaily: dailies[currentDaily].includes(fractal.type),
        isRecommended: rec !== undefined,
        recommended_achievement_id: rec?.achievement_id,
      };
    })
    .filter((fractal) =>
      tierString === 'all' ||
      (tierString === 'cm' && fractal.scale >= firstCMScale) ||
      (fractal.isDaily && fractal.tier === tier) ||
      (fractal.isRecommended && fractal.tier <= tier)
    );

  const fractalRush = getBonusEvent(BonusEvent.FractalRush);

  const Fractals = createDataTable(fractals, ({ scale }) => scale);

  const t = getTranslate(language);

  return (
    <>
      {isBonusEventActive(fractalRush) && (
        <Notice>
          <FlexRow align="space-between" wrap>
            <div>
              Complete fractals during the <b>Fractal Rush</b> bonus event to earn additional rewards.
            </div>
            <FestivalTimer festival={fractalRush}/>
          </FlexRow>
        </Notice>
      )}

      <Description actions={<span style={{ lineHeight: '36px' }}>Reset: <ResetTimer reset="current-daily"/></span>}>
        <Trans id="fractals.description"/>
      </Description>

      <div style={{ marginTop: -8, marginBottom: 16, marginInline: -16, paddingBlock: 12, paddingInline: 16, background: 'var(--color-background-light)', borderBlock: '1px solid var(--color-border-dark)', display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Trans id="fractals.daily"/>:
          <Switch>
            <Switch.Control type="link" replace active={tierString === 'cm'} href={getCanonicalUrl('cm', date)}>T4&#x202F;+&#x202F;CM</Switch.Control>
            <Switch.Control type="link" replace active={tierString === '4'} href={getCanonicalUrl('4', date)}>T4</Switch.Control>
            <Switch.Control type="link" replace active={tierString === '3'} href={getCanonicalUrl('3', date)}>T3</Switch.Control>
            <Switch.Control type="link" replace active={tierString === '2'} href={getCanonicalUrl('2', date)}>T2</Switch.Control>
            <Switch.Control type="link" replace active={tierString === '1'} href={getCanonicalUrl('1', date)}>T1</Switch.Control>
            <Switch.Control type="link" replace active={tierString === 'all'} href={getCanonicalUrl('all', date)}><Trans id="fractals.tier.all"/></Switch.Control>
          </Switch>
        </label>
        <label style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Trans id="fractals.date"/>:
          <DateSelector date={parsedDate} tier={tierString}/>
        </label>
      </div>

      <Fractals.Table>
        <Fractals.Column id="tier" title={t('fractals.tier')} sortBy="scale" small>{({ tier, scale }) => `T${tier}${(tierString === 'cm' && scale >= firstCMScale) ? '\u202F+\u202FCM' : ''}`}</Fractals.Column>
        <Fractals.Column id="level" title={t('fractals.level')} align="right" sortBy="scale" small>{({ scale }) => <FormatNumber value={scale}/>}</Fractals.Column>
        <Fractals.Column id="name" title={t('fractal')} sortBy="type">{({ type }) => fractal_details[type as keyof typeof fractal_details].name[language] }</Fractals.Column>
        <Fractals.Column id="daily" title={t('fractals.daily')} sortBy={({ isDaily, isRecommended }) => isDaily ? 1 : isRecommended ? 2 : 3}>
          {({ isDaily, isRecommended, daily_achievement_id, recommended_achievement_id }) =>
            isRecommended ? <AchievementLink achievement={achievements.get(recommended_achievement_id!)!}><Trans id="fractals.recommended"/></AchievementLink> :
            isDaily ? <AchievementLink achievement={achievements.get(daily_achievement_id)!}><Trans id="fractals.daily"/></AchievementLink> :
            null}
        </Fractals.Column>
        <Fractals.Column id="instabilities" title={t('fractals.instabilities')}>{({ scale }) => <Instabilities scale={scale} dayOfYearIndex={dayOfYearIndex} language={language}/>}</Fractals.Column>
        <Fractals.Column id="ar" title={t('fractals.agony')} align="right" sortBy="ar" small>{({ ar }) => <FormatNumber value={ar}/>}</Fractals.Column>
        {date === today && (
          <Fractals.DynamicColumns id="account" title={t('fractals.completion')} headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
            {(fractal) => (
              <Gw2AccountBodyCells requiredScopes={requiredScopes}>
                {(fractal.isDaily || fractal.isRecommended) ? (
                  <AccountAchievementProgressCell accountId={null as never} type="objective" achievement={achievements.get(fractal.recommended_achievement_id ?? fractal.daily_achievement_id)!}/>
                ) : (
                  <td>
                    <Tip tip={<Trans id="fractals.completion.unavailable"/>}>
                      <Icon icon="info" color="var(--color-text-muted)"/>
                    </Tip>
                  </td>
                )}
              </Gw2AccountBodyCells>
            )}
          </Fractals.DynamicColumns>
        )}
      </Fractals.Table>

      <PageView page="fractal"/>
    </>
  );
}

export const generateMetadata = createMetadata<PageProps>(async ({ searchParams }) => {
  const language = await getLanguage();
  const { tier, date } = await searchParams;
  const t = getTranslate(language);

  return {
    title: t('fractals'),
    url: getCanonicalUrl(getTierOrFallback(Array.isArray(tier) ? tier[0] : tier), Array.isArray(date) ? date[0] : date),
    description: t('fractals.description'),
    keywords: ['fractal', 'Fractals of the Mists', 't1', 't2', 't3', 't4', 'recommended', 'daily', 'challenge', 'today', 'tomorrow', 'weekend', 'agony', 'instability'],
    image: ogImage,
  };
});


const Instabilities = ({ scale, dayOfYearIndex, language }: { scale: number, dayOfYearIndex: number, language: Language }) => {
  const t = getTranslate(language);

  if(scale > 75) {
    return (
      <FlexRow>
        {getInstabilities(scale, dayOfYearIndex).map((instabilityIndex) => instability_details[instabilityIndex]).map((instability) => (
          <Tip key={instability.name.en} tip={instability.name[language]}><img alt={instability.name[language]} src={`https://assets.gw2dat.com/${instability.icon_id}.png`} height={24} width={24} style={{ borderRadius: 2 }}/></Tip>
        ))}
      </FlexRow>
    );
  } else if (scale > 50) {
    return (
      <FlexRow>
        <Tip tip={t('fractals.instabilities.unknown')}><UnknownInstabilityIcon/></Tip>
        <Tip tip={t('fractals.instabilities.unknown')}><UnknownInstabilityIcon/></Tip>
      </FlexRow>
    );
  } else if (scale > 25) {
    return (
      <FlexRow>
        <Tip tip={t('fractals.instabilities.unknown')}><UnknownInstabilityIcon/></Tip>
      </FlexRow>
    );
  }

  return null;
};

const UnknownInstabilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24">
    <path fill="currentColor" d="M12.12 15.495a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Z"/>
    <path stroke="currentColor" strokeLinecap="round" d="M11.5 13.5c0-1.5 2-2.5 2-4a2 2 0 1 0-4 0"/>
    <path stroke="currentColor" d="m1.06 10.44 9.38-9.38a1.5 1.5 0 0 1 2.12 0l9.38 9.38a1.5 1.5 0 0 1 0 2.12l-9.38 9.38a1.5 1.5 0 0 1-2.12 0l-9.38-9.38a1.5 1.5 0 0 1 0-2.12Z"/>
  </svg>
);
