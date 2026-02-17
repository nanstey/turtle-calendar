export type CalendarModelId = 'teaching_13x28' | 'observed_lunar';
export type TraditionAnchorId = 'anishinaabe' | 'haudenosaunee' | 'cherokee' | 'custom';

export type CalendarModelOption = {
  id: CalendarModelId;
  label: string;
  summary: string;
};

export type TraditionAnchorOption = {
  id: TraditionAnchorId;
  label: string;
  teachingStart: { month: number; day: number };
  lunarMarker: { month: number; day: number };
  context: string;
};

export const DEFAULT_CALENDAR_MODEL: CalendarModelId = 'teaching_13x28';
export const DEFAULT_TRADITION_ANCHOR: TraditionAnchorId = 'anishinaabe';

export const CALENDAR_MODELS: CalendarModelOption[] = [
  {
    id: 'teaching_13x28',
    label: 'Turtle Teaching (13 x 28 + extra day)',
    summary:
      'Symbolic teaching model: 13 moons of 28 days each (364), plus extra day(s) outside month 13.'
  },
  {
    id: 'observed_lunar',
    label: 'Observed Lunar (new-moon based)',
    summary:
      'Astronomical approximation model: months follow new moons (about 29/30 days), yielding 12 or sometimes 13 lunations.'
  }
];

export const TRADITION_ANCHORS: TraditionAnchorOption[] = [
  {
    id: 'anishinaabe',
    label: 'Anishinaabe / Ojibwe',
    teachingStart: { month: 2, day: 17 },
    lunarMarker: { month: 2, day: 1 },
    context:
      'Commonly taught with 13-moon turtle-shell framing and local community moon naming traditions.'
  },
  {
    id: 'haudenosaunee',
    label: 'Haudenosaunee / Oneida',
    teachingStart: { month: 1, day: 15 },
    lunarMarker: { month: 1, day: 15 },
    context:
      'Often connected to midwinter ceremonial cycles and moon-based seasonal markers.'
  },
  {
    id: 'cherokee',
    label: 'Cherokee (Green Corn context)',
    teachingStart: { month: 8, day: 1 },
    lunarMarker: { month: 8, day: 1 },
    context:
      'Includes Green Corn seasonal renewal context in published turtle-calendar teachings.'
  },
  {
    id: 'custom',
    label: 'Custom',
    teachingStart: { month: 1, day: 1 },
    lunarMarker: { month: 1, day: 1 },
    context:
      'Uses a user-selected start date to anchor the teaching or observed-lunar cycle for this visualization.'
  }
];

export function isCalendarModelId(value: string | null): value is CalendarModelId {
  if (!value) {
    return false;
  }

  return CALENDAR_MODELS.some((option) => option.id === value);
}

export function isTraditionAnchorId(value: string | null): value is TraditionAnchorId {
  if (!value) {
    return false;
  }

  return TRADITION_ANCHORS.some((option) => option.id === value);
}

export function getCalendarModel(id: CalendarModelId): CalendarModelOption {
  const model = CALENDAR_MODELS.find((option) => option.id === id);
  if (!model) {
    throw new Error(`Unknown calendar model: ${id}`);
  }

  return model;
}

export function getTraditionAnchor(id: TraditionAnchorId): TraditionAnchorOption {
  const tradition = TRADITION_ANCHORS.find((option) => option.id === id);
  if (!tradition) {
    throw new Error(`Unknown tradition anchor: ${id}`);
  }

  return tradition;
}

type Explanation = {
  title: string;
  lines: string[];
};

export function getSystemExplanation(
  modelId: CalendarModelId,
  traditionId: TraditionAnchorId,
  customStartDate?: Date
): Explanation {
  const model = getCalendarModel(modelId);
  const tradition = getTraditionAnchor(traditionId);
  const customMarker =
    traditionId === 'custom' && customStartDate
      ? `${customStartDate.getMonth() + 1}/${customStartDate.getDate()}/${customStartDate.getFullYear()}`
      : null;

  if (modelId === 'teaching_13x28') {
    if (traditionId === 'custom') {
      return {
        title: `${model.label} + ${tradition.label}`,
        lines: [
          'This setting uses the turtle teaching structure directly: 13 moons x 28 days (364), with extra day(s) outside month 13.',
          `Custom anchor is applied as a yearly cycle start marker${customMarker ? ` (${customMarker})` : ''}.`,
          tradition.context,
          'Use this mode when prioritizing cultural teaching structure over strict astronomical month length.'
        ]
      };
    }

    return {
      title: `${model.label} + ${tradition.label}`,
      lines: [
        'This setting uses the turtle teaching structure directly: 13 moons x 28 days (364), with extra day(s) outside month 13.',
        `${tradition.label} anchor is applied as a tradition-specific cycle start marker (${tradition.teachingStart.month}/${tradition.teachingStart.day}).`,
        tradition.context,
        'Use this mode when prioritizing cultural teaching structure over strict astronomical month length.'
      ]
    };
  }

  if (traditionId === 'custom') {
    return {
      title: `${model.label} + ${tradition.label}`,
      lines: [
        'This setting follows approximate new-moon boundaries, so lunar months are about 29 or 30 days.',
        `Custom anchor is used as the yearly marker window${customMarker ? ` (${customMarker})` : ''}; the cycle starts on the next approximate new moon after that marker.`,
        tradition.context,
        'Use this mode when you want the moon progression to track astronomical lunations more closely.'
      ]
    };
  }

  return {
    title: `${model.label} + ${tradition.label}`,
    lines: [
      'This setting follows approximate new-moon boundaries, so lunar months are about 29 or 30 days.',
      `${tradition.label} anchor is used as the yearly marker window; the cycle starts on the next approximate new moon after ${tradition.lunarMarker.month}/${tradition.lunarMarker.day}.`,
      tradition.context,
      'Use this mode when you want the moon progression to track astronomical lunations more closely.'
    ]
  };
}
