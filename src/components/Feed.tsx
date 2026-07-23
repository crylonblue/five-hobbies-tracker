import { Trash2 } from "lucide-react";
import { CATEGORY_MAP, PEOPLE_MAP } from "../lib/categories";
import { deleteEntry } from "../lib/store";
import { relativeTime } from "../lib/stats";
import type { LogEntry } from "../lib/types";

export function Feed({ entries }: { entries: LogEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="empty">
        <span className="em">🌱</span>
        Nothing logged yet. Pick a hobby above and plant the first flag —
        every streak starts with one.
      </div>
    );
  }

  return (
    <div className="feed">
      {entries.map((e) => {
        const cat = CATEGORY_MAP[e.category];
        const person = PEOPLE_MAP[e.user];
        const Icon = cat.icon;
        return (
          <div
            key={e.id}
            className="feed-item"
            style={{
              ["--cat" as string]: cat.color,
              ["--glow" as string]: cat.glow,
            }}
          >
            <div className="feed-cat">
              <Icon size={20} strokeWidth={2.2} />
            </div>
            <div className="feed-main">
              <div className="feed-line">
                <span
                  className="feed-who"
                  style={{ color: person.color }}
                >
                  {person.name}
                </span>
                <span className="feed-verb">worked on</span>
                <span className="feed-pill">{cat.label}</span>
              </div>
              <div className="feed-note">{e.note}</div>
            </div>
            <span className="feed-time">{relativeTime(e.createdAt)}</span>
            <button
              className="feed-del"
              onClick={() => deleteEntry(e.id)}
              aria-label="Delete entry"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
