import { CATEGORIES, PEOPLE } from "../lib/categories";
import type { CategoryId, LogEntry } from "../lib/types";
import { countByCategory, entriesFor, thisWeek } from "../lib/stats";

const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 96;
const RINGS = 3;

function pointOnAxis(index: number, fraction: number) {
  // Start at top (-90°), go clockwise across the five axes.
  const angle = (-90 + index * (360 / CATEGORIES.length)) * (Math.PI / 180);
  return {
    x: CENTER + Math.cos(angle) * RADIUS * fraction,
    y: CENTER + Math.sin(angle) * RADIUS * fraction,
  };
}

function polygonPoints(values: number[], max: number) {
  return values
    .map((v, i) => {
      const p = pointOnAxis(i, max === 0 ? 0 : v / max);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
}

export function RadarChart({ entries }: { entries: LogEntry[] }) {
  const week = thisWeek(entries);

  const series = PEOPLE.map((person) => {
    const counts = countByCategory(entriesFor(week, person.id));
    return {
      person,
      values: CATEGORIES.map((c) => counts[c.id]),
    };
  });

  const max = Math.max(
    3,
    ...series.flatMap((s) => s.values),
  );

  const rings = Array.from({ length: RINGS }, (_, r) => {
    const frac = (r + 1) / RINGS;
    return CATEGORIES.map((_, i) => {
      const p = pointOnAxis(i, frac);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");
  });

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      style={{ maxWidth: 300 }}
      role="img"
      aria-label="Weekly balance comparison across the five hobbies"
    >
      <defs>
        {series.map((s) => (
          <radialGradient
            key={s.person.id}
            id={`radar-${s.person.id}`}
            cx="50%"
            cy="50%"
          >
            <stop offset="0%" stopColor={s.person.color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={s.person.color} stopOpacity="0.12" />
          </radialGradient>
        ))}
      </defs>

      {/* grid rings */}
      {rings.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1"
        />
      ))}

      {/* axes */}
      {CATEGORIES.map((c, i) => {
        const p = pointOnAxis(i, 1);
        return (
          <line
            key={c.id}
            x1={CENTER}
            y1={CENTER}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        );
      })}

      {/* data polygons */}
      {series.map((s) => (
        <polygon
          key={s.person.id}
          points={polygonPoints(s.values, max)}
          fill={`url(#radar-${s.person.id})`}
          stroke={s.person.color}
          strokeWidth="2"
          strokeLinejoin="round"
          style={{ transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)" }}
        />
      ))}

      {/* vertices */}
      {series.map((s) =>
        s.values.map((v, i) => {
          const p = pointOnAxis(i, max === 0 ? 0 : v / max);
          return (
            <circle
              key={`${s.person.id}-${i}`}
              cx={p.x}
              cy={p.y}
              r={v > 0 ? 3 : 0}
              fill={s.person.color}
            />
          );
        }),
      )}

      {/* axis labels */}
      {CATEGORIES.map((c, i) => {
        const p = pointOnAxis(i, 1.24);
        return (
          <text
            key={c.id}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
            fill={c.color}
          >
            {c.label}
          </text>
        );
      })}
    </svg>
  );
}

export function categoryValue(
  entries: LogEntry[],
  category: CategoryId,
): number {
  return entries.filter((e) => e.category === category).length;
}
