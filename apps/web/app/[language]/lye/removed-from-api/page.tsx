import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { FormatDate } from '@/components/Format/FormatDate';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { PageLayout } from '@/components/Layout/PageLayout';
import { SkillLink } from '@/components/Skill/SkillLink';
import { SkinLink } from '@/components/Skin/SkinLink';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';

const after = new Date('2023-01-01T00:00:00.000Z');
const afterAchievements = new Date('2024-03-28T00:00:00.000Z');

export default async function LyeRemovedFromApi() {
  const [removedItems, removedAchievements, items, skins, achievements, skills] = await Promise.all([
    db.item.count({ where: { removedFromApi: true }}),
    db.achievement.count({ where: { removedFromApi: true }}),
    db.item.findMany({
      where: { removedFromApi: true, createdAt: { gte: after }},
      select: {
        ...linkProperties,
        createdAt: true,
        current_en: { select: { createdAt: true }},
      }
    }),
    db.skin.findMany({
      where: { removedFromApi: true, createdAt: { gte: after }},
      select: {
        ...linkProperties,
        createdAt: true,
        current_en: { select: { createdAt: true }},
      }
    }),
    db.achievement.findMany({
      where: { removedFromApi: true, createdAt: { gte: afterAchievements }},
      select: {
        ...linkPropertiesWithoutRarity,
        createdAt: true,
        current_en: { select: { createdAt: true }},
      }
    }),
    db.skill.findMany({
      where: { removedFromApi: true, createdAt: { gte: after }},
      select: {
        ...linkPropertiesWithoutRarity,
        createdAt: true,
        current_en: { select: { createdAt: true }},
      }
    })
  ]);

  const Items = createDataTable(items, (item) => item.id);
  const Skins = createDataTable(skins, (skin) => skin.id);
  const Achievements = createDataTable(achievements, (achievement) => achievement.id);
  const Skills = createDataTable(skills, (skill) => skill.id);

  return (
    <PageLayout>
      <p>This page shows items, skins, achievements and skills that were added to the API recently but disappeared again. There are way more items (currently <FormatNumber value={removedItems}/>) and achievements (currently <FormatNumber value={removedAchievements}/>) missing that were added earlier (mostly caused by the whitelist wipe in 2014).</p>

      <Headline id="items" actions={(
        <>
          <LinkButton icon="external" href={`https://api.guildwars2.com/v2/items?lang=en&v=latest&ids=${items.slice(0, 200).map((item) => item.id).join(',')}`} external target="_blank">Open in API</LinkButton>
          <CopyButton icon="copy" copy={items.map((item) => item.id).join(',')}>Copy IDs</CopyButton>
        </>
      )}
      >
        Removed items ({items.length})
      </Headline>

      <p>These items added to the API after <FormatDate date={after}/> are currently not available.</p>

      <Items.Table>
        <Items.Column id="id" title={<Trans id="itemTable.column.id"/>} fixed small align="right">{({ id }) => id}</Items.Column>
        <Items.Column id="item" title={<Trans id="itemTable.column.item"/>} fixed>{(item) => <ItemLink item={item}/>}</Items.Column>
        <Items.Column id="createdAt" title="Added at" fixed small>{({ createdAt }) => <FormatDate date={createdAt}/>}</Items.Column>
        <Items.Column id="removedAt" title="Removed at" fixed small>{({ current_en }) => <FormatDate date={current_en.createdAt}/>}</Items.Column>
      </Items.Table>


      <Headline id="skins" actions={(
        <>
          <LinkButton icon="external" href={`https://api.guildwars2.com/v2/skins?lang=en&v=latest&ids=${skins.slice(0, 200).map((skin) => skin.id).join(',')}`} external target="_blank">Open in API</LinkButton>
          <CopyButton icon="copy" copy={skins.map((skin) => skin.id).join(',')}>Copy IDs</CopyButton>
        </>
      )}
      >
        Removed skins ({skins.length})
      </Headline>

      <p>These skins added to the API after <FormatDate date={after}/> are currently not available.</p>

      <Skins.Table>
        <Skins.Column id="id" title="ID" fixed small align="right">{({ id }) => id}</Skins.Column>
        <Skins.Column id="skin" title="Skin" fixed>{(skin) => <SkinLink skin={skin}/>}</Skins.Column>
        <Skins.Column id="createdAt" title="Added at" fixed small>{({ createdAt }) => <FormatDate date={createdAt}/>}</Skins.Column>
        <Skins.Column id="removedAt" title="Removed at" fixed small>{({ current_en }) => <FormatDate date={current_en.createdAt}/>}</Skins.Column>
      </Skins.Table>


      <Headline id="achievements" actions={(
        <>
          <LinkButton icon="external" href={`https://api.guildwars2.com/v2/achievements?lang=en&v=latest&ids=${achievements.slice(0, 200).map((item) => item.id).join(',')}`} external target="_blank">Open in API</LinkButton>
          <CopyButton icon="copy" copy={achievements.map((skill) => skill.id).join(',')}>Copy IDs</CopyButton>
        </>
      )}
      >
        Removed achievements ({achievements.length})
      </Headline>

      <p>These achievements added to the API after <FormatDate date={afterAchievements}/> are currently not available.</p>

      <Achievements.Table>
        <Achievements.Column id="id" title="ID" fixed small align="right">{({ id }) => id}</Achievements.Column>
        <Achievements.Column id="achievement" title="Achievement" fixed>{(achievement) => <AchievementLink achievement={achievement}/>}</Achievements.Column>
        <Achievements.Column id="createdAt" title="Added at" fixed small>{({ createdAt }) => <FormatDate date={createdAt}/>}</Achievements.Column>
        <Achievements.Column id="removedAt" title="Removed at" fixed small>{({ current_en }) => <FormatDate date={current_en.createdAt}/>}</Achievements.Column>
      </Achievements.Table>


      <Headline id="skills" actions={(
        <>
          <LinkButton icon="external" href={`https://api.guildwars2.com/v2/skills?lang=en&v=latest&ids=${skills.slice(0, 200).map((item) => item.id).join(',')}`} external target="_blank">Open in API</LinkButton>
          <CopyButton icon="copy" copy={skills.map((skill) => skill.id).join(',')}>Copy IDs</CopyButton>
        </>
      )}
      >
        Removed skills ({skills.length})
      </Headline>

      <p>These skills added to the API after <FormatDate date={after}/> are currently not available.</p>

      <Skills.Table>
        <Skills.Column id="id" title="ID" fixed small align="right">{({ id }) => id}</Skills.Column>
        <Skills.Column id="skill" title="Skill" fixed>{(skill) => <SkillLink skill={skill}/>}</Skills.Column>
        <Skills.Column id="createdAt" title="Added at" fixed small>{({ createdAt }) => <FormatDate date={createdAt}/>}</Skills.Column>
        <Skills.Column id="removedAt" title="Removed at" fixed small>{({ current_en }) => <FormatDate date={current_en.createdAt}/>}</Skills.Column>
      </Skills.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Removed From API',
  robots: { index: false },
};

