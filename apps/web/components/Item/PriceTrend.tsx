import type { TradingPostHistory_Trend } from '@gw2treasures/database';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { useMemo, type FC } from 'react';
import { FormatNumber } from '../Format/FormatNumber';
import { AreaClosed, Circle, LinePath } from '@visx/shape';
import { scaleLinear, scaleTime } from '@visx/scale';
import { extent } from 'd3-array';
import { curveMonotoneX } from '@visx/curve';
import { Group } from '@visx/group';
import { Icon } from '@gw2treasures/ui';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';

export interface PriceTrendProps {
  history: TradingPostHistory_Trend[];
  price: 'buyPrice' | 'sellPrice';
}

const percentageFormat: Intl.NumberFormatOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
  style: 'percent'
};

export const PriceTrend: FC<PriceTrendProps> = ({ history, price }) => {
  const prices = history.map((entry) => ({ time: new Date(entry.time), price: entry[price] }));

  const first = prices.find(({ price }) => !!price);
  const last = prices.findLast(({ price }) => !!price);

  if(!first || !last) {
    return (
      <span style={{ color: 'var(--color-text-muted)' }}>No data</span>
    );
  }

  const partial = prices.some(({ price }) => !price);

  const diff = last.price! / first.price! - 1;

  return (
    <FlexRow align="right" inline>
      {partial && <Tip tip="Trend based on partial data"><Icon icon="warning" color="var(--color-text-muted)"/></Tip>}
      <FormatNumber value={diff} options={percentageFormat}/>
      <Sparkline history={prices}/>
    </FlexRow>
  );
};

interface SparklineProps {
  history: { price: number | null, time: Date }[]
}

const Sparkline: FC<SparklineProps> = ({ history }) => {
  const width = 64;
  const height = 24;
  // add 1.5 margin to make sure the "now"-dot is always within the viewport
  const margin = 1.5;

  const [now, then] = useMemo(() => {
    const now = new Date();
    const then = new Date();
    then.setHours(then.getHours() - 24 * 7);

    return [now, then];
  }, []);

  const first = history.find(({ price }) => !!price);
  const last = history.findLast(({ price }) => !!price);

  if(!first || !last) {
    return <svg width={width} height={height}/>;
  }

  const diff = last.price! / first.price! - 1;
  const [min, max] = extent(history, ({ price }) => price) as [number, number];

  const domainDiff = min / max - 1;
  const domain = Math.abs(domainDiff) < 0.1
    ? [min * (0.9 + Math.abs(domainDiff)), max * (1.1 - Math.abs(domainDiff))]
    : [min, max];

  const xScale = scaleTime({
    domain: [now, then],
    range: [width - 2 * margin, 0]
  });

  const yScale = scaleLinear({
    domain,
    nice: true,
    range: [height - 2 * margin, 0]
  });

  const color = diff >= 0 ? '#4caf50' : '#f44336';

  return (
    <svg height={height} width={width}>
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.1"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>

      <Group left={margin} top={margin}>
        <AreaClosed data={history}
          x={(d) => xScale(d.time)} y={(d) => yScale(d.price ?? 0)}
          curve={curveMonotoneX} yScale={yScale}
          fill={`url(#gradient-${color})`}
          defined={(d) => !!d.price}/>

        {last === history.at(-1) && (
          <Circle
            cx={xScale(last.time)}
            cy={yScale(last.price ?? 0)}
            r={1.5}
            fill={color}/>
        )}

        <LinePath data={history} x={(d) => xScale(d.time)} y={(d) => yScale(d.price ?? 0)} curve={curveMonotoneX} stroke={color} strokeWidth={1} defined={(d) => !!d.price}/>
      </Group>
    </svg>
  );
};
