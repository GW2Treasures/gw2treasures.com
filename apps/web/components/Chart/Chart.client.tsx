'use client';

import { AxisLeft, AxisBottom } from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { getColor } from './Chart';
import type { FC } from 'react';

interface ChartProps {
  lines: [name: string, data: { time: Date, value: number }[]][]
  valueDomain: [number, number],
  timeDomain: [Date, Date],
}

export const Chart: FC<ChartProps> = (props) => {
  return (<ParentSize ignoreDimensions={['height', 'top', 'left']} style={{ height: 'auto' }}>{({ width }) => width > 80 && <ChartInternal width={width} {...props}/>}</ParentSize>);
};


const ChartInternal: FC<ChartProps & { width: number }> = ({ lines, valueDomain, timeDomain, width }) => {
  const margin = { top: 20, bottom: 40, left: 60, right: 0 };
  const height = 300;

  const yMax = height - margin.top - margin.bottom;

  const valueScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    nice: true,
    domain: valueDomain,
  });

  margin.left = valueScale.ticks(6).map((value) => valueScale.tickFormat(6)(value).length * 8 + 8).reduce((max, length) => Math.max(max, length), 0);
  const xMax = width - margin.left - margin.right;

  const timeScale = scaleTime({
    range: [0, xMax],
    round: true,
    domain: timeDomain,
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <Group left={margin.left} top={margin.top}>
        <GridRows scale={valueScale} width={xMax} height={yMax} numTicks={6} stroke="var(--color-border-dark)" strokeDasharray="4 4"/>
        <AxisLeft scale={valueScale} strokeWidth={0} numTicks={6} tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }}/>
        <AxisBottom scale={timeScale} top={yMax} stroke="var(--color-border)" strokeWidth={2} tickStroke="var(--color-border)" tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }} numTicks={7}/>

        {lines.map(([name, data], index) => (
          <LinePath key={name} data={data} y={(d) => valueScale(d.value ?? 0)} x={(d) => timeScale(d.time)} curve={curveMonotoneX} stroke={getColor(index)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
        ))}
      </Group>
    </svg>
  );
};
