type MoonPhaseIndicatorProps = {
  cycleFraction: number;
  illumination: number;
  phaseName: string;
  ageDays: number;
};

type Point = {
  x: number;
  y: number;
};

const SIZE = 220;
const CENTER = 110;
const OUTER_RADIUS = 88;
const TRACK_STROKE = 10;
const MOON_RADIUS = 48;
const SYNODIC_MONTH_DAYS = 29.53058867;

function polar(radius: number, angleDeg: number): Point {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad)
  };
}

function arcPath(radius: number, startDeg: number, endDeg: number): string {
  const start = polar(radius, startDeg);
  const end = polar(radius, endDeg);
  const delta = ((endDeg - startDeg) % 360 + 360) % 360;
  const largeArc = delta > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function MoonPhaseIndicator({
  cycleFraction,
  illumination,
  phaseName,
  ageDays
}: MoonPhaseIndicatorProps): JSX.Element {
  const normalized = ((cycleFraction % 1) + 1) % 1;
  const progressAngle = normalized * 360;
  const endAngle = -90 + progressAngle;
  const indicator = polar(OUTER_RADIUS, endAngle);

  const litWidth = Math.max(0, Math.min(1, illumination)) * MOON_RADIUS * 2;
  const isWaxing = normalized > 0 && normalized < 0.5;
  const litX = isWaxing ? CENTER + MOON_RADIUS - litWidth : CENTER - MOON_RADIUS;

  const nearNew = normalized < 0.02 || normalized > 0.98;
  const nearFull = Math.abs(normalized - 0.5) < 0.02;
  const directionLabel = nearNew || nearFull ? 'Transition' : isWaxing ? 'Waxing' : 'Waning';

  return (
    <div className="moon-indicator-wrap" aria-label="Current moon phase progression">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="moon-indicator-svg" role="img">
        <defs>
          <linearGradient id="moonProgress" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f3dba0" />
            <stop offset="100%" stopColor="#d89a54" />
          </linearGradient>
          <radialGradient id="moonLit" cx="45%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fbefc8" />
            <stop offset="100%" stopColor="#d8b77e" />
          </radialGradient>
          <clipPath id="moonDiskClip">
            <circle cx={CENTER} cy={CENTER} r={MOON_RADIUS} />
          </clipPath>
        </defs>

        <circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_RADIUS}
          className="moon-track"
          strokeWidth={TRACK_STROKE}
        />

        {progressAngle > 0 ? (
          <path
            d={arcPath(OUTER_RADIUS, -90, endAngle)}
            className="moon-progress"
            strokeWidth={TRACK_STROKE}
          />
        ) : null}

        {[0, 90, 180, 270].map((angle) => {
          const point = polar(OUTER_RADIUS, -90 + angle);
          return <circle key={angle} cx={point.x} cy={point.y} r={3.6} className="moon-quarter-dot" />;
        })}

        <circle cx={indicator.x} cy={indicator.y} r={6} className="moon-indicator-dot" />

        <circle cx={CENTER} cy={CENTER} r={MOON_RADIUS} className="moon-disk-base" />
        <g clipPath="url(#moonDiskClip)">
          <rect
            x={litX}
            y={CENTER - MOON_RADIUS}
            width={litWidth}
            height={MOON_RADIUS * 2}
            rx={MOON_RADIUS}
            ry={MOON_RADIUS}
            className="moon-disk-lit"
          />
        </g>

        <circle cx={CENTER} cy={CENTER} r={MOON_RADIUS} className="moon-disk-ring" />
      </svg>

      <div className="moon-indicator-meta">
        <p>
          <strong>{phaseName}</strong> ({directionLabel})
        </p>
        <p>
          Day {ageDays.toFixed(1)} of {SYNODIC_MONTH_DAYS.toFixed(1)}
        </p>
      </div>
    </div>
  );
}
