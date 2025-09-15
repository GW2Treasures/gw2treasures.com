import type { Revision } from '@gw2treasures/database';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import { FormatDate } from '../Format/FormatDate';
import { RevisionTableHiddenRows } from './table.client';
import { Trans } from '../I18n/Trans';
import { getLanguage, translate } from '@/lib/translate';


export interface RevisionTableProps {
  revisions: Pick<Revision, 'id' | 'type' | 'buildId' | 'hash' | 'description' | 'createdAt'>[],
  currentRevisionId: string,
  fixedRevision?: boolean,
  link: ({ revisionId, children }: { revisionId: string, children: ReactNode }) => ReactNode,
  diff?: ({ revisionIdA, revisionIdB, children }: { revisionIdA: string, revisionIdB: string, children: ReactNode }) => ReactNode,
}

export const RevisionTable: FC<RevisionTableProps> = async ({ revisions, currentRevisionId, fixedRevision, link, diff }) => {
  const language = await getLanguage();

  const hiddenIndexes = new Set<number>();

  // iterate through all revisions and find indexes to hide
  for(const [i, revision] of revisions.entries()) {
    const earlierRevision = revisions[i + 1];

    if(
      // there has to be an earlier revision…
      earlierRevision &&
      // …that is a removal (so the current is a rediscovery)…
      revision.type === 'Update' && earlierRevision.type === 'Removed' &&
      // …the hash has to match (and not be empty)…
      revision.hash === earlierRevision.hash && revision.hash !== '' &&
      // …and the user is not viewing any of these revisions…
      revision.id !== currentRevisionId && earlierRevision.id !== currentRevisionId
    ) {
      // …then hide them both
      hiddenIndexes.add(i);
      hiddenIndexes.add(i + 1);
    }
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small><Trans id="revisions.build"/></Table.HeaderCell>
            <Table.HeaderCell><Trans id="revisions.description"/></Table.HeaderCell>
            <Table.HeaderCell small><Trans id="revisions.date"/></Table.HeaderCell>
            <Table.HeaderCell small><Trans id="actions"/></Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <RevisionTableHiddenRows hiddenIndexes={Array.from(hiddenIndexes)} label={translate('revisions.showHidden', language)}>
            {revisions.map((revision) => (
              <tr key={revision.id}>
                <td>{revision.buildId !== 0 ? (<Link href={`/build/${revision.buildId}`}>{revision.buildId}</Link>) : '-'}</td>
                <td style={{ fontWeight: fixedRevision && currentRevisionId === revision.id ? 500 : undefined }}>
                  {link({ revisionId: revision.id, children: revision.description })}
                </td>
                <td><FormatDate date={revision.createdAt} relative/></td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {(!fixedRevision || currentRevisionId !== revision.id) && link({ revisionId: revision.id, children: <Trans id="revisions.view"/> })}
                  {diff && currentRevisionId && currentRevisionId !== revision.id && (
                    <>
                      {' · '}{diff({ revisionIdA: revision.id, revisionIdB: currentRevisionId, children: <Trans id="revisions.diff"/> })}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </RevisionTableHiddenRows>
        </tbody>
      </Table>
    </>
  );
};
