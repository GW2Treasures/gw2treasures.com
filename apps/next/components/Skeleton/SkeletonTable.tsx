/* eslint-disable react/no-array-index-key */
import { FC, ReactNode } from 'react';
import { Table } from '../Table/Table';
import { Skeleton } from './Skeleton';

interface SkeletonTableProps {
  columns: ReactNode[];
  rows?: number;
};

export const SkeletonTable: FC<SkeletonTableProps> = ({ columns, rows = 3 }) => {
  return (
    <Table>
      <thead>
        <tr>
          {columns.map((col, i) => (<th key={i}>{col}</th>))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows).keys()].map((row) => (
          <tr key={row}>
            {columns.map((_, i) => (<td key={i}>{i === 0 && <Skeleton/>}</td>))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
