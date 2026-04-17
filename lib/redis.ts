import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export default redis

export async function withCache<T>(
    key: string,
    ttl: number,
    fn: () => Promise<T>
): Promise<T> {
    try {
        const cached = await redis.get<T>(key)
        if (cached !== null) return cached
        const data = await fn()
        await redis.set(key, data, { ex: ttl })
        return data
    } catch {
        return fn()
    }
}
