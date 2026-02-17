import { startOfLocalDay } from './dateUtils';

const ANIMALS = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig'
] as const;

const LUNAR_NEW_YEAR_DATES: Record<number, [number, number]> = {
  2017: [1, 28],
  2018: [2, 16],
  2019: [2, 5],
  2020: [1, 25],
  2021: [2, 12],
  2022: [2, 1],
  2023: [1, 22],
  2024: [2, 10],
  2025: [1, 29],
  2026: [2, 17],
  2027: [2, 6],
  2028: [1, 26],
  2029: [2, 13],
  2030: [2, 3],
  2031: [1, 23],
  2032: [2, 11],
  2033: [1, 31],
  2034: [2, 19],
  2035: [2, 8],
  2036: [1, 28],
  2037: [2, 15],
  2038: [2, 4],
  2039: [1, 24],
  2040: [2, 12],
  2041: [2, 1],
  2042: [1, 22],
  2043: [2, 10]
};

export type ZodiacInfo = {
  zodiacYear: number;
  animal: (typeof ANIMALS)[number];
  animalIndex: number;
  lunarNewYearDate: Date;
  nextLunarNewYearDate: Date;
};

function getLunarNewYearDate(year: number): Date {
  const dateParts = LUNAR_NEW_YEAR_DATES[year];

  if (dateParts) {
    const [month, day] = dateParts;
    return new Date(year, month - 1, day);
  }

  // Fallback keeps the visualization running when a year is not listed.
  // For exact boundaries, extend LUNAR_NEW_YEAR_DATES with sourced dates.
  return new Date(year, 1, 4);
}

function modulo(value: number, base: number): number {
  const result = value % base;
  return result < 0 ? result + base : result;
}

export function getZodiacInfo(date: Date): ZodiacInfo {
  const localDay = startOfLocalDay(date);
  const gregorianYear = localDay.getFullYear();
  const currentLny = getLunarNewYearDate(gregorianYear);
  const zodiacYear = localDay >= currentLny ? gregorianYear : gregorianYear - 1;
  const lunarNewYearDate = getLunarNewYearDate(zodiacYear);
  const nextLunarNewYearDate = getLunarNewYearDate(zodiacYear + 1);
  const animalIndex = modulo(zodiacYear - 2020, ANIMALS.length);

  return {
    zodiacYear,
    animal: ANIMALS[animalIndex],
    animalIndex,
    lunarNewYearDate,
    nextLunarNewYearDate
  };
}

export const ZODIAC_ANIMALS = [...ANIMALS];
