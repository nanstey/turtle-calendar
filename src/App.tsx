import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from 'react';
import { DatePicker } from './components/DatePicker';
import { MoonPhaseIndicator } from './components/MoonPhaseIndicator';
import { TurtleShell } from './components/TurtleShell';
import {
  CALENDAR_MODELS,
  DEFAULT_CALENDAR_MODEL,
  DEFAULT_TRADITION_ANCHOR,
  TRADITION_ANCHORS,
  getCalendarModel,
  getSystemExplanation,
  getTraditionAnchor,
  isCalendarModelId,
  isTraditionAnchorId,
  type CalendarModelId,
  type TraditionAnchorId
} from './data/calendarSystems';
import { CITATIONS, MOON_REFERENCE_ROWS } from './data/traditions';
import {
  formatIsoDate,
  formatLongDate,
  isSameLocalDay,
  parseIsoDate,
  startOfLocalDay
} from './lib/dateUtils';
import { getLunarPhase } from './lib/lunarPhase';
import { getTurtleSystemDate } from './lib/turtleCalendarSystem';

function CitationRef({ id }: { id: number }): JSX.Element {
  return (
    <sup>
      <a href={`#citation-${id}`} aria-label={`Citation ${id}`}>
        [{id}]
      </a>
    </sup>
  );
}

type CollapsibleSectionProps = {
  title: string;
  titleLevel: 'h2' | 'h3';
  className?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

function CollapsibleSection({
  title,
  titleLevel,
  className,
  defaultOpen = false,
  children
}: CollapsibleSectionProps): JSX.Element {
  const Heading = titleLevel;
  const classes = ['collapsible-section', className].filter(Boolean).join(' ');
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details className={classes} open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
      <summary className="collapsible-summary">
        <Heading>{title}</Heading>
      </summary>
      <div className="collapsible-content">{children}</div>
    </details>
  );
}

type InitialAppState = {
  date: Date;
  modelId: CalendarModelId;
  traditionId: TraditionAnchorId;
  customStartDate: Date;
  hasUrlOverrides: boolean;
};

function getInitialAppState(): InitialAppState {
  const today = startOfLocalDay(new Date());
  const params = new URLSearchParams(window.location.search);

  const rawDate = params.get('date');
  const rawModel = params.get('model');
  const rawTradition = params.get('tradition');
  const rawCustomStart = params.get('customStart');

  const parsedDate = rawDate ? parseIsoDate(rawDate) : null;
  const parsedCustomStart = rawCustomStart ? parseIsoDate(rawCustomStart) : null;
  const modelId = isCalendarModelId(rawModel) ? rawModel : DEFAULT_CALENDAR_MODEL;
  const traditionId = isTraditionAnchorId(rawTradition) ? rawTradition : DEFAULT_TRADITION_ANCHOR;

  return {
    date: parsedDate ?? today,
    modelId,
    traditionId,
    customStartDate: parsedCustomStart ?? today,
    hasUrlOverrides:
      rawDate !== null || rawModel !== null || rawTradition !== null || rawCustomStart !== null
  };
}

