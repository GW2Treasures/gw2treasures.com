import { Trans } from '@/components/I18n/Trans';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { db } from '@/lib/prisma';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { cache } from '@/lib/cache';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { AccountHomesteadDecorationCell, requiredScopes } from '../homestead.client';
import { PageView } from '@/components/PageView/PageView';
import { EntityIconMissing } from '@/components/Entity/EntityIconMissing';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { localizedName } from '@/lib/localizedName';
import { Description } from '@/components/Layout/Description';
import type { PageProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Scope } from '@gw2me/client';
import { format, strip } from 'gw2-tooltip-html';
import { createSearchIndex, TableFilterButton, TableFilterProvider, TableFilterRow, TableSearchInput } from '@/components/Table/TableFilter';
import { createMetadata } from '@/lib/metadata';

const getDecorations = cache(
  () => db.homesteadDecoration.findMany({
    include: {
      icon: true,
      categories: true,
    }
  }),
  ['homestead-decorations'], { revalidate: 60 }
);

const getDecorationCategories = cache(
  () => db.homesteadDecorationCategory.findMany(),
  ['homestead-decoration-categories'], { revalidate: 60 }
);

export default async function HomesteadDecorationsPage({ params }: PageProps) {
  const { language } = await params;
  const [decorations, decorationCategories] = await Promise.all([
    getDecorations(),
    getDecorationCategories(),
  ]);

  const Decorations = createDataTable(decorations, ({ id }) => id);

  const decorationFilter = decorationCategories.map((category) => ({
    id: category.id,
    name: localizedName(category, language),
    rowIndexes: decorations.map(({ categoryIds }, index) => [categoryIds, index] as const)
      .filter(([ categoryIds ]) => categoryIds.includes(category.id))
      .map(([, index]) => index)
  }));

  const decorationSearchIndex = createSearchIndex(decorations, (decoration) => strip(decoration[`name_${language}`]));

  return (
    <>
      <TableFilterProvider filter={decorationFilter} searchIndex={decorationSearchIndex}>
        <Gw2Accounts requiredScopes={[Scope.GW2_Progression, Scope.GW2_Unlocks]} authorizationMessage="Authorize gw2treasures.com to view your homestead progression." loading={null}/>

        <Description actions={[
          <TableSearchInput key="search"/>,
          <TableFilterButton key="filter" totalCount={decorations.length}/>,
          <ColumnSelect key="columns" table={Decorations}/>,
        ]}
        >
          <Trans id="homestead.decorations.description"/>
        </Description>

        <Decorations.Table rowFilter={TableFilterRow}>
          <Decorations.Column id="id" title="Id" align="right" small hidden>{({ id }) => id}</Decorations.Column>
          <Decorations.Column id="name" title="Decoration" sortBy={(decoration) => decoration[`name_${language}`]}>
            {({ icon, ...decoration }) => (
              <FlexRow>{icon ? <EntityIcon icon={icon} size={32}/> : <EntityIconMissing size={32}/>} <span dangerouslySetInnerHTML={{ __html: format(decoration[`name_${language}`]) }}/></FlexRow>
            )}
          </Decorations.Column>
          <Decorations.Column id="categories" title="Categories">
            {({ categories }) => categories.map((category) => localizedName(category, language)).join(', ')}
          </Decorations.Column>
          <Decorations.Column id="maxCount" title="Max Count" sortBy="maxCount" align="right">{({ maxCount }) => <FormatNumber value={maxCount}/>}</Decorations.Column>
          <Decorations.DynamicColumns id="account-count" title="Account Count" headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
            {({ id }) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><AccountHomesteadDecorationCell decorationId={id} accountId={undefined as never}/></Gw2AccountBodyCells>}
          </Decorations.DynamicColumns>
        </Decorations.Table>
      </TableFilterProvider>

      <PageView page="homestead/decorations"/>
    </>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('homestead.decorations'),
    description: t('homestead.decorations.description'),
  };
});
