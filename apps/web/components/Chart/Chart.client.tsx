'use client';

import { AxisLeft, AxisBottom } from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaClosed, Bar, Circle, Line, LinePath } from '@visx/shape';
import { getColor } from './Chart';
import { Fragment, type ComponentClass, type FC, type MouseEvent, type TouchEvent } from 'react';
import { Tooltip, TooltipWithBounds as TooltipWithBoundsReact18, useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';
import { FormatDate } from '../Format/FormatDate';
import tipStyles from '@gw2treasures/ui/components/Tip/Tip.module.css';
import { FormatNumber } from '../Format/FormatNumber';
import type { TooltipWithBoundsProps } from '@visx/tooltip/lib/tooltips/TooltipWithBounds';

// override types of TooltipWithBounds for react@19 compatibility
const TooltipWithBounds = TooltipWithBoundsReact18 as unknown as ComponentClass<TooltipWithBoundsProps>;

type Datum = { time: Date, value: number | null };

const bisectDate = bisector<Datum, Date>((d) => d.time).left;

interface ChartProps {
  lines: [name: string, data: Datum[]][]
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

  // tooltip
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<{ name: string, entry: Datum }[]>();

  // tooltip event handler
  const handleTooltip = (event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>) => {
    const { x, y } = localPoint(event) || { x: 0, y: 0 };
    const x0 = timeScale.invert(x - margin.left);
    const tooltipData: { name: string, entry: Datum }[] = [];

    for(const [name, data] of lines) {
      if(!data.length) {
        continue;
      }

      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1) {
        d = x0.valueOf() - d0.time.valueOf() > d1.time.valueOf() - x0.valueOf() ? d1 : d0;
      }
      tooltipData.push({ name, entry: d });
    }

    showTooltip({
      tooltipData,
      tooltipLeft: x,
      tooltipTop: y,
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={valueScale} width={xMax} height={yMax} numTicks={6} stroke="var(--color-border-dark)" strokeDasharray="4 4"/>
          <AxisLeft scale={valueScale} strokeWidth={0} numTicks={6} tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }}/>
          <AxisBottom scale={timeScale} top={yMax} stroke="var(--color-border)" strokeWidth={2} tickStroke="var(--color-border)" tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }} numTicks={7}/>

          {lines.map(([name, data], index) => (
            <Fragment key={name}>
              <LinePath data={data} y={(d) => valueScale(d.value ?? 0)} x={(d) => timeScale(d.time)} curve={curveMonotoneX} stroke={getColor(index)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
              <AreaClosed data={data} y={(d) => valueScale(d.value ?? 0)} x={(d) => timeScale(d.time)} curve={curveMonotoneX} fill={getColor(index)} fillOpacity={.05} yScale={valueScale}/>
            </Fragment>
          ))}
        </Group>

        {tooltipOpen && tooltipData && tooltipLeft && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: yMax + margin.top }}
              stroke="var(--color-border)"
              strokeWidth={1}
              pointerEvents="none"/>
            {tooltipData.map(({ name, entry }, index) => (
              <Circle
                key={name}
                cx={timeScale(entry.time) + margin.left}
                cy={valueScale(entry.value ?? 0) + margin.top}
                r={4}
                fill={getColor(index)}
                stroke="var(--color-background)"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.12))' }}
                pointerEvents="none"/>
            ))}
          </g>
        )}

        <Bar
          x={margin.left}
          y={margin.top}
          width={xMax}
          height={yMax}
          fill="transparent"
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}/>
      </svg>

      {tooltipOpen && tooltipData && (
        <>
          <Tooltip
            top={yMax + margin.top - 4}
            left={(tooltipLeft ?? 0) + 8}
            applyPositionStyle
            className={tipStyles.tip}
            style={{ textAlign: 'center', transform: 'translateX(-50%)', minWidth: 72 }}
          >
            <FormatDate date={tooltipData?.[0].entry.time}/>
          </Tooltip>
          <TooltipWithBounds
            top={tooltipTop}
            left={(tooltipLeft ?? 0)}
            offsetLeft={16}
            className={tipStyles.tip}
            unstyled
            applyPositionStyle
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tooltipData.map(({ name, entry }, index) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: getColor(index), display: 'inline-block', marginRight: 8 }}/>
                    {name}
                  </div>
                  <div style={{ marginLeft: 16, fontFeatureSettings: '"tnum" 1' }}>
                    <FormatNumber value={entry.value ?? 0}/>
                  </div>
                </div>
              ))}
            </div>
          </TooltipWithBounds>
        </>
      )}
    </div>
  );
};