export default function App(): JSX.Element {
  const [initialState] = useState<InitialAppState>(() => getInitialAppState());
  const [selectedDate, setSelectedDate] = useState<Date>(() => initialState.date);
  const [selectedModelId, setSelectedModelId] = useState<CalendarModelId>(() => initialState.modelId);
  const [selectedTraditionId, setSelectedTraditionId] = useState<TraditionAnchorId>(() => initialState.traditionId);
  const [selectedCustomStartDate, setSelectedCustomStartDate] = useState<Date>(
    () => initialState.customStartDate
  );
  const [hasUserChangedControls, setHasUserChangedControls] = useState(false);
  const [clockNow, setClockNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setClockNow(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!initialState.hasUrlOverrides && !hasUserChangedControls) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set('date', formatIsoDate(selectedDate));
    params.set('model', selectedModelId);
    params.set('tradition', selectedTraditionId);
    if (selectedTraditionId === 'custom') {
      params.set('customStart', formatIsoDate(selectedCustomStartDate));
    } else {
      params.delete('customStart');
    }

    const queryString = params.toString();
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);
  }, [
    selectedDate,
    selectedModelId,
    selectedTraditionId,
    selectedCustomStartDate,
    hasUserChangedControls,
    initialState.hasUrlOverrides
  ]);

  const now = useMemo(() => {
    if (isSameLocalDay(selectedDate, clockNow)) {
      return clockNow;
    }

    return new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      12,
      0,
      0,
      0
    );
  }, [selectedDate, clockNow]);

  const handleDateChange = (date: Date): void => {
    setSelectedDate(startOfLocalDay(date));
    setHasUserChangedControls(true);
  };

  const handleTodayClick = (): void => {
    setSelectedDate(startOfLocalDay(new Date()));
    setHasUserChangedControls(true);
  };

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    if (isCalendarModelId(value)) {
      setSelectedModelId(value);
      setHasUserChangedControls(true);
    }
  };

  const handleTraditionChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    if (isTraditionAnchorId(value)) {
      setSelectedTraditionId(value);
      setHasUserChangedControls(true);
    }
  };

  const handleCustomStartDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const parsed = parseIsoDate(event.target.value);
    if (parsed) {
      setSelectedCustomStartDate(parsed);
      setHasUserChangedControls(true);
    }
  };

  const turtleDate = useMemo(
    () => getTurtleSystemDate(now, selectedModelId, selectedTraditionId, selectedCustomStartDate),
    [now, selectedModelId, selectedTraditionId, selectedCustomStartDate]
  );
  const lunarPhase = useMemo(() => getLunarPhase(now), [now]);

  const activeModel = useMemo(() => getCalendarModel(selectedModelId), [selectedModelId]);
  const activeTradition = useMemo(() => getTraditionAnchor(selectedTraditionId), [selectedTraditionId]);
  const activeExplanation = useMemo(
    () => getSystemExplanation(selectedModelId, selectedTraditionId, selectedCustomStartDate),
    [selectedModelId, selectedTraditionId, selectedCustomStartDate]
  );
  const isCustomTradition = selectedTraditionId === 'custom';

  const turtleDateLabel =
    selectedModelId === 'teaching_13x28'
      ? turtleDate.isExtraDay
        ? `Extra Day ${turtleDate.extraDayIndex}`
        : `Moon ${turtleDate.monthIndex}, Day ${turtleDate.dayIndex}`
      : `Lunation ${turtleDate.monthIndex}, Day ${turtleDate.dayIndex} of ${turtleDate.monthLength}`;

  const shellLegendText =
    selectedModelId === 'teaching_13x28'
      ? 'Outer ring: 28 day plates. Inner shell: 13 moon plates. Soft illumination marks all 364 in-month positions.'
      : 'Observed lunar mode: shell still shows a 13-plate teaching map. Outer ring highlights days 1-28 of each lunation; later days appear as overflow.';

  const outsideBadgeLabel =
    selectedModelId === 'teaching_13x28' ? 'Outside Month 13:' : 'Outside 28-Day Ring:';
  const outsideBadgeText = turtleDate.outOfShellDay
    ? selectedModelId === 'teaching_13x28'
      ? `Active Extra Day ${turtleDate.extraDayIndex}`
      : `Active Overflow Day ${turtleDate.extraDayIndex}`
    : 'Not active today';

  return (
    <main className="app-shell">
      <header className="top-panel">
        <h1>Turtle Calendar</h1>

        <div className="top-grid">
          <article className="metric-card">
            <h2>Date</h2>
            <p className="metric-value">{formatLongDate(now)}</p>
            <DatePicker value={selectedDate} onChange={handleDateChange} onToday={handleTodayClick} />
          </article>

          <article className="metric-card">
            <h2>Lunar Phase</h2>
            <MoonPhaseIndicator
              cycleFraction={lunarPhase.cycleFraction}
              illumination={lunarPhase.illumination}
              phaseName={lunarPhase.name}
              ageDays={lunarPhase.ageDays}
            />
            <p className="metric-detail">
              Approximate illumination: {Math.round(lunarPhase.illumination * 100)}%
            </p>
          </article>

          <article className="metric-card">
            <h2>Turtle Date</h2>
            <p className="metric-value">{turtleDateLabel}</p>
            <div className="turtle-date-range">
              <p className="metric-detail">Start: {formatLongDate(turtleDate.turtleYearStart)}</p>
              <p className="metric-detail">
                End: {formatLongDate(new Date(turtleDate.turtleYearEnd.getTime() - 24 * 60 * 60 * 1000))}
              </p>
            </div>
            <p className="metric-detail">Year length: {turtleDate.turtleYearLength} days</p>
            <div className="extra-day-row compact">
              <strong>{outsideBadgeLabel}</strong>
              <span className={turtleDate.outOfShellDay ? 'extra-day-badge active' : 'extra-day-badge'}>
                {outsideBadgeText}
              </span>
            </div>
          </article>
        </div>
      </header>

      <section className="visual-panel">
        <article className="shell-card">
          <h2>Turtle Shell Calendar</h2>
          <TurtleShell activeDay={turtleDate.shellDayIndex} activeMonth={turtleDate.shellMonthIndex} />
          <p className="shell-legend">{shellLegendText}</p>
        </article>

        <article className="calendar-system-panel">
          <CollapsibleSection
            title="Calendar System"
            titleLevel="h2"
            className="calendar-system-section"
            defaultOpen
          >
            <div
              className={isCustomTradition ? 'system-controls-grid custom-enabled' : 'system-controls-grid'}
            >
              <label className="system-select-field">
                <span>Calendar Model</span>
                <select value={selectedModelId} onChange={handleModelChange}>
                  {CALENDAR_MODELS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="system-select-field">
                <span>Tradition Anchor</span>
                <select value={selectedTraditionId} onChange={handleTraditionChange}>
                  {TRADITION_ANCHORS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {isCustomTradition && (
                <label className="system-select-field">
                  <span>Custom Start Date</span>
                  <input
                    className="system-date-input"
                    type="date"
                    value={formatIsoDate(selectedCustomStartDate)}
                    onChange={handleCustomStartDateChange}
                  />
                </label>
              )}
            </div>

            <div className="system-active-panel">
              <p className="system-active-title">Current Selection</p>
              <div className="system-pill-row">
                <span className="system-pill">{activeModel.label}</span>
                <span className="system-pill">{activeTradition.label}</span>
                {isCustomTradition && (
                  <span className="system-pill">Start {formatIsoDate(selectedCustomStartDate)}</span>
                )}
              </div>
              <p className="system-summary">{activeModel.summary}</p>

              <p className="system-active-title">How This Works</p>
              <ul className="system-description-list">
                {activeExplanation.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </CollapsibleSection>
        </article>
      </section>

      <section className="content-panel">
        <CollapsibleSection title="Context and Traditions" titleLevel="h2" className="content-section-card">
          <p>
            Turtle-shell lunar teaching is shared by multiple Nations, including Anishinaabe,
            Haudenosaunee, and Cree communities, with important local differences in language,
            ceremony, and naming<CitationRef id={1} />.
          </p>
          <p>
            This app keeps shell plates numeric and places sample naming references in the table below.
            The phase calculation is intentionally simple and uses a standard synodic month approximation
            for educational display<CitationRef id={5} />.
          </p>
          <p>
            The zodiac animal switches at Lunar New Year (not January 1), aligned with standard
            Chinese lunisolar boundary descriptions<CitationRef id={6} />
            <CitationRef id={7} />.
          </p>
        </CollapsibleSection>

        <CollapsibleSection
          title="13 Moon Reference Table (Sample Glosses)"
          titleLevel="h2"
          className="content-section-card"
        >
          <p>
            Sample terms from one Anishinaabe source and one publicly shared Haudenosaunee-oriented
            English list; communities may use different names or orderings<CitationRef id={2} />
            <CitationRef id={3} />
            <CitationRef id={4} />.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Moon</th>
                  <th>Anishinaabe (sample)</th>
                  <th>Haudenosaunee (sample)</th>
                </tr>
              </thead>
              <tbody>
                {MOON_REFERENCE_ROWS.map((row) => (
                  <tr key={row.moon}>
                    <td>{row.moon}</td>
                    <td>{row.anishinaabeSample}</td>
                    <td>{row.haudenosauneeSample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Disclaimer" titleLevel="h2" className="content-section-card disclaimer-card">
          <p>
            This is an educational visualization, not a ceremonial authority. Indigenous calendars and
            moon names are community-specific, and respectful use should prioritize guidance from local
            Elders, Knowledge Keepers, and Nation-approved resources.
          </p>
          <p>
            Chinese zodiac and lunar-phase outputs here are computational approximations intended for
            general reference.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="References" titleLevel="h2" className="content-section-card">
          <ol className="citation-list">
            {CITATIONS.map((citation) => (
              <li key={citation.id} id={`citation-${citation.id}`}>
                <a href={citation.url} target="_blank" rel="noreferrer">
                  {citation.title}
                </a>
                <span>{citation.note}</span>
              </li>
            ))}
          </ol>
        </CollapsibleSection>
      </section>
    </main>
  );
}
