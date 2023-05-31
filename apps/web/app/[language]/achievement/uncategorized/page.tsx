import { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import { ItemList } from '@/components/ItemList/ItemList';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { remember } from '@/lib/remember';

export const dynamic = 'force-dynamic';

const getUncategorizedAchievements = remember(60, async function getData(language: Language) {
  const achievements = await db.achievement.findMany({
    where: { achievementCategoryId: null },
    include: { icon: true }
  });

  return { achievements };
});

async function AchievementUncategorizedPage({ params: { language }}: { params: { language: Language }}) {
  const { achievements } = await getUncategorizedAchievements(language);

  return (
    <DetailLayout
      title="Uncategorized Achievements"
      breadcrumb="Achievements"
    >
      <Headline id="achievements">Achievements</Headline>
      <ItemList>
        {achievements.map((achievement) => (
          <li key={achievement.id}><AchievementLink achievement={achievement}/></li>
        ))}
      </ItemList>
    </DetailLayout>
  );
};

export default AchievementUncategorizedPage;

export const metadata = {
  title: 'Uncategorized Achievements'
};
