/**
 * Lightweight in-memory token bucket rate limiter.
 * Single-process only — swap for Upstash Ratelimit when scaling out.
 */

type Bucket = { tokens: number; last: number };

const buckets = new Map<string, Bucket>();

type Options = {
  /** Max tokens (burst capacity). */
  max: number;
  /** Window in ms over which `max` tokens are refilled. */
  windowMs: number;
};

export function rateLimit(key: string, opts: Options): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const refillPerMs = opts.max / opts.windowMs;

  const b = buckets.get(key) ?? { tokens: opts.max, last: now };
  const elapsed = now - b.last;
  b.tokens = Math.min(opts.max, b.tokens + elapsed * refillPerMs);
  b.last = now;

  if (b.tokens < 1) {
    const retryAfterMs = Math.ceil((1 - b.tokens) / refillPerMs);
    buckets.set(key, b);
    return { ok: false, retryAfterMs };
  }

  b.tokens -= 1;
  buckets.set(key, b);
  return { ok: true, retryAfterMs: 0 };
}

/** Best-effort client identifier from a Next.js Request. */
export function clientKey(req: Request, prefix: string): string {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const ip = xff.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  return `${prefix}:${ip}`;
}
