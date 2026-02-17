import {
  CalendarModelId,
  TraditionAnchorId,
  getTraditionAnchor
} from '../data/calendarSystems';
import { getLunarPhase, SYNODIC_MONTH_DAYS } from './lunarPhase';
import { daysBetweenLocalDays, startOfLocalDay } from './dateUtils';
import { DAYS_PER_TURTLE_MONTH, IN_MONTH_DAYS, TURTLE_MONTHS } from './turtleCalendar';

const DAY_MS = 24 * 60 * 60 * 1000;

export type TurtleSystemDate = {
  modelId: CalendarModelId;
  traditionId: TraditionAnchorId;
  gregorianDate: Date;
  turtleYearStart: Date;
  turtleYearEnd: Date;
  turtleYearLength: number;
  dayOfTurtleYear: number;
  monthIndex: number | null;
  dayIndex: number | null;
  monthLength: number | null;
  shellMonthIndex: number | null;
  shellDayIndex: number | null;
  isExtraDay: boolean;
  extraDayIndex: number | null;
  outOfShellDay: boolean;
};

function createMarkerDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

function getTeachingMarker(
  traditionId: TraditionAnchorId,
  customStartDate?: Date
): { month: number; day: number } {
  if (traditionId === 'custom' && customStartDate) {
    return { month: customStartDate.getMonth() + 1, day: customStartDate.getDate() };
  }

  return getTraditionAnchor(traditionId).teachingStart;
}

function getLunarMarker(
  traditionId: TraditionAnchorId,
  customStartDate?: Date
): { month: number; day: number } {
  if (traditionId === 'custom' && customStartDate) {
    return { month: customStartDate.getMonth() + 1, day: customStartDate.getDate() };
  }

  return getTraditionAnchor(traditionId).lunarMarker;
}

function getFixedTeachingYearStart(
  date: Date,
  traditionId: TraditionAnchorId,
  customStartDate?: Date
): Date {
  const teachingMarker = getTeachingMarker(traditionId, customStartDate);
  const thisYearStart = createMarkerDate(
    date.getFullYear(),
    teachingMarker.month,
    teachingMarker.day
  );

  if (startOfLocalDay(date) < thisYearStart) {
    return createMarkerDate(date.getFullYear() - 1, teachingMarker.month, teachingMarker.day);
  }

  return thisYearStart;
}

function getApproxNextNewMoonOnOrAfter(markerDate: Date): Date {
  const marker = new Date(
    markerDate.getFullYear(),
    markerDate.getMonth(),
    markerDate.getDate(),
    12,
    0,
    0,
    0
  );

  const ageDays = getLunarPhase(marker).ageDays;
  const daysUntilNewMoon = (SYNODIC_MONTH_DAYS - ageDays) % SYNODIC_MONTH_DAYS;
  const nextNewMoon = new Date(marker.getTime() + daysUntilNewMoon * DAY_MS);

  return startOfLocalDay(nextNewMoon);
}

function getObservedYearStartForYear(
  year: number,
  traditionId: TraditionAnchorId,
  customStartDate?: Date
): Date {
  const lunarMarker = getLunarMarker(traditionId, customStartDate);
  const marker = createMarkerDate(year, lunarMarker.month, lunarMarker.day);

  return getApproxNextNewMoonOnOrAfter(marker);
}

function ensureNextLocalDay(previous: Date, candidate: Date): Date {
  if (candidate > previous) {
    return candidate;
  }

  return new Date(previous.getFullYear(), previous.getMonth(), previous.getDate() + 1);
}

function getObservedLunationStarts(yearStart: Date, yearEnd: Date): Date[] {
  const monthStarts: Date[] = [yearStart];

  while (monthStarts.length < 14) {
    const previous = monthStarts[monthStarts.length - 1];
    const rawNext = new Date(previous.getTime() + SYNODIC_MONTH_DAYS * DAY_MS);
    const candidate = ensureNextLocalDay(previous, startOfLocalDay(rawNext));

    if (candidate >= yearEnd) {
      break;
    }

    monthStarts.push(candidate);
  }

  return monthStarts;
}

