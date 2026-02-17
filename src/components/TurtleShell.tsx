type TurtleShellProps = {
  activeDay: number | null;
  activeMonth: number | null;
};

type Point = {
  x: number;
  y: number;
};

type MonthCell = {
  month: number;
  points: string;
  labelX: number;
  labelY: number;
};

const SIZE = 800;
const CENTER = 400;
const DAY_OUTER_RADIUS = 380;
const DAY_INNER_RADIUS = 305;
const DAY_STEP_DEG = 360 / 28;
const DAY_OFFSET_DEG = -DAY_STEP_DEG / 2;

const MONTH_CELLS: MonthCell[] = [
  { month: 10, points: '279,126 337,107 383,100 450,104 520,126 452,195 335,195', labelX: 397, labelY: 146 },
  { month: 11, points: '302,269 339,207 453,207 490,271 454,332 339,332', labelX: 396, labelY: 270 },
  { month: 12, points: '302,406 339,344 453,344 490,408 454,468 339,468', labelX: 396, labelY: 407 },
  { month: 13, points: '302,543 339,481 453,481 490,545 454,605 339,605', labelX: 396, labelY: 544 },
  { month: 5, points: '280,677 333,618 458,618 519,677 426,701 347,697', labelX: 398, labelY: 661 },
  { month: 1, points: '131,267 178,198 214,165 264,132 326,204 291,262', labelX: 237, labelY: 213 },
  { month: 2, points: '100,374 109,324 126,280 289,273 328,338 293,395 100,395', labelX: 210, labelY: 337 },
  { month: 3, points: '100,408 288,408 328,475 293,533 131,528 111,483', labelX: 210, labelY: 468 },
  { month: 4, points: '134,540 288,546 325,608 267,670 201,626 162,585', labelX: 238, labelY: 593 },
  { month: 9, points: '465,200 533,131 600,176 642,222 668,263 503,266', labelX: 558, labelY: 213 },
  { month: 8, points: '466,337 501,279 673,276 693,333 701,397 502,400', labelX: 588, labelY: 339 },
  { month: 7, points: '466,474 502,413 701,412 692,475 669,529 502,537', labelX: 586, labelY: 471 },
  { month: 6, points: '467,608 502,550 666,541 612,615 534,670', labelX: 558, labelY: 595 }
];

function polar(radius: number, angleDeg: number): Point {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad)
  };
}

function createRingSegmentPath(
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const p1 = polar(outerRadius, startAngle);
  const p2 = polar(outerRadius, endAngle);
  const p3 = polar(innerRadius, endAngle);
  const p4 = polar(innerRadius, startAngle);

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${p4.x} ${p4.y}`,
    'Z'
  ].join(' ');
}

export function TurtleShell({ activeDay, activeMonth }: TurtleShellProps): JSX.Element {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="turtle-shell-svg"
      role="img"
      aria-label="Turtle shell lunar calendar with 28 day plates and 13 moon plates"
    >
      <defs>
        <clipPath id="innerShellClip">
          <circle cx={CENTER} cy={CENTER} r={DAY_INNER_RADIUS} />
        </clipPath>
        <radialGradient id="shellBase" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#8ea25a" />
          <stop offset="100%" stopColor="#6f7d3a" />
        </radialGradient>
        <radialGradient id="dayBase" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#dae5c2" />
          <stop offset="100%" stopColor="#bbcc9f" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={DAY_INNER_RADIUS} fill="url(#shellBase)" />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={DAY_OUTER_RADIUS}
        fill="none"
        stroke="#24354a"
        strokeWidth="4"
      />

      {Array.from({ length: 28 }, (_, idx) => {
        const day = ((28 - idx) % 28) + 1;
        const startAngle = DAY_OFFSET_DEG + idx * DAY_STEP_DEG;
        const endAngle = DAY_OFFSET_DEG + (idx + 1) * DAY_STEP_DEG;
        const mid = (startAngle + endAngle) / 2;
        const dayLabelPoint = polar((DAY_OUTER_RADIUS + DAY_INNER_RADIUS) / 2, mid);
        const isActive = activeDay === day;

        return (
          <g key={day}>
            <path
              d={createRingSegmentPath(DAY_OUTER_RADIUS, DAY_INNER_RADIUS, startAngle, endAngle)}
              className={isActive ? 'day-segment day-segment-active' : 'day-segment'}
              aria-label={`Day ${day}`}
            />
            <text
              x={dayLabelPoint.x}
              y={dayLabelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              aria-label={`Day label ${day}`}
              className={isActive ? 'day-label day-label-active' : 'day-label'}
            >
              {day}
            </text>
          </g>
        );
      })}

      <circle
        cx={CENTER}
        cy={CENTER}
        r={DAY_INNER_RADIUS}
        fill="none"
        stroke="#24354a"
        strokeWidth="7"
      />

      <g clipPath="url(#innerShellClip)">
        {MONTH_CELLS.map((cell) => {
          const isActive = activeMonth === cell.month;

          return (
            <g key={cell.month}>
              <polygon
                points={cell.points}
                className={isActive ? 'month-segment month-segment-active' : 'month-segment'}
              />
              <text
                x={cell.labelX}
                y={cell.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                aria-label={`Moon plate ${cell.month}`}
                className={isActive ? 'month-label month-label-active' : 'month-label'}
              >
                {cell.month}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
