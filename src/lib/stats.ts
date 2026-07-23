import { CATEGORIES } from "./categories";
import type { CategoryId, LogEntry, UserId } from "./types";

const DAY = 86_400_000;

/** Milliseconds since the start of the current week (Monday, local time). */
export function startOfWeek(now = new Date()): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - day);
  return d.getTime();
}

export function startOfToday(now = new Date()): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function entriesFor(entries: LogEntry[], user: UserId): LogEntry[] {
  return entries.filter((e) => e.user === user);
}

export function thisWeek(entries: LogEntry[]): LogEntry[] {
  const from = startOfWeek();
  return entries.filter((e) => e.createdAt >= from);
}

/** Count per category for a set of entries. */
export function countByCategory(
  entries: LogEntry[],
): Record<CategoryId, number> {
  const base = Object.fromEntries(
    CATEGORIES.map((c) => [c.id, 0]),
  ) as Record<CategoryId, number>;
  for (const e of entries) base[e.category] += 1;
  return base;
}

/** How many of the five categories were touched this week (0–5). */
export function balanceScore(weekEntries: LogEntry[]): number {
  const counts = countByCategory(weekEntries);
  return CATEGORIES.reduce((n, c) => n + (counts[c.id] > 0 ? 1 : 0), 0);
}

/**
 * Consecutive-day streak: a day counts if the person logged at least one
 * hobby. Counts back from today (or yesterday, so a fresh morning doesn't
 * reset a live streak).
 */
export function currentStreak(userEntries: LogEntry[]): number {
  if (userEntries.length === 0) return 0;
  const days = new Set<number>();
  for (const e of userEntries) {
    const d = new Date(e.createdAt);
    d.setHours(0, 0, 0, 0);
    days.add(d.getTime());
  }
  let streak = 0;
  let cursor = startOfToday();
  if (!days.has(cursor)) cursor -= DAY; // grace for "not yet today"
  while (days.has(cursor)) {
    streak += 1;
    cursor -= DAY;
  }
  return streak;
}

export function relativeTime(ts: number, now = Date.now()): string {
  const diff = now - ts;
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const startToday = startOfToday();
  if (ts >= startToday - DAY && ts < startToday) return "yesterday";
  const days = Math.round(diff / DAY);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
