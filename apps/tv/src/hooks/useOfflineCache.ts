// SmartStudy TV — Offline Cache Hook
// Caches exercise and child data to AsyncStorage so the app works
// even without a network connection. Uses stale-while-revalidate pattern.

import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_VERSION = 'v1';
const key = (id: string) => `smartstudy-tv-${CACHE_VERSION}-${id}`;
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  ts: number;
}

export function useOfflineCache() {
  const set = useCallback(async <T>(id: string, data: T) => {
    try {
      const entry: CacheEntry<T> = { data, ts: Date.now() };
      await AsyncStorage.setItem(key(id), JSON.stringify(entry));
    } catch {
      // Storage quota or serialisation error — silently skip
    }
  }, []);

  const get = useCallback(async <T>(id: string): Promise<T | null> => {
    try {
      const raw = await AsyncStorage.getItem(key(id));
      if (!raw) return null;
      const entry: CacheEntry<T> = JSON.parse(raw);
      // Return null if stale (older than 24h) — caller will re-fetch
      if (Date.now() - entry.ts > MAX_AGE_MS) return null;
      return entry.data;
    } catch {
      return null;
    }
  }, []);

  /**
   * Fetch-with-cache: returns cached data immediately while revalidating
   * in the background. onData is called twice if fresh data differs.
   */
  const fetchWithCache = useCallback(
    async <T>(
      cacheId: string,
      fetcher: () => Promise<T>,
      onData: (data: T, fromCache: boolean) => void,
    ) => {
      // 1. Serve cache immediately if available
      const cached = await get<T>(cacheId);
      if (cached) onData(cached, true);

      // 2. Fetch fresh data
      try {
        const fresh = await fetcher();
        await set(cacheId, fresh);
        onData(fresh, false);
      } catch (err) {
        // Network error — if we had cache we already served it, so just log
        if (!cached) throw err;
        console.warn('[Cache] Network error, using stale cache for', cacheId);
      }
    },
    [get, set],
  );

  return { set, get, fetchWithCache };
}
