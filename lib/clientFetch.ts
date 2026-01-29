export type ClientFetchCacheOptions = {
  /**
   * Cache TTL (ms). Use 0 to cache indefinitely for the session.
   * Default: 0
   */
  ttlMs?: number;
};

export type ClientFetchDedupeOptions = ClientFetchCacheOptions & {
  /**
   * If true, de-dupe in-flight requests for non-GET methods too.
   * Default: true
   */
  dedupeMutations?: boolean;
};

type CacheEntry<T> = { value: T; expiresAt: number | null };

const inflight = new Map<string, Promise<unknown>>();
const cache = new Map<string, CacheEntry<unknown>>();

function now() {
  return Date.now();
}

function isFresh(entry: CacheEntry<unknown>) {
  return entry.expiresAt === null || entry.expiresAt > now();
}

/**
 * Client-side JSON fetch with request de-duplication (in-flight) + memory cache.
 * Designed to prevent double network calls in React 18 dev Strict Mode.
 *
 * - GET: de-dupe + cache (memory)
 * - POST/PUT/DELETE: de-dupe in-flight only (no caching)
 */
export async function fetchJsonCached<T>(
  url: string,
  init?: RequestInit,
  options?: ClientFetchDedupeOptions
): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const ttlMs = options?.ttlMs ?? 0;
  const dedupeMutations = options?.dedupeMutations ?? true;

  const bodyKey =
    typeof init?.body === "string"
      ? init.body
      : init?.body
        ? Object.prototype.toString.call(init.body)
        : "";

  const key = `${method} ${url} ${bodyKey}`;

  // Only cache safe reads
  const canCache = method === "GET" && !init?.body;
  const canDedupe = canCache || (dedupeMutations && method !== "GET");

  if (canCache) {
    const existing = cache.get(key);
    if (existing && isFresh(existing)) {
      return existing.value as T;
    }
  }

  if (canDedupe) {
    const existingInflight = inflight.get(key);
    if (existingInflight) {
      return (await existingInflight) as T;
    }
  }

  const promise = (async () => {
    const res = await fetch(url, init);
    const data = (await res.json()) as T;

    if (canCache) {
      const expiresAt = ttlMs <= 0 ? null : now() + ttlMs;
      cache.set(key, { value: data, expiresAt });
    }

    return data;
  })();

  if (canDedupe) inflight.set(key, promise);

  try {
    return await promise;
  } finally {
    if (canDedupe) inflight.delete(key);
  }
}

