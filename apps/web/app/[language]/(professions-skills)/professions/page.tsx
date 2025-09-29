import { ItemList } from '@/components/ItemList/ItemList';
import { EntityLink } from '@/components/Link/EntityLink';
import { PageView } from '@/components/PageView/PageView';
import { cache } from '@/lib/cache';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { compareLocalizedName } from '@/lib/localizedName';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import ogImage from './og.png';

const getProfessions = cache(() => {
  return db.profession.findMany({ select: linkPropertiesWithoutRarity });
}, ['get-professions'], { revalidate: 60 * 60 });

export default async function ProfessionPage() {
  const language = await getLanguage();
  const professions = (await getProfessions()).toSorted(compareLocalizedName(language));

  return (
    <>
      <ItemList>
        {professions.map((profession) => <li key={profession.id}><EntityLink entity={profession} href={`/professions/${profession.id}`}/></li>)}
        <PageView page="professions"/>
      </ItemList>
    </>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('navigation.professions'),
    image: ogImage,
    url: '/professions'
  };
});