function computeTeachingDate(
  localDay: Date,
  traditionId: TraditionAnchorId,
  customStartDate?: Date
): TurtleSystemDate {
  const teachingMarker = getTeachingMarker(traditionId, customStartDate);
  const turtleYearStart = getFixedTeachingYearStart(localDay, traditionId, customStartDate);
  const turtleYearEnd = createMarkerDate(
    turtleYearStart.getFullYear() + 1,
    teachingMarker.month,
    teachingMarker.day
  );

  const turtleYearLength = daysBetweenLocalDays(turtleYearStart, turtleYearEnd);
  const dayOffset = daysBetweenLocalDays(turtleYearStart, localDay);
  const dayOfTurtleYear = dayOffset + 1;

  if (dayOffset < IN_MONTH_DAYS) {
    const monthIndex = Math.floor(dayOffset / DAYS_PER_TURTLE_MONTH) + 1;
    const dayIndex = (dayOffset % DAYS_PER_TURTLE_MONTH) + 1;

    return {
      modelId: 'teaching_13x28',
      traditionId,
      gregorianDate: localDay,
      turtleYearStart,
      turtleYearEnd,
      turtleYearLength,
      dayOfTurtleYear,
      monthIndex,
      dayIndex,
      monthLength: DAYS_PER_TURTLE_MONTH,
      shellMonthIndex: monthIndex,
      shellDayIndex: dayIndex,
      isExtraDay: false,
      extraDayIndex: null,
      outOfShellDay: false
    };
  }

  return {
    modelId: 'teaching_13x28',
    traditionId,
    gregorianDate: localDay,
    turtleYearStart,
    turtleYearEnd,
    turtleYearLength,
    dayOfTurtleYear,
    monthIndex: null,
    dayIndex: null,
    monthLength: null,
    shellMonthIndex: null,
    shellDayIndex: null,
    isExtraDay: true,
    extraDayIndex: dayOffset - IN_MONTH_DAYS + 1,
    outOfShellDay: true
  };
}

function computeObservedDate(
  localDay: Date,
  traditionId: TraditionAnchorId,
  customStartDate?: Date
): TurtleSystemDate {
  const thisYearStart = getObservedYearStartForYear(localDay.getFullYear(), traditionId, customStartDate);
  const turtleYearStart =
    localDay < thisYearStart
      ? getObservedYearStartForYear(localDay.getFullYear() - 1, traditionId, customStartDate)
      : thisYearStart;
  const turtleYearEnd = getObservedYearStartForYear(
    turtleYearStart.getFullYear() + 1,
    traditionId,
    customStartDate
  );

  const turtleYearLength = daysBetweenLocalDays(turtleYearStart, turtleYearEnd);
  const dayOfTurtleYear = daysBetweenLocalDays(turtleYearStart, localDay) + 1;

  const monthStarts = getObservedLunationStarts(turtleYearStart, turtleYearEnd);

  let monthStartIndex = monthStarts.length - 1;
  for (let index = 0; index < monthStarts.length; index += 1) {
    const start = monthStarts[index];
    const next = monthStarts[index + 1] ?? turtleYearEnd;
    if (localDay >= start && localDay < next) {
      monthStartIndex = index;
      break;
    }
  }

  const start = monthStarts[monthStartIndex];
  const next = monthStarts[monthStartIndex + 1] ?? turtleYearEnd;
  const dayIndex = daysBetweenLocalDays(start, localDay) + 1;
  const monthLength = daysBetweenLocalDays(start, next);
  const monthIndex = monthStartIndex + 1;
  const shellMonthIndex = monthIndex <= TURTLE_MONTHS ? monthIndex : null;
  const shellDayIndex = dayIndex <= DAYS_PER_TURTLE_MONTH ? dayIndex : null;
  const outOfShellDay = dayIndex > DAYS_PER_TURTLE_MONTH;

  return {
    modelId: 'observed_lunar',
    traditionId,
    gregorianDate: localDay,
    turtleYearStart,
    turtleYearEnd,
    turtleYearLength,
    dayOfTurtleYear,
    monthIndex,
    dayIndex,
    monthLength,
    shellMonthIndex,
    shellDayIndex,
    isExtraDay: outOfShellDay,
    extraDayIndex: outOfShellDay ? dayIndex - DAYS_PER_TURTLE_MONTH : null,
    outOfShellDay
  };
}

export function getTurtleSystemDate(
  gregorianDate: Date,
  modelId: CalendarModelId,
  traditionId: TraditionAnchorId,
  customStartDate?: Date
): TurtleSystemDate {
  const localDay = startOfLocalDay(gregorianDate);

  if (modelId === 'teaching_13x28') {
    return computeTeachingDate(localDay, traditionId, customStartDate);
  }

  return computeObservedDate(localDay, traditionId, customStartDate);
}
