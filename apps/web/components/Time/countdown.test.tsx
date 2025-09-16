import { render } from '@testing-library/react';
import { CountDown, type CountDownProps } from './countdown';
import { SynchronizedTimeContext } from './synchronized-time';

const defaultProps: CountDownProps = {
  active: 'active',
  activeDurationMinutes: 1,
  offsetMinutes: 0,
  repeatMinutes: 60,
  highlightNextMinutes: 1
};

const testCases: ({ time: Date | undefined } & Partial<CountDownProps>)[] = [
  { time: undefined },
  { time: new Date('2025-09-16T00:00:00.000Z') },
  { time: new Date('2025-09-16T00:00:59.999Z') },
  { time: new Date('2025-09-16T00:01:00.000Z') },
  { time: new Date('2025-09-16T00:59:00.000Z') },
  { time: new Date('2025-09-16T00:59:59.999Z') },
  { time: new Date('2025-09-16T01:00:00.000Z') },
  { time: new Date('2025-09-16T01:00:00.000Z'), repeatMinutes: 120 },
  { time: new Date('2025-09-16T00:30:00.000Z'), repeatMinutes: 120 },
];

describe('CountDown', () => {
  it.each(testCases)('test', ({ time, ...props }) => {
    expect(
      render(
        <SynchronizedTimeContext value={time}>
          <CountDown {...defaultProps} {...props}/>,
        </SynchronizedTimeContext>
      ).asFragment()
    ).toMatchSnapshot();
  });
});
