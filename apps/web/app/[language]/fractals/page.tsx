/* eslint-disable @next/next/no-img-element */
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import data from './fractals.json';
import { Trans } from '@/components/I18n/Trans';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { getCanonicalUrl, getDateOrFallback, getDayOfYearIndex, getInstabilities, getTierOrFallback } from './helper';
import { isTruthy } from '@gw2treasures/helper/is';
import { DateSelector } from './date-selector';
import { getAlternateUrls } from '@/lib/url';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { getTranslate } from '@/lib/translate';
import { PageView } from '@/components/PageView/PageView';
import { Switch } from '@gw2treasures/ui/components/Form/Switch';
import type { PageProps } from '@/lib/next';
import type { Language } from '@gw2treasures/database';


export default async function FractalsPage({ params, searchParams }: PageProps) {
  const { language } = await params;
  const { tier: rawTier, date: rawDate } = await searchParams;
  const { fractals, daily, recommended } = data;

  const date = getDateOrFallback(Array.isArray(rawDate) ? rawDate[0] : rawDate);
  const parsedDate = new Date(date);
  const tier = getTierOrFallback(Array.isArray(rawTier) ? rawTier[0] : rawTier);

  const dayOfYearIndex = getDayOfYearIndex(parsedDate);
  const currentDaily = dayOfYearIndex % 15;

  const foo = fractals.toReversed()
    .map((fractal) => ({
      ...fractal,
      tier: Math.floor((fractal.level - 1) / 25) + 1,
      isDaily: daily[currentDaily].includes(fractal.type),
      isRecommended: recommended[currentDaily].includes(fractal.level)
    }))
    .filter((fractal) => tier === 'all' || (fractal.isDaily && fractal.tier.toString() === tier) || (fractal.isRecommended && fractal.tier.toString() <= tier));


  const Fractals = createDataTable(foo, ({ level }) => level);

  const t = getTranslate(language);

  return (
    <HeroLayout hero={<Headline id="fractals"><Trans id="fractals"/></Headline>}>
      <div style={{ marginTop: -16, marginBottom: 16, marginInline: -16, padding: 16, background: 'var(--color-background-light)', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Trans id="fractals.daily"/>:
          <Switch>
            <Switch.Control type="link" replace active={tier === '4'} href={getCanonicalUrl('4', date)}>T4</Switch.Control>
            <Switch.Control type="link" replace active={tier === '3'} href={getCanonicalUrl('3', date)}>T3</Switch.Control>
            <Switch.Control type="link" replace active={tier === '2'} href={getCanonicalUrl('2', date)}>T2</Switch.Control>
            <Switch.Control type="link" replace active={tier === '1'} href={getCanonicalUrl('1', date)}>T1</Switch.Control>
            <Switch.Control type="link" replace active={tier === 'all'} href={getCanonicalUrl('all', date)}><Trans id="fractals.tier.all"/></Switch.Control>
          </Switch>
        </label>
        <label style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Trans id="fractals.date"/>:
          <DateSelector date={parsedDate} tier={tier}/>
        </label>
      </div>
      <Fractals.Table>
        <Fractals.Column id="tier" title={t('fractals.tier')} sortBy="level" small>{({ tier }) => `T${tier}`}</Fractals.Column>
        <Fractals.Column id="level" title={t('fractals.level')} align="right" sortBy="level" small>{({ level }) => <FormatNumber value={level}/>}</Fractals.Column>
        <Fractals.Column id="name" title={t('fractal')} sortBy="type">{({ type }) => <Trans id={`fractal.${type as 'lonely_tower'}`}/>}</Fractals.Column>
        <Fractals.Column id="daily" title={t('fractals.daily')} sortBy={({ isDaily, isRecommended }) => isDaily ? 1 : isRecommended ? 2 : 3}>{({ isDaily, isRecommended }) => [isDaily && t('fractals.daily'), isRecommended && t('fractals.recommended')].filter(isTruthy).join(', ')}</Fractals.Column>
        <Fractals.Column id="instabilities" title={t('fractals.instabilities')}>{({ level }) => <Instabilities level={level} dayOfYearIndex={dayOfYearIndex} language={language}/>}</Fractals.Column>
        <Fractals.Column id="ar" title={t('fractals.agony')} align="right" sortBy="ar" small>{({ ar }) => <FormatNumber value={ar}/>}</Fractals.Column>
      </Fractals.Table>

      <PageView page="fractal"/>
    </HeroLayout>
  );
}

export async function generateMetadata({ searchParams, params }: PageProps) {
  const { language } = await params;
  const { tier, date } = await searchParams;
  const t = getTranslate(language);

  return {
    title: t('fractals'),
    alternates: getAlternateUrls(getCanonicalUrl(getTierOrFallback(Array.isArray(tier) ? tier[0] : tier), Array.isArray(date) ? date[0] : date), language),
  };
}

const Instabilities = ({ level, dayOfYearIndex, language }: { level: number, dayOfYearIndex: number, language: Language }) => {
  const { instabilities } = data;
  const t = getTranslate(language);

  if(level > 75) {
    return (
      <FlexRow>
        {getInstabilities(level, dayOfYearIndex).map((instabilityIndex) => instabilities[instabilityIndex]).map((instability) => (
          <Tip key={instability.name} tip={instability.name}><img alt={instability.name} src={`https://assets.gw2dat.com/${instability.iconId}.png`} height={24} width={24} style={{ borderRadius: 2 }}/></Tip>
        ))}
      </FlexRow>
    );
  } else if (level > 50) {
    return (
      <FlexRow>
        <Tip tip={t('fractals.instabilities.unknown')}><UnknownInstabilityIcon/></Tip>
        <Tip tip={t('fractals.instabilities.unknown')}><UnknownInstabilityIcon/></Tip>
      </FlexRow>
    );
  } else if (level > 25) {
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
