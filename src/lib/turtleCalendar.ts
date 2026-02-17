import { daysBetweenLocalDays, startOfLocalDay } from './dateUtils';

export const TURTLE_MONTHS = 13;
export const DAYS_PER_TURTLE_MONTH = 28;
export const IN_MONTH_DAYS = TURTLE_MONTHS * DAYS_PER_TURTLE_MONTH;

export const TURTLE_ANCHOR = {
  year: 2026,
  monthIndex: 1,
  dayOfMonth: 17
} as const;

export type TurtleCalendarDate = {
  gregorianDate: Date;
  turtleYearStart: Date;
  turtleYearEnd: Date;
  turtleYearLength: number;
  dayOfTurtleYear: number;
  monthIndex: number | null;
  dayIndex: number | null;
  isExtraDay: boolean;
  extraDayIndex: number | null;
};

function getYearStartForGregorianDate(date: Date): Date {
  const thisYearStart = new Date(
    date.getFullYear(),
    TURTLE_ANCHOR.monthIndex,
    TURTLE_ANCHOR.dayOfMonth
  );

  if (startOfLocalDay(date) < thisYearStart) {
    return new Date(
      date.getFullYear() - 1,
      TURTLE_ANCHOR.monthIndex,
      TURTLE_ANCHOR.dayOfMonth
    );
  }

  return thisYearStart;
}

export function getTurtleCalendarDate(gregorianDate: Date): TurtleCalendarDate {
  const localDay = startOfLocalDay(gregorianDate);
  const turtleYearStart = getYearStartForGregorianDate(localDay);
  const turtleYearEnd = new Date(
    turtleYearStart.getFullYear() + 1,
    TURTLE_ANCHOR.monthIndex,
    TURTLE_ANCHOR.dayOfMonth
  );

  const turtleYearLength = daysBetweenLocalDays(turtleYearStart, turtleYearEnd);
  const dayOffset = daysBetweenLocalDays(turtleYearStart, localDay);
  const dayOfTurtleYear = dayOffset + 1;

  if (dayOffset < IN_MONTH_DAYS) {
    return {
      gregorianDate: localDay,
      turtleYearStart,
      turtleYearEnd,
      turtleYearLength,
      dayOfTurtleYear,
      monthIndex: Math.floor(dayOffset / DAYS_PER_TURTLE_MONTH) + 1,
      dayIndex: (dayOffset % DAYS_PER_TURTLE_MONTH) + 1,
      isExtraDay: false,
      extraDayIndex: null
    };
  }

  return {
    gregorianDate: localDay,
    turtleYearStart,
    turtleYearEnd,
    turtleYearLength,
    dayOfTurtleYear,
    monthIndex: null,
    dayIndex: null,
    isExtraDay: true,
    extraDayIndex: dayOffset - IN_MONTH_DAYS + 1
  };
}
