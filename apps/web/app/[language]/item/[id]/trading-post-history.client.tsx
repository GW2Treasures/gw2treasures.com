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
import { useMemo, type FC, type MouseEvent, type TouchEvent, useState } from 'react';
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

// color config
const colors = {
  sellPrice: '#1976D2',
  buyPrice: '#D32F2F',
  sellQuantity: '#4FC3F7',
  buyQuantity: '#FF9800',
};

// size of chart
const height = 420;
const margin = { top: 20, bottom: 40, left: 80, right: 80 };

export const TradingPostHistoryClientInternal: FC<TradingPostHistoryClientInternalProps> = ({ history, width }) => {
  const [xMax, yMax] = useMemo(() => [
    width - margin.left - margin.right,
    height - margin.top - margin.bottom,
  ], [width]);

  // calculate max values
  const max = useMemo(() => history.reduce<{ sellPrice: number, buyPrice: number, sellQuantity: number, buyQuantity: number }>(
    (max, current) => ({
      sellPrice: Math.max(max.sellPrice, current.sellPrice ?? 0),
      buyPrice: Math.max(max.buyPrice, current.buyPrice ?? 0),
      sellQuantity: Math.max(max.sellQuantity, current.sellQuantity ?? 0),
      buyQuantity: Math.max(max.buyQuantity, current.buyQuantity ?? 0),
    }), { sellPrice: 0, buyPrice: 0, sellQuantity: 0, buyQuantity: 0 }),
    [history]
  );

  const [visibility, setVisibility] = useState({ sellPrice: true, buyPrice: true, sellQuantity: true, buyQuantity: true });

  const xScale = scaleTime({
    range: [0, xMax],
    round: true,
    domain: extent(history, ({ time }) => time) as [Date, Date],
  });

  const priceScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(max.sellPrice, max.buyPrice)],
  });

  const quantityScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(max.sellQuantity, max.buyQuantity)],
  });

  // helper functions
  const x = (d: TradingPostHistory) => xScale(d.time);

  // tooltip
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<TradingPostHistory>();

  // tooltip event handler
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

  const current = history.at(-1)!;

  return (
    <>
      <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
        <div style={{ borderLeft: `4px solid ${visibility.sellPrice ? colors.sellPrice : 'var(--color-border-dark)'}`, paddingLeft: 8 }} onClick={() => setVisibility({ ...visibility, sellPrice: !visibility.sellPrice })}>
          <div>Sell Price</div>
          <div style={{ fontWeight: 500, marginTop: 8 }}>{current.sellPrice ? (<Coins value={current.sellPrice}/>) : <span>-</span>}</div>
        </div>
        <div style={{ borderLeft: `4px solid ${visibility.buyPrice ? colors.buyPrice : 'var(--color-border-dark)'}`, paddingLeft: 8 }} onClick={() => setVisibility({ ...visibility, buyPrice: !visibility.buyPrice })}>
          <div>Buy Price</div>
          <div style={{ fontWeight: 500, marginTop: 8 }}>{current.buyPrice ? (<Coins value={current.buyPrice}/>) : <span>-</span>}</div>
        </div>
        <div style={{ borderLeft: `4px dashed ${visibility.sellQuantity ? colors.sellQuantity : 'var(--color-border-dark)'}`, paddingLeft: 8 }} onClick={() => setVisibility({ ...visibility, sellQuantity: !visibility.sellQuantity })}>
          <div>Sell Listings</div>
          <div style={{ fontWeight: 500, marginTop: 8 }}><FormatNumber value={current.sellQuantity}/></div>
        </div>
        <div style={{ borderLeft: `4px dashed ${visibility.buyQuantity ? colors.buyQuantity : 'var(--color-border-dark)'}`, paddingLeft: 8 }} onClick={() => setVisibility({ ...visibility, buyQuantity: !visibility.buyQuantity })}>
          <div>Buy Orders</div>
          <div style={{ fontWeight: 500, marginTop: 8 }}><FormatNumber value={current.buyQuantity}/></div>
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
              {visibility.sellQuantity && visibility.buyQuantity && (
                <Threshold id="quantity" data={history} x={x} y0={(d) => quantityScale(d.sellQuantity ?? 0)} y1={(d) => quantityScale(d.buyQuantity ?? 0)} clipAboveTo={0} clipBelowTo={yMax} curve={curveLinear} aboveAreaProps={{ fill: colors.sellQuantity, fillOpacity: .1 }} belowAreaProps={{ fill: colors.buyQuantity, fillOpacity: .1 }}/>
              )}

              {visibility.sellQuantity && (<LinePath data={history} y={(d) => quantityScale(d.sellQuantity ?? 0)} x={x} curve={curveLinear} stroke={colors.sellQuantity} strokeDasharray="4"/>)}
              {visibility.buyQuantity && (<LinePath data={history} y={(d) => quantityScale(d.buyQuantity ?? 0)} x={x} curve={curveLinear} stroke={colors.buyQuantity} strokeDasharray="4"/>)}

              {visibility.sellPrice && (<LinePath data={history} y={(d) => priceScale(d.sellPrice ?? 0)} x={x} defined={(d) => !!d.sellPrice} curve={curveLinear} stroke={colors.sellPrice}/>)}
              {visibility.buyPrice && (<LinePath data={history} y={(d) => priceScale(d.buyPrice ?? 0)} x={x} defined={(d) => !!d.buyPrice} curve={curveLinear} stroke={colors.buyPrice}/>)}
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
                strokeDasharray="4 2"/>
              <Circle
                cx={x(tooltipData) + margin.left}
                cy={quantityScale(tooltipData.sellQuantity ?? 0) + margin.top}
                r={4}
                fill={colors.sellQuantity}
                stroke="var(--color-background)"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.12))' }}
                pointerEvents="none"/>
              <Circle
                cx={x(tooltipData) + margin.left}
                cy={quantityScale(tooltipData.buyQuantity ?? 0) + margin.top}
                r={4}
                fill={colors.buyQuantity}
                stroke="var(--color-background)"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.12))' }}
                pointerEvents="none"/>
              {tooltipData.sellPrice && (
                <Circle
                  cx={x(tooltipData) + margin.left}
                  cy={priceScale(tooltipData.sellPrice ?? 0) + margin.top}
                  r={4}
                  fill={colors.sellPrice}
                  stroke="var(--color-background)"
                  strokeWidth={2}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.12))' }}
                  pointerEvents="none"/>
              )}
              {tooltipData.buyPrice && (
                <Circle
                  cx={x(tooltipData) + margin.left}
                  cy={priceScale(tooltipData.buyPrice ?? 0) + margin.top}
                  r={4}
                  fill={colors.buyPrice}
                  stroke="var(--color-background)"
                  strokeWidth={2}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.12))' }}
                  pointerEvents="none"/>
              )}
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
              <FlexRow align="space-between">Sell Price: {tooltipData.sellPrice ? (<Coins value={tooltipData?.sellPrice ?? 0}/>) : <span>-</span>}</FlexRow>
              <FlexRow align="space-between">Buy Price: {tooltipData.buyPrice ? (<Coins value={tooltipData.buyPrice}/>) : <span>-</span>}</FlexRow>
              <FlexRow align="space-between">Sell Listings: <FormatNumber value={tooltipData?.sellQuantity ?? 0}/></FlexRow>
              <FlexRow align="space-between">Buy Orders: <FormatNumber value={tooltipData?.buyQuantity ?? 0}/></FlexRow>
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
