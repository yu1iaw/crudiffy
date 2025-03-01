import "server-only";

// import { Redis } from "@upstash/redis";

// export const redis = Redis.fromEnv()
/* 
current latest @upstash/redis@1.34.4 doesn't include merge method. 
*/

import Redis from "ioredis";

export const redis = new Redis(`rediss://default:${process.env.UPSTASH_REDIS_REST_TOKEN}@${process.env.UPSTASH_REDIS_REST_URL}:6379`);

