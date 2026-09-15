import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";

const CHANGE_EVENT = "neopoly:local-data-changed";
export const STORAGE_ERROR_EVENT = "neopoly:storage-error";
type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "setItem">;

export function readJSON<T>(key: string, fallback: T, storage?: StorageReader): T {
  try {
    const raw = (storage ?? window.localStorage).getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    if (fallback !== null && (parsed === null || typeof parsed !== typeof fallback)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function removeStoredValue(key: string): boolean {
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
    return true;
  } catch { return false; }
}

/** A failed write must not be reported as a successful save. */
export function writeJSON(key: string, value: unknown, storage?: StorageWriter): boolean {
  try {
    (storage ?? window.localStorage).setItem(key, JSON.stringify(value));
    if (!storage && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
    }
    return true;
  } catch {
    if (!storage && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(STORAGE_ERROR_EVENT));
    }
    return false;
  }
}

export type StoredSetter<T> = (value: T | ((previous: T) => T)) => boolean;

// Subscribe to the same data in this tab as well as changes made in other tabs.
// No initial write: opening a screen must not overwrite existing user data.
export function useStoredState<T>(key: string, initialValue: T | (() => T)):
  [T, StoredSetter<T>] {
  const [fallback] = useState(initialValue);
  const subscribe = useCallback((notify: () => void) => {
    const local = (event: Event) => {
      if ((event as CustomEvent<string>).detail === key) notify();
    };
    const external = (event: StorageEvent) => {
      if (event.key === key || event.key === null) notify();
    };
    window.addEventListener(CHANGE_EVENT, local);
    window.addEventListener("storage", external);
    return () => {
      window.removeEventListener(CHANGE_EVENT, local);
      window.removeEventListener("storage", external);
    };
  }, [key]);
  const snapshot = useCallback(() => {
    try { return window.localStorage.getItem(key); } catch { return null; }
  }, [key]);
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  const value = useMemo(() => {
    if (raw === null) return fallback;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      if (fallback !== null && typeof parsed !== typeof fallback) return fallback;
      if (fallback !== null && parsed === null) return fallback;
      return parsed as T;
    } catch { return fallback; }
  }, [raw, fallback]);
  const setValue = useCallback<StoredSetter<T>>((update) => {
    const previous = readJSON(key, fallback);
    const next = typeof update === "function"
      ? (update as (previous: T) => T)(previous)
      : update;
    return writeJSON(key, next);
  }, [key, fallback]);
  return [value, setValue];
}

export function useStoredIdSet(key: string, initialIds: number[] = []):
  [Set<number>, StoredSetter<Set<number>>] {
  const [ids, setIds] = useStoredState<number[]>(key, initialIds);
  const value = useMemo(() => new Set(ids), [ids]);
  const setValue = useCallback<StoredSetter<Set<number>>>((update) =>
    setIds((previous) => Array.from(typeof update === "function"
      ? update(new Set(previous)) : update)), [setIds]);
  return [value, setValue];
}

export function useUndoStoredState<T>(key: string, initialValue: T):
  [T, StoredSetter<T>, () => void, boolean] {
  const [value, save] = useStoredState(key, initialValue);
  const history = useRef<T[]>([]);
  const [undoCount, setUndoCount] = useState(0);
  const update = useCallback<StoredSetter<T>>((next) => {
    const previous = readJSON(key, initialValue);
    const resolved = typeof next === "function" ? (next as (value: T) => T)(previous) : next;
    if (JSON.stringify(previous) === JSON.stringify(resolved)) return true;
    if (!save(resolved)) return false;
    history.current = [...history.current.slice(-9), previous];
    setUndoCount(history.current.length);
    return true;
  }, [key, initialValue, save]);
  const undo = useCallback(() => {
    if (!history.current.length) return;
    const previous = history.current.at(-1)!;
    if (save(previous)) { history.current.pop(); setUndoCount(history.current.length); }
  }, [save]);
  return [value, update, undo, undoCount > 0];
}
