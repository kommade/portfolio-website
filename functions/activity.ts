import "server-only";
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();
export async function logger(methodName: string, redisFunction: string, key: string) {
    const logLine = {
        redisFunction: redisFunction,
        arg: key,
        initiator: methodName,
        time: new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', timeStyle: "medium", dateStyle: "medium" }).format(new Date())
    }
    redis.rpush('log', JSON.stringify(logLine))
}
