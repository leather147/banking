"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { ZodType } from "zod";

const MAX_AGE = 60 * 60 * 24 * 365;
const SERVER_SNAPSHOT = "__server__";
const MISSING_SNAPSHOT = "__missing__";
const COOKIE_EVENT = "lumen-cookie-change";

export function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const prefix = `${encodeURIComponent(name)}=`;
  const item = document.cookie.split("; ").find((part) => part.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : undefined;
}

export function setCookie(name: string, value: unknown) {
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${encodeURIComponent(name)}=${encoded}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`;
  // document.cookie has no native subscription API. The scoped event keeps
  // independent consumers in sync without polling or duplicating local state.
  window.dispatchEvent(new CustomEvent(COOKIE_EVENT, { detail: name }));
}

export function useCookieState<T>(name: string, schema: ZodType<T>, fallback: T) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const listener = (event: Event) => {
      if ((event as CustomEvent<string>).detail === name) onStoreChange();
    };
    window.addEventListener(COOKIE_EVENT, listener);
    return () => window.removeEventListener(COOKIE_EVENT, listener);
  }, [name]);
  const getSnapshot = useCallback(() => getCookie(name) ?? MISSING_SNAPSHOT, [name]);
  // Stable sentinel strings make the server snapshot deterministic while the
  // client cookie is still unknown, preventing hydration-only state drift.
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  const value = useMemo(() => {
    if (raw === SERVER_SNAPSHOT || raw === MISSING_SNAPSHOT) return fallback;
    try {
      const parsed = schema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : fallback;
    } catch {
      return fallback;
    }
  }, [fallback, raw, schema]);

  const update = useCallback(
    (next: T | ((current: T) => T)) => {
      const resolved = typeof next === "function" ? (next as (current: T) => T)(value) : next;
      setCookie(name, resolved);
    },
    [name, value],
  );

  return [value, update, raw !== SERVER_SNAPSHOT] as const;
}
