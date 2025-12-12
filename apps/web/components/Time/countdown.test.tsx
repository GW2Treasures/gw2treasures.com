import { render } from '@testing-library/react';
import { CountDown, type CountDownProps } from './countdown';
import { SynchronizedTimeContext } from './synchronized-time';
import { describe, expect, it } from 'vitest';

const defaultProps: CountDownProps = {
  active: 'active',
  activeDurationMinutes: 1,
  highlightNextMinutes: 1,
  schedule: { offset: 0, repeat: 60 }
};

const testCases: ({ time: Date | undefined } & Partial<CountDownProps>)[] = [
  { time: undefined },
  { time: new Date('2025-09-16T00:00:00.000Z') },
  { time: new Date('2025-09-16T00:00:59.999Z') },
  { time: new Date('2025-09-16T00:01:00.000Z') },
  { time: new Date('2025-09-16T00:59:00.000Z') },
  { time: new Date('2025-09-16T00:59:59.999Z') },
  { time: new Date('2025-09-16T01:00:00.000Z') },
  { time: new Date('2025-09-16T01:00:00.000Z'), schedule: { offset: 0, repeat: 120 }},
  { time: new Date('2025-09-16T00:30:00.000Z'), schedule: { offset: 0, repeat: 120 }},
  { time: new Date('2025-09-16T00:30:00.000Z'), schedule: { offset: 0 }},
  { time: new Date('2025-09-16T00:30:00.000Z'), schedule: { offset: 120 }},
  { time: new Date('2025-09-16T23:30:00.000Z'), schedule: { offset: 30 }},
  { time: new Date('2025-09-16T23:30:00.000Z'), schedule: { offset: 30, repeat: 120 }},
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
