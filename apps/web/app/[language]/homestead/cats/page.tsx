/* eslint-disable @next/next/no-img-element */
import { Trans } from '@/components/I18n/Trans';
import homeCats from '@gw2efficiency/game-data/home/cats';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { parseIcon } from '@/lib/parseIcon';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import type { FC } from 'react';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { AccountHomeCatCell, requiredScopes } from '../homestead.client';
import { PageView } from '@/components/PageView/PageView';
import { Description } from '@/components/Layout/Description';

export default function HomesteadCatsPage() {
  const HomeCats = createDataTable(homeCats, ({ id }) => id);

  return (
    <>
      <Description actions={<ColumnSelect table={HomeCats}/>}>
        <Trans id="homestead.cats.description"/>
      </Description>

      <HomeCats.Table>
        <HomeCats.Column id="id" title="Id" align="right" small hidden>{({ id }) => id}</HomeCats.Column>
        <HomeCats.Column id="name" title="Cat" sortBy="name">{({ name, icon }) => <FlexRow><MaybeRenderIcon src={icon}/> {name}</FlexRow>}</HomeCats.Column>
        <HomeCats.Column id="desc" title="Description" sortBy="description">{({ description }) => <CatDescription description={description}/>}</HomeCats.Column>
        <HomeCats.DynamicColumns headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
          {({ id }) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><AccountHomeCatCell catId={id} accountId={undefined as never}/></Gw2AccountBodyCells>}
        </HomeCats.DynamicColumns>
      </HomeCats.Table>

      <PageView page="homestead/cats"/>
    </>
  );
}

export const metadata = {
  title: 'Homestead Cats'
};

const MaybeRenderIcon: FC<{ src: string }> = ({ src }) => {
  const icon = parseIcon(src);

  return icon
    ? (<EntityIcon icon={icon} size={32}/>)
    : (<img src={src} width={32} height={32} alt="" style={{ borderRadius: 2 }}/>);
};


const CatDescription: FC<{ description: string }> = ({ description }) => {
  const cleaned = description
    // remove <strong> and </strong> from the description
    .replaceAll(/<\/?strong>/g, '')
    // remove &nbsp; and &thinsp; from description
    .replaceAll(/(\u00A0|\u2009)+/g, ' ');

  return (
    <p style={{ color: 'var(--color-text-muted' }}>{cleaned}</p>
  );
};