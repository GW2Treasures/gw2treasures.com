import { FormatNumber } from '@/components/Format/FormatNumber';
import { PageLayout } from '@/components/Layout/PageLayout';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';

const getDbStats = cache(() => {
  return Promise.all([
    db.$queryRaw<{ table_name: string, size: bigint, size_index: bigint, size_total: bigint, rows: number }[]>`
      SELECT
        relname AS table_name,
        pg_table_size(c.oid) as size,
        pg_indexes_size(c.oid) AS size_index,
        pg_total_relation_size(c.oid) AS size_total,
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

  const DbStats = createDataTable(stats, (row) => row.table_name);

  return (
    <PageLayout>
      <Headline id="db">Database</Headline>
      <p>Total Size: {total[0].size}.</p>
      <DbStats.Table>
        <DbStats.Column id="table" render={({ table_name }) => table_name}>
          Table
        </DbStats.Column>
        <DbStats.Column id="rows" align="right"
          render={({ rows }) => rows === -1 ? <span style={{ color: 'var(--color-text-muted' }}>?</span> : <FormatNumber value={rows}/>}
          sort={(a, b) => a.rows - b.rows}
        >
          Row Estimate
        </DbStats.Column>
        <DbStats.Column id="data" align="right" render={({ size }) => formatSize(size)} sort={(a, b) => compare(a.size, b.size)}>
          Size (Data)
        </DbStats.Column>
        <DbStats.Column id="index" align="right" render={({ size_index }) => formatSize(size_index)} sort={(a, b) => compare(a.size_index, b.size_index)}>
          Size (Index)
        </DbStats.Column>
        <DbStats.Column id="total" align="right" render={({ size_total }) => formatSize(size_total)} sort={(a, b) => compare(a.size_total, b.size_total)}>
          Total Size
        </DbStats.Column>
      </DbStats.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Database Stats'
};

function compare(a: bigint, b: bigint) {
  return (a < b ? -1 : a > b ? 1 : 0);
}

function formatSize(size: bigint): string {
  const units = ['bytes', 'kB', 'MB', 'GB', 'TB'];

  while(size > 8192) {
    size /= BigInt(1024);
    units.shift();
  }

  return size.toString() + ' ' + units[0];
}
