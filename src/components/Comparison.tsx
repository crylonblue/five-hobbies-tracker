import { CATEGORIES, PEOPLE } from "../lib/categories";
import type { LogEntry } from "../lib/types";
import {
  balanceScore,
  countByCategory,
  entriesFor,
  thisWeek,
} from "../lib/stats";
import { RadarChart } from "./RadarChart";
import { Avatar } from "./Avatar";

export function Comparison({ entries }: { entries: LogEntry[] }) {
  const week = thisWeek(entries);
  const [a, b] = PEOPLE;

  const aWeek = entriesFor(week, a.id);
  const bWeek = entriesFor(week, b.id);
  const aCounts = countByCategory(aWeek);
  const bCounts = countByCategory(bWeek);
  const aBalance = balanceScore(aWeek);
  const bBalance = balanceScore(bWeek);

  const leadText = () => {
    if (aWeek.length === 0 && bWeek.length === 0)
      return "No logs yet this week — first move sets the tone ✨";
    if (aBalance === bBalance)
      return aBalance === 5
        ? "Both perfectly balanced — power couple ⚡"
        : "Neck and neck this week 🤝";
    const [lead, lag] = aBalance > bBalance ? [a, b] : [b, a];
    return `${lead.name} is more balanced than ${lag.name} this week`;
  };

  return (
    <div className="compare">
      <div className="card radar-card">
        <RadarChart entries={entries} />
        <div className="radar-legend">
          {PEOPLE.map((p) => (
            <span key={p.id}>
              <span
                className="legend-swatch"
                style={{ background: p.color }}
              />
              {p.name}
            </span>
          ))}
        </div>
      </div>

      <div className="card scoreboard">
        <div className="vs-row">
          <div className="vs-side">
            <Avatar person={a} size={38} />
            <span className="nm">{a.name}</span>
          </div>
          <span className="eyebrow">this week</span>
          <div className="vs-side right">
            <Avatar person={b} size={38} />
            <span className="nm">{b.name}</span>
          </div>
        </div>

        {CATEGORIES.map((c) => {
          const av = aCounts[c.id];
          const bv = bCounts[c.id];
          const total = av + bv || 1;
          const Icon = c.icon;
          return (
            <div className="vs-cat" key={c.id}>
              <div className="vlabel">
                <span className="vs-side" style={{ gap: 6 }}>
                  <b
                    className="sc"
                    style={{ color: av ? a.color : "var(--text-faint)" }}
                  >
                    {av}
                  </b>
                </span>
                <Icon size={13} color={c.color} />
                {c.label}
                <span className="vs-side">
                  <b
                    className="sc"
                    style={{ color: bv ? b.color : "var(--text-faint)" }}
                  >
                    {bv}
                  </b>
                </span>
              </div>
              <div className="vs-bar">
                <div
                  className="fill-l"
                  style={{
                    width: `${(av / total) * 100}%`,
                    background: a.color,
                  }}
                />
                <div
                  className="fill-r"
                  style={{
                    width: `${(bv / total) * 100}%`,
                    background: b.color,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div className="lead-tag">{leadText()}</div>
      </div>
    </div>
  );
}
