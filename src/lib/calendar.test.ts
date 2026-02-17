import { describe, expect, test } from 'vitest';
import { getLunarPhase } from './lunarPhase';
import { getTurtleCalendarDate } from './turtleCalendar';
import { getZodiacInfo } from './chineseZodiac';

describe('turtle calendar mapping', () => {
  test('maps anchor day to moon 1 day 1', () => {
    const result = getTurtleCalendarDate(new Date(2026, 1, 17));

    expect(result.isExtraDay).toBe(false);
    expect(result.monthIndex).toBe(1);
    expect(result.dayIndex).toBe(1);
  });

  test('rolls month after day 28', () => {
    const endOfMoon1 = getTurtleCalendarDate(new Date(2026, 2, 16));
    const startOfMoon2 = getTurtleCalendarDate(new Date(2026, 2, 17));

    expect(endOfMoon1.monthIndex).toBe(1);
    expect(endOfMoon1.dayIndex).toBe(28);
    expect(startOfMoon2.monthIndex).toBe(2);
    expect(startOfMoon2.dayIndex).toBe(1);
  });

  test('maps day after 364 to extra day', () => {
    const result = getTurtleCalendarDate(new Date(2027, 1, 16));

    expect(result.isExtraDay).toBe(true);
    expect(result.extraDayIndex).toBe(1);
  });
});

describe('lunar phase approximation', () => {
  test('returns new moon near reference epoch', () => {
    const result = getLunarPhase(new Date(Date.UTC(2000, 0, 6, 18, 14, 0)));
    expect(result.name).toBe('New Moon');
  });
});

describe('zodiac boundary', () => {
  test('switches at lunar new year boundary', () => {
    const before = getZodiacInfo(new Date(2026, 1, 16));
    const after = getZodiacInfo(new Date(2026, 1, 17));

    expect(before.animal).toBe('Snake');
    expect(after.animal).toBe('Horse');
  });
});
