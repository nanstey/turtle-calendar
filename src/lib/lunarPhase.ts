export const SYNODIC_MONTH_DAYS = 29.53058867;
const DAY_MS = 24 * 60 * 60 * 1000;
const KNOWN_NEW_MOON_UTC_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

export type LunarPhase = {
  name:
    | 'New Moon'
    | 'Waxing Crescent'
    | 'First Quarter'
    | 'Waxing Gibbous'
    | 'Full Moon'
    | 'Waning Gibbous'
    | 'Third Quarter'
    | 'Waning Crescent';
  symbol: string;
  ageDays: number;
  illumination: number;
  cycleFraction: number;
};

function positiveModulo(value: number, divisor: number): number {
  const mod = value % divisor;
  return mod < 0 ? mod + divisor : mod;
}

export function getLunarPhase(date: Date): LunarPhase {
  const elapsedDays = (date.getTime() - KNOWN_NEW_MOON_UTC_MS) / DAY_MS;
  const ageDays = positiveModulo(elapsedDays, SYNODIC_MONTH_DAYS);
  const cycleFraction = ageDays / SYNODIC_MONTH_DAYS;
  const illumination = (1 - Math.cos(cycleFraction * 2 * Math.PI)) / 2;

  if (cycleFraction < 0.0625 || cycleFraction >= 0.9375) {
    return {
      name: 'New Moon',
      symbol: '●',
      ageDays,
      illumination,
      cycleFraction
    };
  }

  if (cycleFraction < 0.1875) {
    return {
      name: 'Waxing Crescent',
      symbol: '◔',
      ageDays,
      illumination,
      cycleFraction
    };
  }

  if (cycleFraction < 0.3125) {
    return {
      name: 'First Quarter',
      symbol: '◑',
      ageDays,
      illumination,
      cycleFraction
    };
  }

  if (cycleFraction < 0.4375) {
    return {
      name: 'Waxing Gibbous',
      symbol: '◕',
      ageDays,
      illumination,
      cycleFraction
    };
  }

  if (cycleFraction < 0.5625) {
    return {
      name: 'Full Moon',
      symbol: '○',
      ageDays,
      illumination,
      cycleFraction
    };
  }

  if (cycleFraction < 0.6875) {
    return {
      name: 'Waning Gibbous',
      symbol: '◕',
      ageDays,
      illumination,
      cycleFraction
    };
  }

  if (cycleFraction < 0.8125) {
    return {
      name: 'Third Quarter',
      symbol: '◐',
      ageDays,
      illumination,
      cycleFraction
    };
  }

  return {
    name: 'Waning Crescent',
    symbol: '◔',
    ageDays,
    illumination,
    cycleFraction
  };
}
