"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const DEFAULT_INTERVAL_MS = 12 * 60 * 60 * 1000;
const STORAGE_KEY_PREFIX = "swimtraining:last-auto-refresh:";

type AutoRefreshProps = {
  intervalMs?: number;
};

function readTimestamp(storageKey: string) {
  const value = window.localStorage.getItem(storageKey);
  const timestamp = value ? Number(value) : Number.NaN;

  return Number.isFinite(timestamp) ? timestamp : Date.now();
}

function writeTimestamp(storageKey: string, timestamp = Date.now()) {
  window.localStorage.setItem(storageKey, String(timestamp));
}

export function AutoRefresh({ intervalMs = DEFAULT_INTERVAL_MS }: AutoRefreshProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${pathname}`;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const scheduleRefresh = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const elapsedMs = Date.now() - readTimestamp(storageKey);
      const delayMs = Math.max(intervalMs - elapsedMs, 1000);
      timeoutId = setTimeout(refreshIfStale, delayMs);
    };

    const refreshIfStale = () => {
      const now = Date.now();
      const lastRefresh = readTimestamp(storageKey);

      if (now - lastRefresh >= intervalMs) {
        writeTimestamp(storageKey, now);
        router.refresh();
      }

      scheduleRefresh();
    };

    if (!window.localStorage.getItem(storageKey)) {
      writeTimestamp(storageKey);
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshIfStale();
      }
    };

    scheduleRefresh();
    window.addEventListener("focus", refreshIfStale);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      window.removeEventListener("focus", refreshIfStale);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [intervalMs, pathname, router]);

  return null;
}
