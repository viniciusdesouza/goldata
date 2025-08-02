import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function fetchWithCache({
  cacheKey,
  url,
  headers,
  ttl = 60,
}: {
  cacheKey: string;
  url: string;
  headers: Record<string, string>;
  ttl?: number;
}) {
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`External API error: ${res.status}`);
  const data = await res.json();
  await redis.set(cacheKey, JSON.stringify(data), "EX", ttl);
  return data;
}