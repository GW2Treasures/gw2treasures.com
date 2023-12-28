'use client';

import { Coins } from '@/components/Format/Coins';
import { FormatDate } from '@/components/Format/FormatDate';
import { FormatNumber } from '@/components/Format/FormatNumber';
import type { TradingPostHistory } from '@gw2treasures/database';
import { AxisBottom, AxisLeft, AxisRight, type TickRendererProps } from '@visx/axis';
import { curveLinear } from '@visx/curve';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar, Circle, Line, LinePath } from '@visx/shape';
import { Threshold } from '@visx/threshold';
import { Tooltip, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { bisector, extent } from 'd3-array';
import type { FC, MouseEvent, TouchEvent } from 'react';
import tipStyles from '@gw2treasures/ui/components/Tip/Tip.module.css';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';

export interface TradingPostHistoryClientProps {
  history: TradingPostHistory[]
}

export const TradingPostHistoryClient: FC<TradingPostHistoryClientProps> = (props) => {
  return (<ParentSize ignoreDimensions={['height', 'top', 'left']} style={{ height: 'auto', overflow: 'hidden' }}>{({ width }) => <TradingPostHistoryClientInternal width={width} {...props}/>}</ParentSize>);
};

export interface TradingPostHistoryClientInternalProps extends TradingPostHistoryClientProps {
  width: number;
}

const bisectDate = bisector<TradingPostHistory, Date>((d) => d.time).left;

export const TradingPostHistoryClientInternal: FC<TradingPostHistoryClientInternalProps> = ({ history, width }) => {
  const height = 420;
  const margin = { top: 20, bottom: 40, left: 80, right: 80 };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleTime({
    range: [0, xMax],
    round: true,
    domain: extent(history, ({ time }) => time) as [Date, Date],
  });

  const maxPrice = Math.max(...history.flatMap(({ buyPrice, sellPrice }) => [buyPrice ?? 0, sellPrice ?? 0]));
  const maxQuantity = Math.max(...history.flatMap(({ buyQuantity, sellQuantity }) => [buyQuantity ?? 0, sellQuantity ?? 0]));

  const priceScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, maxPrice],
  });

  const quantityScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, maxQuantity],
  });

  const x = (d: typeof history[0]) => xScale(d.time);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<TradingPostHistory>();

  const handleTooltip = (event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>) => {
    const { x, y } = localPoint(event) || { x: 0, y: 0 };
    const x0 = xScale.invert(x - margin.left);
    const index = bisectDate(history, x0, 1);
    const d0 = history[index - 1];
    const d1 = history[index];
    let d = d0;
    if (d1) {
      d = x0.valueOf() - d0.time.valueOf() > d1.time.valueOf() - x0.valueOf() ? d1 : d0;
    }

    showTooltip({
      tooltipData: d,
      tooltipLeft: x,
      tooltipTop: y,
    });

  };

  return (
    <>
      <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
        <div style={{ borderLeft: '4px solid #1976D2', paddingLeft: 8 }}>
          <div>Sell Price</div>
          <div style={{ fontWeight: 500, marginTop: 8 }}><Coins value={history.at(-1)!.sellPrice!}/></div>
        </div>
        <div style={{ borderLeft: '4px solid #D32F2F', paddingLeft: 8 }}>
          <div>Buy Price</div>
          <div style={{ fontWeight: 500, marginTop: 8 }}><Coins value={history.at(-1)!.buyPrice!}/></div>
        </div>
        <div style={{ borderLeft: '4px dashed #4FC3F7', paddingLeft: 8 }}>
          <div>Sell Listings</div>
          <div style={{ fontWeight: 500, marginTop: 8 }}><FormatNumber value={history.at(-1)!.sellQuantity!}/></div>
        </div>
        <div style={{ borderLeft: '4px dashed #FF9800', paddingLeft: 8 }}>
          <div>Buy Orders</div>
          <div style={{ fontWeight: 500, marginTop: 8 }}><FormatNumber value={history.at(-1)!.buyQuantity!}/></div>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Group left={margin.left} top={margin.top}>
            <GridRows scale={priceScale} width={xMax} height={yMax} numTicks={6} stroke="var(--color-border)"/>
            {/* <GridColumns scale={xScale} width={xMax} height={yMax} numTicks={width >= 1000 ? 10 : 6} stroke="var(--color-border)"/> */}

            <AxisLeft scale={priceScale} stroke="var(--color-border-dark)" tickStroke="var(--color-border-dark)" tickComponent={renderGoldTick} tickFormat={(v) => v.toString()} numTicks={6}/>
            <AxisRight scale={quantityScale} left={xMax} stroke="var(--color-border-dark)" tickStroke="var(--color-border-dark)" tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }} numTicks={6}/>
            <AxisBottom scale={xScale} top={yMax} stroke="var(--color-border-dark)" tickStroke="var(--color-border-dark)" tickLabelProps={{ fill: 'var(--color-text)', fontFamily: 'var(--font-wotfard)', fontSize: 12 }} numTicks={width >= 1000 ? 10 : 6}/>

            <g strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
              <Threshold id="quantity" data={history} x={x} y0={(d) => quantityScale(d.sellQuantity ?? 0)} y1={(d) => quantityScale(d.buyQuantity ?? 0)} clipAboveTo={0} clipBelowTo={yMax} curve={curveLinear} aboveAreaProps={{ fill: '#4FC3F7', fillOpacity: .1 }} belowAreaProps={{ fill: '#FF9800', fillOpacity: .1 }}/>

              <LinePath data={history} y={(d) => quantityScale(d.sellQuantity ?? 0)} x={x} curve={curveLinear} stroke="#4FC3F7" strokeDasharray="4 4"/>
              <LinePath data={history} y={(d) => quantityScale(d.buyQuantity ?? 0)} x={x} curve={curveLinear} stroke="#FF9800" strokeDasharray="4 4"/>

              <LinePath data={history} y={(d) => priceScale(d.sellPrice ?? 0)} x={x} curve={curveLinear} stroke="#1976D2"/>
              <LinePath data={history} y={(d) => priceScale(d.buyPrice ?? 0)} x={x} curve={curveLinear} stroke="#D32F2F"/>
            </g>
          </Group>

          {tooltipOpen && tooltipData && (
            <g>
              <Line
                from={{ x: x(tooltipData) + margin.left, y: margin.top }}
                to={{ x: x(tooltipData) + margin.left, y: yMax + margin.top }}
                stroke="var(--color-border-dark)"
                strokeWidth={1}
                pointerEvents="none"
                strokeDasharray="5,2"/>
              <Circle
                cx={x(tooltipData) + margin.left}
                cy={quantityScale(tooltipData.sellQuantity!) + margin.top}
                r={4}
                fill="#4FC3F7"
                stroke="var(--color-background)"
                strokeWidth={2}
                pointerEvents="none"/>
              <Circle
                cx={x(tooltipData) + margin.left}
                cy={quantityScale(tooltipData.buyQuantity!) + margin.top}
                r={4}
                fill="#FF9800"
                stroke="var(--color-background)"
                strokeWidth={2}
                pointerEvents="none"/>
              <Circle
                cx={x(tooltipData) + margin.left}
                cy={priceScale(tooltipData.sellPrice!) + margin.top}
                r={4}
                fill="#1976D2"
                stroke="var(--color-background)"
                strokeWidth={2}
                pointerEvents="none"/>
              <Circle
                cx={x(tooltipData) + margin.left}
                cy={priceScale(tooltipData.buyPrice!) + margin.top}
                r={4}
                fill="#D32F2F"
                stroke="var(--color-background)"
                strokeWidth={2}
                pointerEvents="none"/>
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
              left={tooltipLeft}
              applyPositionStyle
              className={tipStyles.tip}
              style={{ textAlign: 'center', transform: 'translateX(-50%)', minWidth: 72 }}
            >
              <FormatDate date={tooltipData?.time}/>
            </Tooltip>
            <TooltipWithBounds
              // set this to random so it correctly updates with parent bounds
              key={Math.random()}
              top={tooltipTop}
              left={tooltipLeft}
              className={tipStyles.tip}
              unstyled
              applyPositionStyle
            >
              <FlexRow align="space-between">Sell Price: <Coins value={tooltipData?.sellPrice!}/></FlexRow>
              <FlexRow align="space-between">Buy Price: <Coins value={tooltipData?.buyPrice!}/></FlexRow>
              <FlexRow align="space-between">Sell Listings: <FormatNumber value={tooltipData?.sellQuantity}/></FlexRow>
              <FlexRow align="space-between">Buy Orders: <FormatNumber value={tooltipData?.buyQuantity}/></FlexRow>
            </TooltipWithBounds>
          </>
        )}
      </div>

    </>
  );
};

function renderGoldTick(props: TickRendererProps) {
  return (
    <svg style={{ overflow: 'visible', fontFeatureSettings: '"tnum" 1' }} x="0" y="-.5em" fontSize={12} fontFamily="var(--font-wotfard)">
      <foreignObject x={props.x - 60 - 8} y={props.y} width={60} height="1em" style={{ textAlign: 'right' }}>
        <Coins value={Number(props.formattedValue)}/>
      </foreignObject>
    </svg>
  );
}
