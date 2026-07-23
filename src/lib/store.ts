import { useSyncExternalStore } from "react";
import type { CategoryId, LogEntry, UserId } from "./types";

const ENTRIES_KEY = "fivehobbies.entries.v1";
const USER_KEY = "fivehobbies.currentUser.v1";

/* ------------------------------------------------------------------ *
 * A tiny reactive localStorage store shared across the whole app.
 * Both people's data live in the same browser so they can compare and
 * cheer each other on. useSyncExternalStore keeps every view in sync,
 * including across tabs via the native `storage` event.
 * ------------------------------------------------------------------ */

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === ENTRIES_KEY || e.key === USER_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/* ----- entries ----- */

function readEntries(): LogEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LogEntry[]) : [];
  } catch {
    return [];
  }
}

let entriesCache: LogEntry[] = readEntries();

function getEntriesSnapshot(): LogEntry[] {
  return entriesCache;
}

function writeEntries(next: LogEntry[]) {
  entriesCache = next;
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(next));
  emit();
}

export function useEntries(): LogEntry[] {
  return useSyncExternalStore(subscribe, getEntriesSnapshot, () => entriesCache);
}

export function addEntry(user: UserId, category: CategoryId, note: string) {
  const entry: LogEntry = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    user,
    category,
    note: note.trim(),
    createdAt: Date.now(),
  };
  writeEntries([entry, ...entriesCache]);
  return entry;
}

export function deleteEntry(id: string) {
  writeEntries(entriesCache.filter((e) => e.id !== id));
}

/* ----- current user ----- */

let userCache: UserId | null =
  (localStorage.getItem(USER_KEY) as UserId | null) ?? null;

function getUserSnapshot(): UserId | null {
  return userCache;
}

export function useCurrentUser(): UserId | null {
  return useSyncExternalStore(subscribe, getUserSnapshot, () => userCache);
}

export function setCurrentUser(user: UserId | null) {
  userCache = user;
  if (user) localStorage.setItem(USER_KEY, user);
  else localStorage.removeItem(USER_KEY);
  emit();
}
