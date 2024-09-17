import { lazy, type FC } from 'react';
import { extent, max } from 'd3-array';

export interface ChartProps {
  lines: [name: string, data: { time: Date, value: number }[]][]
}

const colorPalette = [
  '#33A8C7',
  '#9336FD',
  '#52E3E1',
  '#D883FF',
  '#A0E426',
  '#F050AE',
  '#FDF148',
  '#F77976',
  '#FFAB00',
];

export function getColor(index: number) {
  return colorPalette[index % colorPalette.length];
}

export const Chart: FC<ChartProps> = ({ lines }) => {
  const points = lines.flatMap(([, data]) => data);

  const valueDomain = [0, max(points, ({ value }) => value) ?? 0] as [number, number];
  const timeDomain = extent(points, ({ time }) => time) as [Date, Date];

  return (
    <div style={{ flex: 1, height: 300 }}>
      <ClientChart lines={lines} valueDomain={valueDomain} timeDomain={timeDomain}/>
    </div>
  );
};

const ClientChart = lazy(() => import('./Chart.client').then(({ Chart }) => ({ default: Chart })));
