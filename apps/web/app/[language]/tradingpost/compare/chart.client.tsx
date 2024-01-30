'use client';

import { Coins } from '@/components/Format/Coins';
import { getIconUrl } from '@/lib/getIconUrl';
import type { TradingPostHistory } from '@gw2treasures/database';
import { AxisBottom, AxisLeft, type TickRendererProps } from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar, Circle, Line, LinePath } from '@visx/shape';
import { Tooltip, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { bisector } from 'd3-array';
import type { FC, MouseEvent, TouchEvent } from 'react';
import tipStyles from '@gw2treasures/ui/components/Tip/Tip.module.css';
import { FormatDate } from '@/components/Format/FormatDate';
import { ItemLink, type ItemLinkProps } from '@/components/Item/ItemLink';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { colorPalette } from './colors';

export interface ChartProps {
  data: TradingPostHistory[],
  items: ItemLinkProps['item'][],
}

const bisectDate = bisector<TradingPostHistory, Date>((d) => d.time).left;

export const Chart: FC<ChartProps> = (props) => {
  return (<ParentSize ignoreDimensions={['top', 'left']} style={{ position: 'absolute', inset: 0 }}>{({ width, height }) => <ChartInternal width={width} height={height} {...props}/>}</ParentSize>);
};

const ChartInternal: FC<ChartProps & { width: number, height: number }> = ({ data, items, width, height }) => {
  const margin = { top: 0, bottom: 40, left: 0, right: 0 };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // const historyByItem = data.reduce<Record<number, TradingPostHistory[]>>((map, entry) => ({ ...map, [entry.itemId]: [...(map[entry.itemId] ?? []), entry] }), {});
  let historyByItem: Record<number, TradingPostHistory[]> = {};
  let maxPrice: number = 0;

  for(const entry of data) {
    historyByItem[entry.itemId] = [...(historyByItem[entry.itemId] ?? []), entry];
    maxPrice = Math.max(maxPrice, entry.sellPrice ?? 0, entry.buyPrice ?? 0);
  }

  const minDate = data[0].time;
  const maxDate = data[data.length - 1].time;

  const priceScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, maxPrice],
    nice: true,
  });

  const timeScale = scaleTime({
    range: [0, xMax],
    round: true,
    domain: [minDate, maxDate],
  });
  const x = (d: TradingPostHistory) => timeScale(d.time);

  // tooltip
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<{ itemId: number, entry: TradingPostHistory }[]>();

  // tooltip event handler
  const handleTooltip = (event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>) => {
    const { x, y } = localPoint(event) || { x: 0, y: 0 };
    const x0 = timeScale.invert(x - margin.left);
    const tooltipData: { itemId: number, entry: TradingPostHistory }[] = [];

    for(const item of items) {
      const index = bisectDate(historyByItem[item.id], x0, 1);
      const d0 = historyByItem[item.id][index - 1];
      const d1 = historyByItem[item.id][index];
      let d = d0;
      if (d1) {
        d = x0.valueOf() - d0.time.valueOf() > d1.time.valueOf() - x0.valueOf() ? d1 : d0;
      }
      tooltipData.push({ itemId: item.id, entry: d });
    }

    showTooltip({
      tooltipData,
      tooltipLeft: x,
      tooltipTop: y,
    });
  };

  return (
    <>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={priceScale} width={xMax} height={yMax} numTicks={6} stroke="var(--color-border)"/>
          <AxisLeft scale={priceScale} stroke="var(--color-border-dark)" tickStroke="var(--color-border-dark)" tickComponent={renderGoldTick} tickFormat={(v) => v.toString()} numTicks={6} hideAxisLine hideZero hideTicks/>
          <AxisBottom scale={timeScale} top={yMax} stroke="var(--color-border-dark)" tickStroke="var(--color-border-dark)" tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }} numTicks={7} tickValues={timeScale.ticks(5).slice(1)}/>

          {items.map((item, index) => (
            <LinePath key={item.id} data={historyByItem[item.id]} y={(d) => priceScale(d.sellPrice ?? 0)} defined={(d) => d.sellPrice !== null} x={(d) => timeScale(d.time)} curve={curveMonotoneX} strokeWidth={2} stroke={colorPalette[index % colorPalette.length]} strokeLinejoin="round" strokeLinecap="round"/>
          ))}
        </Group>

        {tooltipOpen && tooltipData && tooltipLeft && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: yMax + margin.top }}
              stroke="var(--color-border-dark)"
              strokeWidth={1}
              pointerEvents="none"
              strokeDasharray="4 2"/>
            {tooltipData.map(({ itemId, entry }, index) => (
              <Circle
                key={itemId}
                cx={x(entry) + margin.left}
                cy={priceScale(entry.sellPrice ?? 0) + margin.top}
                r={4}
                fill={colorPalette[index % 5]}
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
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={yMax + margin.top - 4}
            left={(tooltipLeft ?? 0) + 8}
            applyPositionStyle
            className={tipStyles.tip}
            style={{ textAlign: 'center', transform: 'translateX(-50%)', minWidth: 72 }}
          >
            <FormatDate date={tooltipData?.[0].entry.time}/>
          </Tooltip>
          <TooltipWithBounds
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={tooltipTop}
            left={(tooltipLeft ?? 0)}
            offsetLeft={16}
            className={tipStyles.tip}
            unstyled
            applyPositionStyle
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {tooltipData.map(({ entry }, index) => (
                <div key={entry.itemId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colorPalette[index % colorPalette.length], display: 'inline-block', marginRight: 8 }}/>
                    <ItemLink item={items[index]} icon={16}/>
                  </div>
                  <div style={{ marginLeft: 16, fontFeatureSettings: '"tnum" 1' }}>
                    <Coins value={entry.sellPrice ?? 0}/>
                  </div>
                </div>
              ))}
            </div>
          </TooltipWithBounds>
        </>
      )}
    </>
  );
};

function renderGoldTick(props: TickRendererProps) {
  return (
    <svg style={{ overflow: 'visible', fontFeatureSettings: '"tnum" 1' }} x="0" y="0" fontSize={12} fontFamily="var(--font-wotfard)">
      <foreignObject x={props.x + 16} y={props.y + 8} width={60} height="1em">
        <Coins value={Number(props.formattedValue)}/>
      </foreignObject>
    </svg>
  );
}
