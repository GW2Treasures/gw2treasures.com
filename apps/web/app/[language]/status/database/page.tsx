import { FormatNumber } from '@/components/Format/FormatNumber';
import { PageLayout } from '@/components/Layout/PageLayout';
import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { unstable_cache } from 'next/cache';

const getDbStats = unstable_cache(() => {
  return Promise.all([
    db.$queryRaw<{ table_name: string, size: string, size_index: string, size_total: string, rows: number }[]>`
      SELECT
        relname AS table_name,
        pg_size_pretty(pg_table_size(c.oid)) as size,
        pg_size_pretty(pg_indexes_size(c.oid)) AS size_index,
        pg_size_pretty(pg_total_relation_size(c.oid)) AS size_total,
        reltuples as rows
      FROM pg_class c
      JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      WHERE relkind = 'r' AND nspname = CURRENT_SCHEMA AND relname NOT LIKE 'User%'
      ORDER BY relname;`,
    db.$queryRaw<[{ size: string }]>`SELECT pg_size_pretty(pg_database_size(current_database())) as size;`
  ]);
}, ['db-stats'], { revalidate: 60 * 60 });

export default async function StatusDatabasePage() {
  const [stats, total] = await getDbStats();

  return (
    <PageLayout>
      <Headline id="db">Database</Headline>
      <p>Total Size: {total[0].size}.</p>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Table</Table.HeaderCell>
            <Table.HeaderCell align="right">Row Estimate</Table.HeaderCell>
            <Table.HeaderCell align="right">Size (Data)</Table.HeaderCell>
            <Table.HeaderCell align="right">Size (Index)</Table.HeaderCell>
            <Table.HeaderCell align="right">Total Size</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {stats.map((row) => (
            <tr key={row.table_name}>
              <td>{row.table_name}</td>
              <td align="right">{row.rows === -1 ? <span style={{ color: 'var(--color-text-muted' }}>?</span> : <FormatNumber value={row.rows}/>}</td>
              <td align="right">{row.size}</td>
              <td align="right">{row.size_index}</td>
              <td align="right">{row.size_total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Database Stats'
};
