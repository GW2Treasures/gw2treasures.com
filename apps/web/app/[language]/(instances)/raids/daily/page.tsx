import { Trans } from '@/components/I18n/Trans';
import { Badge } from '@/components/Badge/Badge';
import { Description } from '@/components/Layout/Description';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import { createMetadata } from '@/lib/metadata';
import { pageView } from '@/lib/pageView';
import { getLanguage, getTranslate } from '@/lib/translate';
import { getDayOfYearIndex } from '@gw2treasures/static-data/fractals/index';
import { getDailySet } from '@gw2treasures/static-data/raids/daily';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { formatDate, getDateOrFallback } from '../../fractals/helper';
import og from '../og.png';
import { DateSelector } from './date-selector';
import { FormatDay } from './format-day';
import { getCanonicalUrl, getCurrentAndNextWeek } from './helper';
import styles from './page.module.css';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';

export default async function RaidDailyPage({ searchParams }: PageProps<'/[language]/raids/daily'>) {
  const { date: rawDate } = await searchParams;
  await pageView('/raids/daily');

  const date = getDateOrFallback(Array.isArray(rawDate) ? rawDate[0] : rawDate);
  const today = formatDate(new Date());
  const parsedDate = new Date(date);

  const days = getCurrentAndNextWeek(parsedDate).map((day) => ({
    ...day,
    key: formatDate(day.date),
    bosses: getDailySet(getDayOfYearIndex(day.date)),
  }));

  return (
    <>
      <Description actions={<span style={{ lineHeight: '36px' }}><Trans id="reset"/> <ResetTimer reset="current-daily"/></span>}>
        <Trans id="raids.daily.description"/>
      </Description>

      <div className={styles.bar}>
        <LinkButton href="/raids" icon="chevron-left"><Trans id="raids.overview"/></LinkButton>
        <label className={styles.dateLabel}>
          <Trans id="fractals.date"/>:
          <DateSelector date={parsedDate}/>
        </label>
      </div>

      <Table>
        <thead>
          <tr>
            <Table.HeaderCell colSpan={2}><Trans id="fractals.date"/></Table.HeaderCell>
            <Table.HeaderCell colSpan={4}><Trans id="raids.daily.bosses"/></Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {days.map(({ key, date: day, bosses, isNextWeek }) => (
            <tr key={key} className={[key === date && styles.current, isNextWeek && styles.nextWeek].filter(Boolean).join(' ') || undefined}>
              <td className={styles.weekday}><FormatDay date={day} part="weekday"/></td>
              <td className={styles.date}><FormatDay date={day} part="date"/>{key === today && <> <Badge><Trans id="raids.daily.today"/></Badge></>}</td>
              {bosses.map((raidId) => (
                <td key={raidId}><Trans id={`raids.encounter.${raidId}`}/></td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export const generateMetadata = createMetadata<PageProps<'/[language]/raids/daily'>>(async ({ searchParams }) => {
  const language = await getLanguage();
  const { date } = await searchParams;
  const t = getTranslate(language);

  return {
    title: t('raids.daily'),
    description: t('raids.daily.description'),
    keywords: ['raid', 'daily', 'bounty', 'bounties', 'schedule', 'calendar', 'tomorrow', 'week'],
    image: og,
    url: getCanonicalUrl(Array.isArray(date) ? date[0] : date),
  };
});
