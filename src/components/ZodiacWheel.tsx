import { ZODIAC_ANIMALS } from '../lib/chineseZodiac';

type ZodiacWheelProps = {
  activeAnimalIndex: number;
  activeAnimal: string;
  rotationDeg: number;
};

type Point = {
  x: number;
  y: number;
};

const SIZE = 420;
const CENTER = 210;
const OUTER_RADIUS = 190;
const INNER_RADIUS = 95;

function polar(radius: number, angleDeg: number): Point {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad)
  };
}

function ringSlicePath(startAngle: number, endAngle: number): string {
  const p1 = polar(OUTER_RADIUS, startAngle);
  const p2 = polar(OUTER_RADIUS, endAngle);
  const p3 = polar(INNER_RADIUS, endAngle);
  const p4 = polar(INNER_RADIUS, startAngle);

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${p4.x} ${p4.y}`,
    'Z'
  ].join(' ');
}

export function ZodiacWheel({
  activeAnimalIndex,
  activeAnimal,
  rotationDeg
}: ZodiacWheelProps): JSX.Element {
  return (
    <article className="zodiac-section" aria-label="Chinese zodiac wheel">
      <h2>Chinese Zodiac Wheel</h2>

      <div className="zodiac-wheel-wrap">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="zodiac-wheel-svg"
          role="img"
          aria-label={`Zodiac wheel with current animal ${activeAnimal}`}
        >
          <defs>
            <radialGradient id="zodiacCenter" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#f2d6a2" />
              <stop offset="100%" stopColor="#cfac73" />
            </radialGradient>
          </defs>

          <g transform={`rotate(${rotationDeg} ${CENTER} ${CENTER})`}>
            {ZODIAC_ANIMALS.map((animal, idx) => {
              const start = idx * 30;
              const end = (idx + 1) * 30;
              const mid = (start + end) / 2;
              const labelPoint = polar(140, mid);
              const isActive = idx === activeAnimalIndex;

              return (
                <g key={animal}>
                  <path
                    d={ringSlicePath(start, end)}
                    className={isActive ? 'zodiac-slice zodiac-slice-active' : 'zodiac-slice'}
                  />
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${mid} ${labelPoint.x} ${labelPoint.y})`}
                    className={isActive ? 'zodiac-label zodiac-label-active' : 'zodiac-label'}
                  >
                    {animal}
                  </text>
                </g>
              );
            })}
          </g>

          <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS - 8} fill="url(#zodiacCenter)" />
          <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS - 8} className="zodiac-center-ring" />

          <text x={CENTER} y={CENTER - 10} textAnchor="middle" className="zodiac-center-title">
            Year of the
          </text>
          <text x={CENTER} y={CENTER + 20} textAnchor="middle" className="zodiac-center-value">
            {activeAnimal}
          </text>

          <polygon points="200,12 220,12 210,34" className="zodiac-pointer" />
        </svg>
      </div>
    </article>
  );
}
