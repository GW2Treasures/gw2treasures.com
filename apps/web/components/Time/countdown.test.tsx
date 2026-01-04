import { render } from 'vitest-browser-react';
import { CountDown, type CountDownProps } from './countdown';
import { SynchronizedTimeContext } from './synchronized-time';
import { describe, expect, it } from 'vitest';

const defaultProps: CountDownProps = {
  active: 'active',
  activeDurationMinutes: 1,
  highlightNextMinutes: 1,
  schedule: { offset: 0, repeat: 60 }
};

const testCases: ({ i: number, time: Date | undefined } & Partial<CountDownProps>)[] = [
  { i: 1, time: undefined },
  { i: 2, time: new Date('2025-09-16T00:00:00.000Z') },
  { i: 3, time: new Date('2025-09-16T00:00:59.999Z') },
  { i: 4, time: new Date('2025-09-16T00:01:00.000Z') },
  { i: 5, time: new Date('2025-09-16T00:59:00.000Z') },
  { i: 6, time: new Date('2025-09-16T00:59:59.999Z') },
  { i: 7, time: new Date('2025-09-16T01:00:00.000Z') },
  { i: 8, time: new Date('2025-09-16T01:00:00.000Z'), schedule: { offset: 0, repeat: 120 }},
  { i: 9, time: new Date('2025-09-16T00:30:00.000Z'), schedule: { offset: 0, repeat: 120 }},
  { i: 10, time: new Date('2025-09-16T00:30:00.000Z'), schedule: { offset: 0 }},
  { i: 11, time: new Date('2025-09-16T00:30:00.000Z'), schedule: { offset: 120 }},
  { i: 12, time: new Date('2025-09-16T23:30:00.000Z'), schedule: { offset: 30 }},
  { i: 13, time: new Date('2025-09-16T23:30:00.000Z'), schedule: { offset: 30, repeat: 120 }},
];

describe('CountDown', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  it.each(testCases)('test $i', async ({ time, i, ...props }) => {
    expect(
      (await render(
        <SynchronizedTimeContext value={time}>
          <CountDown {...defaultProps} {...props}/>
        </SynchronizedTimeContext>
      )).asFragment()
    ).toMatchSnapshot();
  });
});
