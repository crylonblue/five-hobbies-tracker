import { useSyncExternalStore } from "react";
import type { CategoryId, LogEntry, UserId } from "./types";

const USER_KEY = "fivehobbies.currentUser.v1";
const API = "/api/entries";
const POLL_MS = 6000;

/* ------------------------------------------------------------------ *
 * Reactive store. Entries live in Neon Postgres (shared across both
 * phones) and are synced here via fetch + light polling. The chosen
 * name is a per-device preference, so it stays in localStorage.
 * ------------------------------------------------------------------ */

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

/* ----- entries (remote) ----- */

let entries: LogEntry[] = [];
let loading = true;
let snapshot: { entries: LogEntry[]; loading: boolean } = { entries, loading };

function commit(next: LogEntry[], isLoading = false) {
  entries = next;
  loading = isLoading;
  snapshot = { entries, loading };
  emit();
}

async function fetchEntries() {
  try {
    const res = await fetch(API, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as LogEntry[];
    if (Array.isArray(data)) commit(data);
  } catch (err) {
    // Keep whatever we have; just stop the initial spinner.
    if (loading) commit(entries, false);
    console.warn("[store] fetch failed", err);
  }
}

let pollTimer: ReturnType<typeof setInterval> | null = null;
function startSync() {
  if (pollTimer) return;
  fetchEntries();
  pollTimer = setInterval(fetchEntries, POLL_MS);
  window.addEventListener("focus", fetchEntries);
  document.addEventListener("visibilitychange", onVisible);
}
function stopSync() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
  window.removeEventListener("focus", fetchEntries);
  document.removeEventListener("visibilitychange", onVisible);
}
function onVisible() {
  if (document.visibilityState === "visible") fetchEntries();
}

function subscribe(listener: () => void) {
  const wasEmpty = listeners.size === 0;
  listeners.add(listener);
  if (wasEmpty) startSync();

  const onStorage = (e: StorageEvent) => {
    if (e.key === USER_KEY) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    if (listeners.size === 0) stopSync();
  };
}

export function useEntriesStore(): { entries: LogEntry[]; loading: boolean } {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => snapshot,
  );
}

export function useEntries(): LogEntry[] {
  return useEntriesStore().entries;
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Optimistically add, then persist to the shared DB. */
export function addEntry(user: UserId, category: CategoryId, note: string) {
  const entry: LogEntry = {
    id: newId(),
    user,
    category,
    note: note.trim(),
    createdAt: Date.now(),
  };
  commit([entry, ...entries]);

  fetch(API, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(entry),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    })
    .catch((err) => {
      console.warn("[store] save failed, rolling back", err);
      commit(entries.filter((e) => e.id !== entry.id));
    });

  return entry;
}

/** Optimistically remove, then delete from the shared DB. */
export function deleteEntry(id: string) {
  const prev = entries;
  commit(entries.filter((e) => e.id !== id));

  fetch(`${API}?id=${encodeURIComponent(id)}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    })
    .catch((err) => {
      console.warn("[store] delete failed, restoring", err);
      commit(prev);
    });
}

/* ----- current user (local preference) ----- */

let userCache: UserId | null =
  (localStorage.getItem(USER_KEY) as UserId | null) ?? null;

export function useCurrentUser(): UserId | null {
  return useSyncExternalStore(
    subscribe,
    () => userCache,
    () => userCache,
  );
}

export function setCurrentUser(user: UserId | null) {
  userCache = user;
  if (user) localStorage.setItem(USER_KEY, user);
  else localStorage.removeItem(USER_KEY);
  emit();
}
